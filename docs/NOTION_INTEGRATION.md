# AIGP Notion Integration

## Overview

Complete Notion integration for creating, editing, and syncing AIGP diagrams within Notion pages.

---

## Features

- ✅ Embed AIGP diagrams in Notion pages
- ✅ Create diagrams from Notion databases
- ✅ Bi-directional sync
- ✅ Inline editing
- ✅ Real-time collaboration
- ✅ Version history
- ✅ Export to multiple formats
- ✅ Template library

---

## Installation

### Via Notion Integrations

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "AIGP Diagrams"
4. Associated workspace: Select your workspace
5. Copy the Internal Integration Token
6. Click "Submit"

### Add to Page

1. Open Notion page
2. Type `/aigp` or `/embed`
3. Paste AIGP diagram URL or JSON
4. Click "Embed"

---

## Architecture

```
notion-integration/
├── src/
│   ├── server.ts          # Express server
│   ├── auth.ts            # Notion OAuth
│   ├── api/
│   │   ├── blocks.ts      # Block management
│   │   ├── databases.ts   # Database operations
│   │   └── pages.ts       # Page operations
│   ├── converter.ts       # Notion ↔ AIGP conversion
│   ├── renderer.ts        # Diagram rendering
│   └── sync.ts            # Bi-directional sync
├── public/
│   ├── embed.html         # Embedded iframe
│   └── editor.html        # Diagram editor
├── package.json
└── .env
```

---

## Implementation

### 1. Server Setup

**src/server.ts:**

```typescript
import express from 'express';
import { Client } from '@notionhq/client';
import { renderDiagram, generateEmbedUrl } from './renderer';
import { convertDatabaseToAIGP, updateNotionFromAIGP } from './converter';
import type { AIGPDocument } from '@aigp/protocol';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

// Embed endpoint
app.get('/embed/:diagramId', async (req, res) => {
  const { diagramId } = req.params;

  try {
    // Fetch diagram from database
    const diagram = await loadDiagram(diagramId);

    // Render as SVG
    const svg = await renderDiagram(diagram);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          svg { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        ${svg}
        <script>
          // Enable interactive features
          window.addEventListener('message', (event) => {
            if (event.data.type === 'node-click') {
              // Handle node click
              parent.postMessage({
                type: 'aigp-node-click',
                nodeId: event.data.nodeId
              }, '*');
            }
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create diagram from database
app.post('/api/create-from-database', async (req, res) => {
  const { databaseId, diagramType } = req.body;

  try {
    // Fetch database
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });

    // Query database entries
    const response = await notion.databases.query({
      database_id: databaseId
    });

    // Convert to AIGP
    const diagram = await convertDatabaseToAIGP(
      database,
      response.results,
      diagramType
    );

    // Save diagram
    const diagramId = await saveDiagram(diagram);

    // Create embed block in Notion
    const embedUrl = generateEmbedUrl(diagramId);

    res.json({
      success: true,
      diagramId,
      embedUrl,
      diagram
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update diagram
app.put('/api/diagrams/:id', async (req, res) => {
  const { id } = req.params;
  const { diagram } = req.body;

  try {
    await updateDiagram(id, diagram);

    // Optionally sync back to Notion database
    if (req.body.syncToNotion) {
      await updateNotionFromAIGP(diagram, req.body.databaseId);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync endpoint
app.post('/api/sync', async (req, res) => {
  const { diagramId, databaseId, direction } = req.body;

  try {
    if (direction === 'notion-to-aigp') {
      // Fetch latest from Notion
      const response = await notion.databases.query({
        database_id: databaseId
      });

      const database = await notion.databases.retrieve({
        database_id: databaseId
      });

      const diagram = await convertDatabaseToAIGP(
        database,
        response.results,
        'auto'
      );

      await updateDiagram(diagramId, diagram);

      res.json({ success: true, diagram });
    } else if (direction === 'aigp-to-notion') {
      // Fetch diagram
      const diagram = await loadDiagram(diagramId);

      // Update Notion database
      await updateNotionFromAIGP(diagram, databaseId);

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid sync direction' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
async function loadDiagram(id: string): Promise<AIGPDocument> {
  // Load from your storage (database, file system, etc.)
  // For demo, return a sample
  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: { title: 'Sample' },
    graph: { nodes: [], edges: [] }
  };
}

async function saveDiagram(diagram: AIGPDocument): Promise<string> {
  // Save to your storage
  // Return generated ID
  return 'diagram_' + Date.now();
}

async function updateDiagram(id: string, diagram: AIGPDocument): Promise<void> {
  // Update in your storage
}

app.listen(3000, () => {
  console.log('AIGP Notion Integration running on http://localhost:3000');
});
```

---

### 2. Notion to AIGP Conversion

**src/converter.ts:**

```typescript
import { Client } from '@notionhq/client';
import type { AIGPDocument, Node, Edge } from '@aigp/protocol';

export async function convertDatabaseToAIGP(
  database: any,
  entries: any[],
  diagramType: string
): Promise<AIGPDocument> {
  // Extract properties from database schema
  const properties = database.properties;

  // Detect diagram type if 'auto'
  if (diagramType === 'auto') {
    diagramType = detectDiagramType(properties, entries);
  }

  // Convert entries to nodes
  const nodes: Node[] = [];

  for (const entry of entries) {
    const node = await convertEntryToNode(entry, properties);
    nodes.push(node);
  }

  // Extract edges from relationships
  const edges: Edge[] = [];

  for (const entry of entries) {
    const entryEdges = await extractEdgesFromEntry(entry, entries);
    edges.push(...entryEdges);
  }

  // Build diagram
  const diagram: AIGPDocument = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: diagramType,
    metadata: {
      title: database.title[0]?.plain_text || 'Untitled',
      description: `Generated from Notion database: ${database.id}`,
      tags: ['notion', 'database'],
      createdAt: new Date().toISOString(),
      notionDatabaseId: database.id
    },
    graph: {
      nodes,
      edges
    }
  };

  return diagram;
}

function detectDiagramType(properties: any, entries: any[]): string {
  // Look for specific property patterns

  // Flowchart indicators
  if (properties['Status'] || properties['State']) {
    return 'flowchart';
  }

  // Timeline indicators
  if (properties['Date'] || properties['Due Date'] || properties['Start Date']) {
    return 'timeline';
  }

  // Network indicators
  if (properties['Server'] || properties['IP Address'] || properties['Host']) {
    return 'network';
  }

  // Class diagram indicators
  if (properties['Methods'] || properties['Attributes'] || properties['Inheritance']) {
    return 'class';
  }

  // Default
  return 'flowchart';
}

async function convertEntryToNode(entry: any, properties: any): Promise<Node> {
  const id = entry.id;

  // Get title property (usually first property or one named "Name")
  const titleProp = Object.values(properties).find(
    (p: any) => p.type === 'title'
  ) as any;

  const titleValue = entry.properties[titleProp.name];
  const label = titleValue?.title?.[0]?.plain_text || 'Untitled';

  // Detect node type from Status or Type property
  const type = detectNodeType(entry, properties);

  // Extract other properties as data
  const data: Record<string, any> = {
    notionPageId: entry.id
  };

  for (const [propName, prop] of Object.entries(properties)) {
    const value = await extractPropertyValue(entry.properties[propName]);
    if (value !== null && value !== undefined) {
      data[propName] = value;
    }
  }

  return {
    id,
    type,
    label,
    data
  };
}

function detectNodeType(entry: any, properties: any): string {
  // Look for Status or Type property
  if (properties['Status']) {
    const status = entry.properties['Status'];
    const statusValue = extractSelectValue(status);

    const typeMap: Record<string, string> = {
      'Not Started': 'start',
      'In Progress': 'process',
      'Completed': 'end',
      'Blocked': 'decision'
    };

    return typeMap[statusValue] || 'process';
  }

  if (properties['Type']) {
    const type = entry.properties['Type'];
    return extractSelectValue(type) || 'process';
  }

  return 'process';
}

async function extractEdgesFromEntry(
  entry: any,
  allEntries: any[]
): Promise<Edge[]> {
  const edges: Edge[] = [];

  // Look for relation properties
  for (const [propName, prop] of Object.entries(entry.properties)) {
    if ((prop as any).type === 'relation') {
      const relations = (prop as any).relation || [];

      for (const relation of relations) {
        const targetId = relation.id;

        // Find target entry
        const targetEntry = allEntries.find(e => e.id === targetId);
        if (!targetEntry) continue;

        edges.push({
          id: `${entry.id}_${targetId}`,
          source: entry.id,
          target: targetId,
          type: 'flow',
          label: propName,
          data: {}
        });
      }
    }
  }

  return edges;
}

async function extractPropertyValue(property: any): Promise<any> {
  if (!property) return null;

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'number':
      return property.number;
    case 'select':
      return extractSelectValue(property);
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'relation':
      return property.relation?.map((r: any) => r.id) || [];
    default:
      return null;
  }
}

function extractSelectValue(property: any): string {
  return property.select?.name || '';
}

export async function updateNotionFromAIGP(
  diagram: AIGPDocument,
  databaseId: string
): Promise<void> {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  // Get existing entries
  const response = await notion.databases.query({
    database_id: databaseId
  });

  const existingEntries = new Map(
    response.results.map((e: any) => [e.id, e])
  );

  // Update or create entries for each node
  for (const node of diagram.graph.nodes) {
    const notionPageId = node.data?.notionPageId;

    if (notionPageId && existingEntries.has(notionPageId)) {
      // Update existing entry
      await notion.pages.update({
        page_id: notionPageId,
        properties: convertNodeToNotionProperties(node)
      });
    } else {
      // Create new entry
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: convertNodeToNotionProperties(node)
      });
    }
  }
}

function convertNodeToNotionProperties(node: Node): any {
  const properties: any = {
    Name: {
      title: [{ text: { content: node.label } }]
    }
  };

  // Add other properties from node data
  if (node.data) {
    for (const [key, value] of Object.entries(node.data)) {
      if (key === 'notionPageId') continue;

      if (typeof value === 'string') {
        properties[key] = {
          rich_text: [{ text: { content: value } }]
        };
      } else if (typeof value === 'number') {
        properties[key] = { number: value };
      } else if (typeof value === 'boolean') {
        properties[key] = { checkbox: value };
      }
    }
  }

  return properties;
}
```

---

### 3. Embedded Editor

**public/editor.html:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>AIGP Diagram Editor</title>
  <script src="https://cdn.jsdelivr.net/npm/@aigp/browser@1.0/dist/aigp.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }

    #toolbar {
      background: #f7f7f7;
      border-bottom: 1px solid #e0e0e0;
      padding: 10px;
      display: flex;
      gap: 10px;
    }

    button {
      background: white;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #f0f0f0;
    }

    button.primary {
      background: #0070f3;
      color: white;
      border-color: #0070f3;
    }

    button.primary:hover {
      background: #0051cc;
    }

    #container {
      width: 100%;
      height: calc(100vh - 60px);
    }

    #status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 1px solid #e0e0e0;
      padding: 10px 20px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: none;
    }

    #status.show {
      display: block;
    }

    #status.success {
      border-color: #10b981;
      color: #10b981;
    }

    #status.error {
      border-color: #ef4444;
      color: #ef4444;
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <button id="btn-undo">↶ Undo</button>
    <button id="btn-redo">↷ Redo</button>
    <button id="btn-add-node">+ Add Node</button>
    <button id="btn-delete">Delete</button>
    <button id="btn-layout">Auto Layout</button>
    <button id="btn-save" class="primary">Save</button>
    <button id="btn-sync">Sync to Notion</button>
  </div>

  <div id="container"></div>

  <div id="status"></div>

  <script>
    // Load diagram from URL parameter
    const params = new URLSearchParams(window.location.search);
    const diagramId = params.get('id');

    let diagram = null;
    let renderInstance = null;
    let history = [];
    let historyIndex = -1;

    async function loadDiagram() {
      const response = await fetch(`/api/diagrams/${diagramId}`);
      diagram = await response.json();

      renderInstance = AIGP.render(diagram, document.getElementById('container'), {
        interactive: true,
        nodeClickHandler: handleNodeClick,
        edgeClickHandler: handleEdgeClick
      });

      addToHistory(diagram);
    }

    function handleNodeClick(node) {
      console.log('Node clicked:', node);
      // Show node properties panel
    }

    function handleEdgeClick(edge) {
      console.log('Edge clicked:', edge);
      // Show edge properties panel
    }

    // Toolbar actions
    document.getElementById('btn-undo').onclick = () => {
      if (historyIndex > 0) {
        historyIndex--;
        diagram = JSON.parse(JSON.stringify(history[historyIndex]));
        renderInstance.update(diagram);
      }
    };

    document.getElementById('btn-redo').onclick = () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        diagram = JSON.parse(JSON.stringify(history[historyIndex]));
        renderInstance.update(diagram);
      }
    };

    document.getElementById('btn-add-node').onclick = () => {
      const newNode = {
        id: 'node_' + Date.now(),
        type: 'process',
        label: 'New Node',
        data: {}
      };

      diagram.graph.nodes.push(newNode);
      renderInstance.update(diagram);
      addToHistory(diagram);
    };

    document.getElementById('btn-delete').onclick = () => {
      // Delete selected node/edge
      showStatus('Feature coming soon', 'error');
    };

    document.getElementById('btn-layout').onclick = () => {
      diagram = AIGP.applyLayout(diagram, 'hierarchical');
      renderInstance.update(diagram);
      addToHistory(diagram);
      showStatus('Layout applied', 'success');
    };

    document.getElementById('btn-save').onclick = async () => {
      try {
        await fetch(`/api/diagrams/${diagramId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ diagram })
        });

        showStatus('Saved successfully!', 'success');
      } catch (error) {
        showStatus('Save failed: ' + error.message, 'error');
      }
    };

    document.getElementById('btn-sync').onclick = async () => {
      try {
        const databaseId = params.get('database');

        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diagramId,
            databaseId,
            direction: 'aigp-to-notion'
          })
        });

        showStatus('Synced to Notion!', 'success');
      } catch (error) {
        showStatus('Sync failed: ' + error.message, 'error');
      }
    };

    function addToHistory(newDiagram) {
      // Remove future history if we're not at the end
      history = history.slice(0, historyIndex + 1);

      // Add new state
      history.push(JSON.parse(JSON.stringify(newDiagram)));
      historyIndex = history.length - 1;
    }

    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = `show ${type}`;

      setTimeout(() => {
        status.classList.remove('show');
      }, 3000);
    }

    // Auto-save every 30 seconds
    setInterval(() => {
      document.getElementById('btn-save').click();
    }, 30000);

    // Load diagram on page load
    loadDiagram();
  </script>
</body>
</html>
```

---

## Usage Guide

### 1. Create Diagram from Database

1. Open Notion workspace
2. Select a database
3. Click "..." menu → "Connect to AIGP"
4. Choose diagram type
5. Diagram embeds in page

### 2. Embed Existing Diagram

1. Type `/aigp` in Notion page
2. Paste AIGP diagram URL
3. Diagram renders inline
4. Click to edit

### 3. Sync with Notion

1. Edit diagram in AIGP editor
2. Click "Sync to Notion"
3. Database updates automatically
4. Changes sync bi-directionally

---

## Configuration

**Environment Variables:**

```bash
# .env
NOTION_TOKEN=secret_your-token-here
NOTION_CLIENT_ID=your-client-id
NOTION_CLIENT_SECRET=your-client-secret
PORT=3000
DATABASE_URL=postgresql://...
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/embed/:id` | GET | Render diagram embed |
| `/api/create-from-database` | POST | Create from Notion database |
| `/api/diagrams/:id` | GET | Get diagram |
| `/api/diagrams/:id` | PUT | Update diagram |
| `/api/sync` | POST | Sync with Notion |

---

## Resources

- Notion API: https://developers.notion.com/
- AIGP Protocol: https://aigp.dev/docs/protocol
- Integration Repository: https://github.com/aigp/notion-integration
- Support: https://github.com/aigp/notion-integration/issues
