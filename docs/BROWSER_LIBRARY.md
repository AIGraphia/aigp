# AIGP Browser JavaScript Library

## Overview

Lightweight, dependency-free browser library for working with AIGP diagrams.

---

## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@1.0/dist/aigp.min.js"></script>
```

### Via pnpm

```bash
pnpm add @aigraphia/browser
```

```javascript
import AIGP from '@aigraphia/browser';
```

---

## Package Structure

```
@aigraphia/browser/
├── dist/
│   ├── aigp.js           # Development build
│   ├── aigp.min.js       # Production build (12KB gzipped)
│   ├── aigp.esm.js       # ES Module
│   └── aigp.d.ts         # TypeScript definitions
├── src/
│   ├── index.ts          # Main entry
│   ├── renderer.ts       # SVG rendering
│   ├── validation.ts     # Client-side validation
│   ├── converters.ts     # Format conversion
│   ├── layout.ts         # Browser-safe layouts
│   └── utils.ts          # Helper functions
└── package.json
```

---

## API Reference

### Core Classes

#### AIGPDocument

```typescript
class AIGPDocument {
  constructor(data: AIGPData);

  // Properties
  schema: string;
  version: string;
  type: string;
  metadata: Metadata;
  graph: Graph;
  layout?: Layout;

  // Methods
  toJSON(): string;
  static fromJSON(json: string): AIGPDocument;
  static load(file: File): Promise<AIGPDocument>;
  save(filename: string): void;
  validate(): ValidationResult;
}
```

**Usage:**

```javascript
// Create from object
const diagram = new AIGP.Document({
  type: 'flowchart',
  metadata: { title: 'Process Flow' },
  graph: {
    nodes: [
      { id: 'start', type: 'start', label: 'Start' },
      { id: 'end', type: 'end', label: 'End' }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'end' }
    ]
  }
});

// Load from file
const input = document.getElementById('file-input');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const diagram = await AIGP.Document.load(file);
  console.log(diagram.metadata.title);
});

// Save to file
diagram.save('my-diagram.json');

// Validate
const result = diagram.validate();
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

### Rendering

#### render()

```typescript
function render(
  diagram: AIGPDocument,
  container: HTMLElement,
  options?: RenderOptions
): RenderInstance;

interface RenderOptions {
  width?: number;                  // Canvas width (default: container width)
  height?: number;                 // Canvas height (default: container height)
  theme?: 'light' | 'dark';        // Color theme
  interactive?: boolean;           // Enable zoom/pan (default: true)
  zoom?: boolean;                  // Enable zoom (default: true)
  pan?: boolean;                   // Enable pan (default: true)
  fit?: boolean;                   // Fit diagram to container (default: true)
  centerOnLoad?: boolean;          // Center on load (default: true)
  nodeClickHandler?: (node: Node) => void;
  edgeClickHandler?: (edge: Edge) => void;
}

interface RenderInstance {
  update(diagram: AIGPDocument): void;
  destroy(): void;
  zoomIn(): void;
  zoomOut(): void;
  zoomToFit(): void;
  center(): void;
  exportSVG(): string;
  exportPNG(): Promise<Blob>;
}
```

**Usage:**

```html
<div id="diagram-container" style="width: 800px; height: 600px;"></div>

<script>
const container = document.getElementById('diagram-container');

const diagram = new AIGP.Document({
  type: 'flowchart',
  metadata: { title: 'Demo' },
  graph: {
    nodes: [
      { id: 'a', type: 'start', label: 'Start' },
      { id: 'b', type: 'process', label: 'Process' },
      { id: 'c', type: 'end', label: 'End' }
    ],
    edges: [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'c' }
    ]
  }
});

const instance = AIGP.render(diagram, container, {
  theme: 'light',
  interactive: true,
  nodeClickHandler: (node) => {
    console.log('Clicked node:', node.label);
  }
});

// Update diagram
setTimeout(() => {
  diagram.graph.nodes.push({
    id: 'd',
    type: 'process',
    label: 'New Step'
  });
  instance.update(diagram);
}, 2000);

// Export
document.getElementById('export-btn').onclick = () => {
  const svg = instance.exportSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diagram.svg';
  a.click();
};
</script>
```

---

### Validation

```typescript
function validate(diagram: AIGPDocument): ValidationResult;

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

interface ValidationError {
  path: string;
  message: string;
  code: string;
}
```

**Usage:**

```javascript
const result = AIGP.validate(diagram);

if (!result.valid) {
  result.errors.forEach(error => {
    console.error(`${error.path}: ${error.message}`);
  });
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

---

### Conversion

```typescript
// To Mermaid
function toMermaid(diagram: AIGPDocument): string;

// From Mermaid
function fromMermaid(mermaid: string): AIGPDocument;

// To SVG
function toSVG(diagram: AIGPDocument, options?: SVGOptions): string;

interface SVGOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
}

// To Data URL (for <img> tags)
function toDataURL(diagram: AIGPDocument): Promise<string>;
```

**Usage:**

```javascript
// Convert to Mermaid
const mermaid = AIGP.toMermaid(diagram);
console.log(mermaid);
// Output:
// graph TD
//   A[Start] --> B[Process]
//   B --> C[End]

// Convert from Mermaid
const mermaidCode = `
graph TD
  A[Login] --> B{Valid?}
  B -->|Yes| C[Success]
  B -->|No| D[Error]
`;
const diagram = AIGP.fromMermaid(mermaidCode);

// Generate SVG
const svg = AIGP.toSVG(diagram, {
  width: 800,
  height: 600,
  theme: 'light'
});
document.getElementById('svg-container').innerHTML = svg;

// Generate data URL for <img>
const dataURL = await AIGP.toDataURL(diagram);
document.getElementById('img-preview').src = dataURL;
```

---

### Layout

```typescript
function applyLayout(
  diagram: AIGPDocument,
  algorithm?: LayoutAlgorithm,
  options?: LayoutOptions
): AIGPDocument;

type LayoutAlgorithm = 'hierarchical' | 'force' | 'circular' | 'grid' | 'radial';

interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  spacing?: number;
  nodeSpacing?: number;
  rankSeparation?: number;
  iterations?: number;  // For force-directed
}
```

**Usage:**

```javascript
// Apply hierarchical layout
const laid_out = AIGP.applyLayout(diagram, 'hierarchical', {
  direction: 'TB',
  spacing: 100,
  rankSeparation: 150
});

// Apply force-directed layout
const force_layout = AIGP.applyLayout(diagram, 'force', {
  iterations: 100,
  spacing: 50
});

// Render with layout
AIGP.render(laid_out, container);
```

---

### Utilities

```typescript
// Download as file
function downloadAsFile(diagram: AIGPDocument, filename: string): void;

// Copy to clipboard
function copyToClipboard(diagram: AIGPDocument): Promise<void>;

// Get diagram statistics
function getStats(diagram: AIGPDocument): DiagramStats;

interface DiagramStats {
  nodeCount: number;
  edgeCount: number;
  avgConnections: number;
  complexity: number;
  estimatedSize: number;  // bytes
}

// Optimize diagram
function optimize(diagram: AIGPDocument): AIGPDocument;
```

**Usage:**

```javascript
// Download
AIGP.downloadAsFile(diagram, 'my-diagram.json');

// Copy to clipboard
await AIGP.copyToClipboard(diagram);
console.log('Copied to clipboard!');

// Get stats
const stats = AIGP.getStats(diagram);
console.log(`Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}`);
console.log(`Complexity: ${stats.complexity}/100`);

// Optimize (remove orphans, simplify)
const optimized = AIGP.optimize(diagram);
```

---

## Complete Examples

### Example 1: Interactive Diagram Viewer

```html
<!DOCTYPE html>
<html>
<head>
  <title>AIGP Viewer</title>
  <script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@1.0/dist/aigp.min.js"></script>
  <style>
    #container { width: 100%; height: 600px; border: 1px solid #ccc; }
    #controls { margin: 10px 0; }
    button { margin-right: 10px; }
  </style>
</head>
<body>
  <div id="controls">
    <input type="file" id="file-input" accept=".json,.json">
    <button id="zoom-in">Zoom In</button>
    <button id="zoom-out">Zoom Out</button>
    <button id="zoom-fit">Fit</button>
    <button id="export-svg">Export SVG</button>
    <button id="export-png">Export PNG</button>
    <label>
      Theme:
      <select id="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  </div>
  <div id="container"></div>
  <div id="info"></div>

  <script>
    let instance = null;
    let diagram = null;

    // Load file
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      diagram = await AIGP.Document.load(file);

      const validation = diagram.validate();
      if (!validation.valid) {
        alert('Invalid diagram: ' + validation.errors.map(e => e.message).join(', '));
        return;
      }

      renderDiagram();

      // Show stats
      const stats = AIGP.getStats(diagram);
      document.getElementById('info').innerHTML = `
        <p><strong>${diagram.metadata.title || 'Untitled'}</strong></p>
        <p>Type: ${diagram.type}</p>
        <p>Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}</p>
        <p>Complexity: ${stats.complexity}/100</p>
      `;
    });

    function renderDiagram() {
      if (instance) {
        instance.destroy();
      }

      const container = document.getElementById('container');
      const theme = document.getElementById('theme').value;

      instance = AIGP.render(diagram, container, {
        theme,
        interactive: true,
        nodeClickHandler: (node) => {
          alert(`Clicked: ${node.label}`);
        }
      });
    }

    // Controls
    document.getElementById('zoom-in').onclick = () => instance?.zoomIn();
    document.getElementById('zoom-out').onclick = () => instance?.zoomOut();
    document.getElementById('zoom-fit').onclick = () => instance?.zoomToFit();

    document.getElementById('export-svg').onclick = () => {
      if (!instance) return;
      const svg = instance.exportSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
    };

    document.getElementById('export-png').onclick = async () => {
      if (!instance) return;
      const blob = await instance.exportPNG();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.png';
      a.click();
    };

    document.getElementById('theme').onchange = () => {
      if (diagram) renderDiagram();
    };
  </script>
</body>
</html>
```

### Example 2: Diagram Builder

```html
<!DOCTYPE html>
<html>
<head>
  <title>AIGP Builder</title>
  <script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@1.0/dist/aigp.min.js"></script>
  <style>
    #builder { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
    #sidebar { padding: 20px; background: #f5f5f5; }
    #canvas { padding: 20px; }
    #container { width: 100%; height: 500px; border: 1px solid #ccc; }
    input, select, button { width: 100%; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div id="builder">
    <div id="sidebar">
      <h3>Add Node</h3>
      <input id="node-id" placeholder="Node ID">
      <select id="node-type">
        <option value="start">Start</option>
        <option value="process">Process</option>
        <option value="decision">Decision</option>
        <option value="end">End</option>
      </select>
      <input id="node-label" placeholder="Label">
      <button id="add-node">Add Node</button>

      <h3>Add Edge</h3>
      <input id="edge-source" placeholder="Source Node ID">
      <input id="edge-target" placeholder="Target Node ID">
      <input id="edge-label" placeholder="Label (optional)">
      <button id="add-edge">Add Edge</button>

      <h3>Layout</h3>
      <select id="layout-algo">
        <option value="hierarchical">Hierarchical</option>
        <option value="force">Force-Directed</option>
        <option value="circular">Circular</option>
        <option value="grid">Grid</option>
      </select>
      <button id="apply-layout">Apply Layout</button>

      <button id="download">Download .json</button>
    </div>

    <div id="canvas">
      <h3>Preview</h3>
      <div id="container"></div>
    </div>
  </div>

  <script>
    let diagram = new AIGP.Document({
      type: 'flowchart',
      metadata: { title: 'My Diagram' },
      graph: { nodes: [], edges: [] }
    });

    let instance = null;

    function updatePreview() {
      const container = document.getElementById('container');

      if (instance) {
        instance.destroy();
      }

      instance = AIGP.render(diagram, container, {
        interactive: true
      });
    }

    // Add node
    document.getElementById('add-node').onclick = () => {
      const id = document.getElementById('node-id').value;
      const type = document.getElementById('node-type').value;
      const label = document.getElementById('node-label').value;

      if (!id || !label) {
        alert('ID and Label are required');
        return;
      }

      // Check if ID exists
      if (diagram.graph.nodes.find(n => n.id === id)) {
        alert('Node ID already exists');
        return;
      }

      diagram.graph.nodes.push({ id, type, label, data: {} });

      // Clear inputs
      document.getElementById('node-id').value = '';
      document.getElementById('node-label').value = '';

      updatePreview();
    };

    // Add edge
    document.getElementById('add-edge').onclick = () => {
      const source = document.getElementById('edge-source').value;
      const target = document.getElementById('edge-target').value;
      const label = document.getElementById('edge-label').value;

      if (!source || !target) {
        alert('Source and Target are required');
        return;
      }

      // Validate nodes exist
      if (!diagram.graph.nodes.find(n => n.id === source)) {
        alert('Source node not found');
        return;
      }
      if (!diagram.graph.nodes.find(n => n.id === target)) {
        alert('Target node not found');
        return;
      }

      const id = `e${diagram.graph.edges.length + 1}`;
      diagram.graph.edges.push({
        id,
        source,
        target,
        type: 'flow',
        label: label || undefined,
        data: {}
      });

      // Clear inputs
      document.getElementById('edge-source').value = '';
      document.getElementById('edge-target').value = '';
      document.getElementById('edge-label').value = '';

      updatePreview();
    };

    // Apply layout
    document.getElementById('apply-layout').onclick = () => {
      const algo = document.getElementById('layout-algo').value;
      diagram = AIGP.applyLayout(diagram, algo);
      updatePreview();
    };

    // Download
    document.getElementById('download').onclick = () => {
      AIGP.downloadAsFile(diagram, 'diagram.json');
    };

    // Initial render
    updatePreview();
  </script>
</body>
</html>
```

---

## Build Configuration

### package.json

```json
{
  "name": "@aigraphia/browser",
  "version": "1.0.0",
  "description": "Browser library for AIGP diagrams",
  "main": "dist/aigp.js",
  "module": "dist/aigp.esm.js",
  "types": "dist/aigp.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "vitest"
  },
  "devDependencies": {
    "@rollup/plugin-typescript": "^11.0.0",
    "rollup": "^4.0.0",
    "rollup-plugin-terser": "^7.0.2",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["aigp", "diagram", "browser", "visualization"]
}
```

### rollup.config.js

```javascript
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default [
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/aigp.js',
      format: 'umd',
      name: 'AIGP'
    },
    plugins: [typescript()]
  },
  // Minified UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/aigp.min.js',
      format: 'umd',
      name: 'AIGP'
    },
    plugins: [typescript(), terser()]
  },
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/aigp.esm.js',
      format: 'es'
    },
    plugins: [typescript()]
  }
];
```

---

## Performance

- **Bundle size**: 42KB (12KB gzipped)
- **Rendering**: <500ms for 200 nodes
- **Validation**: <50ms for 1000 nodes
- **Layout computation**: <2s for 500 nodes (hierarchical)
- **SVG export**: <300ms for 200 nodes

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import AIGP, { AIGPDocument, RenderOptions, ValidationResult } from '@aigraphia/browser';

const diagram: AIGPDocument = new AIGP.Document({ ... });
const result: ValidationResult = diagram.validate();
```

---

## CDN Versions

```html
<!-- Latest -->
<script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@latest/dist/aigp.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@1.0.0/dist/aigp.min.js"></script>

<!-- Unpkg -->
<script src="https://unpkg.com/@aigraphia/browser@1.0.0/dist/aigp.min.js"></script>
```

---

## Resources

- NPM: https://www.npmjs.com/package/@aigraphia/browser
- GitHub: https://github.com/aigp/aigp/tree/main/packages/browser
- Documentation: https://aigp.dev/docs/browser
- Examples: https://aigp.dev/examples/browser
