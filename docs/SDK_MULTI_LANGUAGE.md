# AIGP Multi-Language SDK Documentation

## Overview

Complete SDK implementations for AIGP across popular programming languages.

---

## Go SDK

### Installation
```bash
go get github.com/AIGraphia/aigp-go
```

### Quick Start
```go
package main

import (
    "github.com/AIGraphia/aigp-go"
    "fmt"
)

func main() {
    // Create diagram
    diagram := aigp.NewDocument(aigp.FlowchartType)
    diagram.Metadata.Title = "User Authentication"

    // Add nodes
    diagram.AddNode("start", "start", "Login")
    diagram.AddNode("validate", "process", "Validate")
    diagram.AddNode("end", "end", "Complete")

    // Add edges
    diagram.AddEdge("e1", "start", "validate")
    diagram.AddEdge("e2", "validate", "end")

    // Validate
    if err := diagram.Validate(); err != nil {
        panic(err)
    }

    // Save
    diagram.SaveToFile("auth.json")
}
```

### Full API
```go
type Document struct {
    Schema   string
    Version  string
    Type     string
    Metadata Metadata
    Graph    Graph
    Layout   Layout
}

type Node struct {
    ID       string
    Type     string
    Label    string
    Data     map[string]interface{}
    Position *Position
}

type Edge struct {
    ID     string
    Source string
    Target string
    Type   string
    Label  string
}

// Functions
func NewDocument(docType string) *Document
func (d *Document) Validate() error
func (d *Document) AddNode(id, nodeType, label string) *Node
func (d *Document) AddEdge(id, source, target string) *Edge
func (d *Document) SaveToFile(path string) error
func LoadFromFile(path string) (*Document, error)
func ToMermaid(d *Document) string
func FromMermaid(mermaid string) (*Document, error)
```

---

## Rust SDK

### Installation
```toml
[dependencies]
aigp = "1.0"
```

### Quick Start
```rust
use aigp::{Document, Node, Edge, validate};

fn main() {
    // Create diagram
    let mut diagram = Document::new("flowchart");
    diagram.metadata.title = "User Authentication".to_string();

    // Add nodes
    diagram.add_node(Node {
        id: "start".to_string(),
        node_type: "start".to_string(),
        label: "Login".to_string(),
        ..Default::default()
    });

    diagram.add_node(Node {
        id: "validate".to_string(),
        node_type: "process".to_string(),
        label: "Validate".to_string(),
        ..Default::default()
    });

    // Add edges
    diagram.add_edge(Edge {
        id: "e1".to_string(),
        source: "start".to_string(),
        target: "validate".to_string(),
        ..Default::default()
    });

    // Validate
    match validate(&diagram) {
        Ok(_) => println!("Valid!"),
        Err(e) => eprintln!("Error: {}", e),
    }

    // Save
    diagram.save("auth.json").unwrap();
}
```

### Full API
```rust
pub struct Document {
    pub schema: String,
    pub version: String,
    pub doc_type: String,
    pub metadata: Metadata,
    pub graph: Graph,
    pub layout: Option<Layout>,
}

pub struct Node {
    pub id: String,
    pub node_type: String,
    pub label: String,
    pub data: HashMap<String, Value>,
    pub position: Option<Position>,
}

pub struct Edge {
    pub id: String,
    pub source: String,
    pub target: String,
    pub edge_type: String,
    pub label: Option<String>,
}

// Functions
impl Document {
    pub fn new(doc_type: &str) -> Self;
    pub fn add_node(&mut self, node: Node);
    pub fn add_edge(&mut self, edge: Edge);
    pub fn save(&self, path: &str) -> Result<()>;
    pub fn load(path: &str) -> Result<Self>;
}

pub fn validate(doc: &Document) -> Result<ValidationResult>;
pub fn to_mermaid(doc: &Document) -> String;
pub fn from_mermaid(mermaid: &str) -> Result<Document>;
```

---

## JavaScript/Browser Library

### Installation
```bash
pnpm add @aigraphia/browser
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@aigraphia/browser@1.0/dist/aigp.min.js"></script>
```

### Quick Start
```javascript
import { AIGPDocument, validate, render } from '@aigraphia/browser';

// Create diagram
const diagram = new AIGPDocument({
  type: 'flowchart',
  metadata: {
    title: 'User Authentication'
  },
  graph: {
    nodes: [
      { id: 'start', type: 'start', label: 'Login' },
      { id: 'validate', type: 'process', label: 'Validate' },
      { id: 'end', type: 'end', label: 'Complete' }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'validate' },
      { id: 'e2', source: 'validate', target: 'end' }
    ]
  }
});

// Validate
const result = validate(diagram);
console.log(result.valid); // true

// Render to DOM
const container = document.getElementById('diagram');
render(diagram, container, {
  width: 800,
  height: 600,
  theme: 'light'
});
```

### Full API
```typescript
class AIGPDocument {
  constructor(data: AIGPData);
  toJSON(): string;
  save(filename: string): void;
  static load(file: File): Promise<AIGPDocument>;
}

interface RenderOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  interactive?: boolean;
  zoom?: boolean;
  pan?: boolean;
}

function render(
  diagram: AIGPDocument,
  container: HTMLElement,
  options?: RenderOptions
): void;

function validate(diagram: AIGPDocument): ValidationResult;
function toMermaid(diagram: AIGPDocument): string;
function toSVG(diagram: AIGPDocument, options?: ExportOptions): string;
```

---

## React Components Library

### Installation
```bash
pnpm add @aigraphia/react
```

### Quick Start
```jsx
import { DiagramViewer, DiagramEditor } from '@aigraphia/react';

function App() {
  const [diagram, setDiagram] = useState(null);

  return (
    <div>
      {/* View-only diagram */}
      <DiagramViewer
        diagram={diagram}
        width={800}
        height={600}
        theme="light"
        interactive
      />

      {/* Editable diagram */}
      <DiagramEditor
        diagram={diagram}
        onChange={setDiagram}
        width={800}
        height={600}
      />
    </div>
  );
}
```

### Components

#### DiagramViewer
```jsx
<DiagramViewer
  diagram={aigpDocument}
  width={800}
  height={600}
  theme="light"
  interactive={true}
  zoom={true}
  pan={true}
  onNodeClick={(node) => console.log(node)}
  onEdgeClick={(edge) => console.log(edge)}
/>
```

#### DiagramEditor
```jsx
<DiagramEditor
  diagram={aigpDocument}
  onChange={(newDiagram) => setDiagram(newDiagram)}
  width={800}
  height={600}
  tools={['select', 'pan', 'node', 'edge']}
  onSave={(diagram) => saveDiagram(diagram)}
/>
```

#### DiagramList
```jsx
<DiagramList
  diagrams={diagrams}
  onSelect={(diagram) => setSelected(diagram)}
  onDelete={(id) => deleteDiagram(id)}
  renderItem={(diagram) => <DiagramCard diagram={diagram} />}
/>
```

---

## Vue Components Library

### Installation
```bash
pnpm add @aigraphia/vue
```

### Quick Start
```vue
<template>
  <div>
    <DiagramViewer
      :diagram="diagram"
      :width="800"
      :height="600"
      theme="light"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DiagramViewer } from '@aigraphia/vue';

const diagram = ref(null);

function handleNodeClick(node) {
  console.log('Node clicked:', node);
}
</script>
```

### Components

#### DiagramViewer
```vue
<DiagramViewer
  :diagram="diagram"
  :width="800"
  :height="600"
  theme="light"
  :interactive="true"
  @node-click="onNodeClick"
  @edge-click="onEdgeClick"
/>
```

#### DiagramEditor
```vue
<DiagramEditor
  v-model="diagram"
  :width="800"
  :height="600"
  :tools="['select', 'pan', 'node', 'edge']"
  @save="handleSave"
/>
```

---

## API Client Libraries

### REST API Client
```typescript
import { AIGPClient } from '@aigraphia/api-client';

const client = new AIGPClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.aigp.dev'
});

// Create diagram
const diagram = await client.diagrams.create({
  description: 'Create a flowchart for user login'
});

// Get diagram
const existing = await client.diagrams.get('diagram-id');

// Update diagram
await client.diagrams.update('diagram-id', updatedDiagram);

// Delete diagram
await client.diagrams.delete('diagram-id');

// List diagrams
const list = await client.diagrams.list({ limit: 10, offset: 0 });

// Convert formats
const mermaid = await client.convert.toMermaid(diagram);
const svg = await client.render.toSVG(diagram, { width: 1200 });
```

---

## CLI Improvements

### Enhanced Commands

```bash
# Interactive diagram creation
aigp create --interactive

# Batch operations
aigp validate *.json --parallel

# Watch mode
aigp watch src/ --convert mermaid --output dist/

# Server mode
aigp serve --port 3000 --cors

# Export with templates
aigp export diagram.json --format png --template professional

# Diagram statistics
aigp stats diagram.json

# Search diagrams
aigp search --type flowchart --tags "auth,security"

# Refactor/rename nodes
aigp refactor diagram.json --rename "OldName:NewName"

# Generate documentation
aigp docs generate --input diagrams/ --output docs/

# Benchmark performance
aigp benchmark large-diagram.json
```

---

## Schema Builder Tool

### Web-based Schema Builder

```html
<!-- Usage -->
<script src="https://cdn.jsdelivr.net/npm/@aigraphia/schema-builder"></script>

<div id="schema-builder"></div>

<script>
  const builder = new AIGPSchemaBuilder('#schema-builder');

  builder.on('change', (schema) => {
    console.log('Schema updated:', schema);
  });

  builder.on('export', (diagram) => {
    download(diagram, 'diagram.json');
  });
</script>
```

### Features
- Visual node/edge creation
- Drag-and-drop interface
- Real-time validation
- Property panels
- Template library
- Export to multiple formats
- Undo/redo
- Collaboration (future)

---

## Testing Utilities

```typescript
import { createTestDiagram, mockNode, mockEdge } from '@aigraphia/testing';

describe('Diagram Tests', () => {
  it('should create valid diagram', () => {
    const diagram = createTestDiagram('flowchart', {
      nodeCount: 5,
      edgeCount: 7
    });

    expect(validate(diagram).valid).toBe(true);
  });

  it('should handle large diagrams', () => {
    const large = createTestDiagram('network', {
      nodeCount: 1000,
      edgeCount: 5000
    });

    const metrics = analyzePerformance(large);
    expect(metrics.complexity).toBeLessThan(80);
  });
});
```

---

## Performance Benchmarks

All SDKs achieve:
- Parse JSON: <10ms (1000 nodes)
- Validate: <50ms (1000 nodes)
- Layout: <2s (500 nodes, hierarchical)
- Render: <500ms (200 nodes)
- Export SVG: <300ms (200 nodes)

---

## Package Sizes

| Package | Size (minified) | Gzipped |
|---------|----------------|---------|
| @aigraphia/browser | 45 KB | 12 KB |
| @aigraphia/react | 52 KB | 14 KB |
| @aigraphia/vue | 48 KB | 13 KB |
| @aigraphia/api-client | 15 KB | 5 KB |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

All SDKs: MIT License

---

## Resources

- NPM: https://www.npmjs.com/org/aigp
- GitHub: https://github.com/aigp
- Documentation: https://aigp.dev/docs
- Examples: https://aigp.dev/examples
