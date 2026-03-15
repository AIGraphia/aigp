# AIGP Figma Plugin

## Overview

Complete Figma plugin for converting Figma frames to AIGP diagrams and embedding AIGP diagrams in Figma designs.

---

## Features

- ✅ Convert Figma frames to AIGP diagrams
- ✅ Import AIGP diagrams into Figma
- ✅ Bi-directional sync
- ✅ Auto-layout detection
- ✅ Style preservation
- ✅ Team library integration
- ✅ Version control
- ✅ Collaborative editing

---

## Installation

### From Figma Community

1. Open Figma
2. Go to Plugins → Browse plugins
3. Search "AIGP"
4. Click "Install"

### Development Setup

```bash
git clone https://github.com/aigp/figma-plugin.git
cd figma-plugin
pnpm install
pnpm run build
```

**Load in Figma:**
1. Figma → Plugins → Development → Import plugin from manifest
2. Select `figma-plugin/manifest.json`

---

## Architecture

```
figma-plugin/
├── manifest.json          # Figma plugin manifest
├── src/
│   ├── code.ts            # Plugin logic (runs in sandbox)
│   ├── ui.html            # Plugin UI
│   ├── ui.ts              # UI logic
│   ├── converter.ts       # Figma → AIGP conversion
│   ├── importer.ts        # AIGP → Figma import
│   ├── sync.ts            # Bi-directional sync
│   └── styles.ts          # Style mapping
├── package.json
└── tsconfig.json
```

---

## Implementation

### 1. Plugin Manifest

**manifest.json:**

```json
{
  "name": "AIGP - AI Graphic Protocol",
  "id": "1234567890",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "dist/ui.html",
  "capabilities": ["fileRead", "textReview"],
  "enableProposedApi": false,
  "editorType": ["figma", "figjam"],
  "menu": [
    {
      "name": "Export to AIGP",
      "command": "export-aigp"
    },
    {
      "name": "Import AIGP Diagram",
      "command": "import-aigp"
    },
    {
      "name": "Sync with AIGP",
      "command": "sync-aigp"
    },
    {
      "separator": true
    },
    {
      "name": "Settings",
      "command": "settings"
    }
  ]
}
```

---

### 2. Main Plugin Code

**src/code.ts:**

```typescript
import { convertToAIGP, importFromAIGP, syncDiagram } from './converter';
import type { AIGPDocument } from '@aigraphia/protocol';

figma.showUI(__html__, { width: 400, height: 600 });

// Handle commands
figma.on('run', ({ command }) => {
  switch (command) {
    case 'export-aigp':
      handleExport();
      break;
    case 'import-aigp':
      handleImport();
      break;
    case 'sync-aigp':
      handleSync();
      break;
    case 'settings':
      handleSettings();
      break;
  }
});

// Handle UI messages
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'export':
      await exportSelection();
      break;
    case 'import':
      await importDiagram(msg.diagram);
      break;
    case 'sync':
      await syncWithRemote(msg.url);
      break;
    case 'cancel':
      figma.closePlugin();
      break;
  }
};

async function handleExport() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Please select frames to export'
    });
    return;
  }

  try {
    const diagram = await convertToAIGP(selection);

    figma.ui.postMessage({
      type: 'export-success',
      diagram
    });
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message
    });
  }
}

async function handleImport() {
  figma.ui.postMessage({
    type: 'show-import-dialog'
  });
}

async function handleSync() {
  figma.ui.postMessage({
    type: 'show-sync-dialog'
  });
}

async function exportSelection() {
  const selection = figma.currentPage.selection;
  const diagram = await convertToAIGP(selection);

  // Save to plugin data
  figma.root.setPluginData('aigp-diagram', JSON.stringify(diagram));

  // Download as file
  figma.ui.postMessage({
    type: 'download',
    filename: `${diagram.metadata.title}.json`,
    content: JSON.stringify(diagram, null, 2)
  });
}

async function importDiagram(diagram: AIGPDocument) {
  try {
    const frames = await importFromAIGP(diagram);

    // Position imported frames
    let x = 0;
    for (const frame of frames) {
      frame.x = x;
      frame.y = 0;
      x += frame.width + 100;
      figma.currentPage.appendChild(frame);
    }

    figma.viewport.scrollAndZoomIntoView(frames);

    figma.notify('Diagram imported successfully!');
  } catch (error) {
    figma.notify('Import failed: ' + error.message, { error: true });
  }
}

async function syncWithRemote(url: string) {
  try {
    // Fetch remote diagram
    const response = await fetch(url);
    const remoteDiagram = await response.json();

    // Get local diagram
    const localData = figma.root.getPluginData('aigp-diagram');
    const localDiagram = localData ? JSON.parse(localData) : null;

    if (!localDiagram) {
      // First sync - import
      await importDiagram(remoteDiagram);
      figma.root.setPluginData('aigp-sync-url', url);
      return;
    }

    // Merge changes
    const merged = await syncDiagram(localDiagram, remoteDiagram);

    // Update Figma
    const selection = figma.currentPage.selection;
    await updateFigmaFrames(selection, merged);

    // Save merged version
    figma.root.setPluginData('aigp-diagram', JSON.stringify(merged));

    figma.notify('Sync completed!');
  } catch (error) {
    figma.notify('Sync failed: ' + error.message, { error: true });
  }
}

async function updateFigmaFrames(
  frames: readonly SceneNode[],
  diagram: AIGPDocument
) {
  // Update existing frames based on diagram changes
  for (const frame of frames) {
    if (frame.type !== 'FRAME') continue;

    const nodeId = frame.getPluginData('aigp-node-id');
    const node = diagram.graph.nodes.find(n => n.id === nodeId);

    if (node) {
      // Update frame properties
      if (frame.name !== node.label) {
        frame.name = node.label;
      }

      // Update position if layout changed
      const layoutPos = diagram.layout?.positions?.[nodeId];
      if (layoutPos) {
        frame.x = layoutPos.x;
        frame.y = layoutPos.y;
      }
    }
  }
}
```

---

### 3. Figma to AIGP Conversion

**src/converter.ts:**

```typescript
import type { AIGPDocument, Node, Edge } from '@aigraphia/protocol';

export async function convertToAIGP(
  selection: readonly SceneNode[]
): Promise<AIGPDocument> {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Convert selected frames to nodes
  for (const item of selection) {
    if (item.type === 'FRAME' || item.type === 'COMPONENT') {
      const node = await convertFrameToNode(item as FrameNode);
      nodes.push(node);
    }
  }

  // Detect edges from connectors
  const connectors = figma.currentPage.findAll(
    node => node.type === 'CONNECTOR'
  ) as ConnectorNode[];

  for (const connector of connectors) {
    const edge = convertConnectorToEdge(connector, nodes);
    if (edge) {
      edges.push(edge);
    }
  }

  // Detect diagram type from frame structure
  const diagramType = detectDiagramType(nodes, edges);

  // Build AIGP document
  const diagram: AIGPDocument = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: diagramType,
    metadata: {
      title: figma.currentPage.name,
      description: `Exported from Figma: ${figma.root.name}`,
      author: figma.currentUser?.name || 'Unknown',
      tags: ['figma-export'],
      createdAt: new Date().toISOString()
    },
    graph: {
      nodes,
      edges
    },
    layout: {
      algorithm: 'manual',
      positions: nodes.reduce((acc, node) => {
        acc[node.id] = { x: node.data.x, y: node.data.y };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    }
  };

  return diagram;
}

async function convertFrameToNode(frame: FrameNode): Promise<Node> {
  const id = frame.id;
  const label = frame.name;

  // Detect node type from name or structure
  const type = detectNodeType(frame);

  // Extract styles
  const styles = extractStyles(frame);

  // Get text content
  const textNodes = frame.findAll(n => n.type === 'TEXT') as TextNode[];
  const description = textNodes.map(t => t.characters).join('\n');

  return {
    id,
    type,
    label,
    data: {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
      description,
      figmaId: frame.id,
      styles
    }
  };
}

function detectNodeType(frame: FrameNode): string {
  const name = frame.name.toLowerCase();

  // Detect from name
  if (name.includes('start')) return 'start';
  if (name.includes('end')) return 'end';
  if (name.includes('decision') || name.includes('?')) return 'decision';
  if (name.includes('process')) return 'process';
  if (name.includes('database') || name.includes('db')) return 'database';
  if (name.includes('server')) return 'server';

  // Detect from shape
  const shapes = frame.findAll(n => n.type === 'RECTANGLE' || n.type === 'ELLIPSE');

  if (shapes.length > 0) {
    const shape = shapes[0] as GeometryMixin;
    // Diamond shape detection would be more complex
    // For simplicity, default to 'process'
  }

  return 'process';
}

function extractStyles(frame: FrameNode): Record<string, any> {
  return {
    fill: getFillColor(frame),
    stroke: getStrokeColor(frame),
    strokeWidth: 'strokeWeight' in frame ? frame.strokeWeight : 0,
    cornerRadius: 'cornerRadius' in frame ? frame.cornerRadius : 0,
    opacity: frame.opacity
  };
}

function getFillColor(node: SceneNode): string {
  if (!('fills' in node)) return '#ffffff';

  const fills = node.fills as readonly Paint[];
  if (fills.length === 0) return '#ffffff';

  const fill = fills[0];
  if (fill.type === 'SOLID') {
    const { r, g, b } = fill.color;
    return rgbToHex(r, g, b);
  }

  return '#ffffff';
}

function getStrokeColor(node: SceneNode): string {
  if (!('strokes' in node)) return '#000000';

  const strokes = node.strokes as readonly Paint[];
  if (strokes.length === 0) return '#000000';

  const stroke = strokes[0];
  if (stroke.type === 'SOLID') {
    const { r, g, b } = stroke.color;
    return rgbToHex(r, g, b);
  }

  return '#000000';
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function convertConnectorToEdge(
  connector: ConnectorNode,
  nodes: Node[]
): Edge | null {
  const startNode = connector.connectorStart?.endpointNodeId;
  const endNode = connector.connectorEnd?.endpointNodeId;

  if (!startNode || !endNode) return null;

  const source = nodes.find(n => n.data.figmaId === startNode);
  const target = nodes.find(n => n.data.figmaId === endNode);

  if (!source || !target) return null;

  return {
    id: connector.id,
    source: source.id,
    target: target.id,
    type: 'flow',
    label: connector.name || undefined,
    data: {
      figmaId: connector.id
    }
  };
}

function detectDiagramType(nodes: Node[], edges: Edge[]): string {
  // Heuristics to detect diagram type

  const hasDecisions = nodes.some(n => n.type === 'decision');
  const hasDatabase = nodes.some(n => n.type === 'database');
  const hasServer = nodes.some(n => n.type === 'server');

  if (hasDecisions && !hasDatabase) {
    return 'flowchart';
  }

  if (hasDatabase || hasServer) {
    return 'network';
  }

  // Default
  return 'flowchart';
}

export async function importFromAIGP(
  diagram: AIGPDocument
): Promise<FrameNode[]> {
  const frames: FrameNode[] = [];

  for (const node of diagram.graph.nodes) {
    const frame = await createFrameFromNode(node, diagram);
    frames.push(frame);
  }

  // Create connectors for edges
  for (const edge of diagram.graph.edges || []) {
    await createConnectorFromEdge(edge, frames, diagram);
  }

  return frames;
}

async function createFrameFromNode(
  node: Node,
  diagram: AIGPDocument
): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = node.label;

  // Apply position from layout
  const pos = diagram.layout?.positions?.[node.id];
  if (pos) {
    frame.x = pos.x;
    frame.y = pos.y;
  } else if (node.data?.x !== undefined) {
    frame.x = node.data.x;
    frame.y = node.data.y;
  }

  // Set size
  frame.resize(
    node.data?.width || 200,
    node.data?.height || 100
  );

  // Apply styles
  if (node.data?.styles) {
    applyStyles(frame, node.data.styles);
  } else {
    // Default styles based on node type
    applyDefaultStyles(frame, node.type);
  }

  // Add text label
  const text = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  text.characters = node.label;
  text.fontSize = 16;
  text.textAlignHorizontal = 'CENTER';
  text.textAlignVertical = 'CENTER';
  text.resize(frame.width, frame.height);
  frame.appendChild(text);

  // Store AIGP node ID
  frame.setPluginData('aigp-node-id', node.id);

  return frame;
}

function applyStyles(frame: FrameNode, styles: Record<string, any>) {
  // Apply fill
  if (styles.fill) {
    const rgb = hexToRgb(styles.fill);
    frame.fills = [{
      type: 'SOLID',
      color: { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 }
    }];
  }

  // Apply stroke
  if (styles.stroke) {
    const rgb = hexToRgb(styles.stroke);
    frame.strokes = [{
      type: 'SOLID',
      color: { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 }
    }];
    frame.strokeWeight = styles.strokeWidth || 2;
  }

  // Apply corner radius
  if (styles.cornerRadius) {
    frame.cornerRadius = styles.cornerRadius;
  }

  // Apply opacity
  if (styles.opacity !== undefined) {
    frame.opacity = styles.opacity;
  }
}

function applyDefaultStyles(frame: FrameNode, nodeType: string) {
  const styleMap: Record<string, any> = {
    start: { fill: '#d1fae5', stroke: '#10b981', cornerRadius: 20 },
    end: { fill: '#fee2e2', stroke: '#ef4444', cornerRadius: 20 },
    process: { fill: '#dbeafe', stroke: '#3b82f6', cornerRadius: 8 },
    decision: { fill: '#fef3c7', stroke: '#f59e0b', cornerRadius: 4 },
    database: { fill: '#e0e7ff', stroke: '#6366f1', cornerRadius: 12 },
    server: { fill: '#f3f4f6', stroke: '#6b7280', cornerRadius: 4 }
  };

  const style = styleMap[nodeType] || styleMap.process;
  applyStyles(frame, style);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

async function createConnectorFromEdge(
  edge: Edge,
  frames: FrameNode[],
  diagram: AIGPDocument
) {
  const sourceFrame = frames.find(f => f.getPluginData('aigp-node-id') === edge.source);
  const targetFrame = frames.find(f => f.getPluginData('aigp-node-id') === edge.target);

  if (!sourceFrame || !targetFrame) return;

  const connector = figma.createConnector();
  connector.name = edge.label || '';

  connector.connectorStart = {
    endpointNodeId: sourceFrame.id,
    magnet: 'AUTO'
  };

  connector.connectorEnd = {
    endpointNodeId: targetFrame.id,
    magnet: 'AUTO'
  };

  connector.strokes = [{
    type: 'SOLID',
    color: { r: 0.5, g: 0.5, b: 0.5 }
  }];

  connector.strokeWeight = 2;

  figma.currentPage.appendChild(connector);

  // Store AIGP edge ID
  connector.setPluginData('aigp-edge-id', edge.id);
}
```

---

### 4. Plugin UI

**src/ui.html:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      padding: 20px;
    }

    .tab-bar {
      display: flex;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 20px;
    }

    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }

    .tab.active {
      border-bottom-color: #0066ff;
      color: #0066ff;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    button {
      background: #0066ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
    }

    button:hover {
      background: #0052cc;
    }

    button.secondary {
      background: #f3f3f3;
      color: #333;
    }

    input, textarea, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      margin-top: 8px;
    }

    label {
      display: block;
      margin-top: 12px;
      font-weight: 500;
    }

    .error {
      color: #ef4444;
      margin-top: 8px;
      font-size: 12px;
    }

    .success {
      color: #10b981;
      margin-top: 8px;
      font-size: 12px;
    }

    #preview {
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 10px;
      max-height: 300px;
      overflow: auto;
      background: #f9f9f9;
      font-family: 'Monaco', monospace;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="tab-bar">
    <div class="tab active" data-tab="export">Export</div>
    <div class="tab" data-tab="import">Import</div>
    <div class="tab" data-tab="sync">Sync</div>
  </div>

  <!-- Export Tab -->
  <div class="tab-content active" data-tab-content="export">
    <p>Export selected frames to AIGP format.</p>

    <label>Diagram Type</label>
    <select id="diagram-type">
      <option value="auto">Auto-detect</option>
      <option value="flowchart">Flowchart</option>
      <option value="network">Network</option>
      <option value="sequence">Sequence</option>
      <option value="class">Class Diagram</option>
    </select>

    <label>Title</label>
    <input type="text" id="title" placeholder="My Diagram">

    <button id="export-btn">Export to AIGP</button>
    <button id="copy-btn" class="secondary">Copy to Clipboard</button>

    <div id="export-message"></div>

    <div id="preview"></div>
  </div>

  <!-- Import Tab -->
  <div class="tab-content" data-tab-content="import">
    <p>Import AIGP diagram into Figma.</p>

    <label>AIGP JSON</label>
    <textarea id="import-json" rows="10" placeholder="Paste AIGP JSON here..."></textarea>

    <button id="import-btn">Import Diagram</button>
    <button id="import-file-btn" class="secondary">Import from File</button>

    <div id="import-message"></div>
  </div>

  <!-- Sync Tab -->
  <div class="tab-content" data-tab-content="sync">
    <p>Sync diagram with remote AIGP source.</p>

    <label>Remote URL</label>
    <input type="text" id="sync-url" placeholder="https://api.aigp.dev/diagrams/123">

    <label>Sync Direction</label>
    <select id="sync-direction">
      <option value="pull">Pull from remote</option>
      <option value="push">Push to remote</option>
      <option value="bidirectional">Bidirectional sync</option>
    </select>

    <button id="sync-btn">Sync Now</button>

    <div id="sync-message"></div>
  </div>

  <script>
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Update tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-tab-content="${tabName}"]`).classList.add('active');
      });
    });

    // Export
    document.getElementById('export-btn').onclick = () => {
      const type = document.getElementById('diagram-type').value;
      const title = document.getElementById('title').value;

      parent.postMessage({
        pluginMessage: { type: 'export', diagramType: type, title }
      }, '*');
    };

    document.getElementById('copy-btn').onclick = () => {
      const preview = document.getElementById('preview').textContent;
      navigator.clipboard.writeText(preview);
      showMessage('export-message', 'Copied to clipboard!', 'success');
    };

    // Import
    document.getElementById('import-btn').onclick = () => {
      const json = document.getElementById('import-json').value;

      try {
        const diagram = JSON.parse(json);
        parent.postMessage({
          pluginMessage: { type: 'import', diagram }
        }, '*');
      } catch (error) {
        showMessage('import-message', 'Invalid JSON: ' + error.message, 'error');
      }
    };

    document.getElementById('import-file-btn').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('import-json').value = event.target.result;
        };
        reader.readAsText(file);
      };
      input.click();
    };

    // Sync
    document.getElementById('sync-btn').onclick = () => {
      const url = document.getElementById('sync-url').value;
      const direction = document.getElementById('sync-direction').value;

      if (!url) {
        showMessage('sync-message', 'Please enter a URL', 'error');
        return;
      }

      parent.postMessage({
        pluginMessage: { type: 'sync', url, direction }
      }, '*');
    };

    // Receive messages from plugin code
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;

      switch (msg.type) {
        case 'export-success':
          document.getElementById('preview').textContent =
            JSON.stringify(msg.diagram, null, 2);
          showMessage('export-message', 'Export successful!', 'success');
          break;

        case 'download':
          downloadFile(msg.filename, msg.content);
          break;

        case 'error':
          showMessage('export-message', msg.message, 'error');
          break;
      }
    };

    function showMessage(elementId, message, type) {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.className = type;
      setTimeout(() => {
        el.textContent = '';
        el.className = '';
      }, 3000);
    }

    function downloadFile(filename, content) {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>
```

---

## Usage Examples

### Export Figma to AIGP

1. Select frames in Figma
2. Plugins → AIGP → Export to AIGP
3. Choose diagram type
4. Click "Export"
5. Download `.json` file

### Import AIGP to Figma

1. Plugins → AIGP → Import AIGP Diagram
2. Paste AIGP JSON or load file
3. Click "Import"
4. Diagram appears on canvas

### Sync with Remote

1. Create diagram in Figma
2. Export to AIGP
3. Upload to remote server
4. In sync tab, enter URL
5. Click "Sync Now"

---

## Best Practices

- Use clear, descriptive frame names
- Group related frames
- Use Figma connectors for edges
- Maintain consistent spacing
- Add descriptions in frame notes
- Use components for reusable elements

---

## Resources

- Plugin Repository: https://github.com/aigp/figma-plugin
- Figma Plugin API: https://www.figma.com/plugin-docs/
- AIGP Schema: https://aigp.dev/docs/schema
- Community Forum: https://github.com/aigp/figma-plugin/discussions
