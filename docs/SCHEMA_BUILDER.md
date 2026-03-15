# AIGP Schema Builder Tool

## Overview

Web-based visual tool for creating AIGP diagrams through drag-and-drop interface with real-time validation and preview.

---

## Features

- ✅ Visual node/edge creation
- ✅ Drag-and-drop interface
- ✅ Real-time validation
- ✅ Property panels
- ✅ Template library
- ✅ Export to multiple formats
- ✅ Undo/redo
- ✅ Collaboration (future)
- ✅ Code editor with syntax highlighting
- ✅ Live preview
- ✅ Keyboard shortcuts

---

## Architecture

```
┌─────────────────────────────────────┐
│     Schema Builder Web App          │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────┐  │
│  │ Toolbar  │  │  Property      │  │
│  │          │  │  Panel         │  │
│  └──────────┘  └────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │     Canvas (SVG/Canvas)      │  │
│  │     - Drag nodes             │  │
│  │     - Connect edges          │  │
│  │     - Select/move/delete     │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│  ┌────────────┐  ┌──────────────┐  │
│  │ Code       │  │ Live         │  │
│  │ Editor     │  │ Preview      │  │
│  └────────────┘  └──────────────┘  │
└─────────────────────────────────────┘
```

---

## Implementation

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Canvas**: React Flow or D3.js
- **Code Editor**: Monaco Editor (VS Code engine)
- **Validation**: Zod schemas from @aigraphia/protocol
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite
- **Deployment**: Vercel or Cloudflare Pages

---

### Core Components

#### 1. Canvas Component

```typescript
interface CanvasProps {
  diagram: AIGPDocument;
  onUpdate: (diagram: AIGPDocument) => void;
  readOnly?: boolean;
}

export function Canvas({ diagram, onUpdate, readOnly }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(diagram.graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(diagram.graph.edges);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      id: `e${edges.length + 1}`,
      source: params.source,
      target: params.target,
      type: 'flow',
      data: {}
    };
    setEdges((eds) => addEdge(newEdge, eds));
    onUpdate({
      ...diagram,
      graph: {
        ...diagram.graph,
        edges: [...diagram.graph.edges, newEdge]
      }
    });
  }, [edges, diagram, onUpdate]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    const updatedNodes = nodes.map(n =>
      n.id === node.id ? { ...n, position: node.position } : n
    );
    onUpdate({
      ...diagram,
      graph: {
        ...diagram.graph,
        nodes: updatedNodes
      }
    });
  }, [nodes, diagram, onUpdate]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
```

#### 2. Toolbar Component

```typescript
interface ToolbarProps {
  onAddNode: (type: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: ExportFormat) => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  onAddNode,
  onUndo,
  onRedo,
  onExport,
  onSave,
  canUndo,
  canRedo
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={() => onAddNode('start')}>
        <PlayIcon /> Start
      </button>
      <button onClick={() => onAddNode('process')}>
        <BoxIcon /> Process
      </button>
      <button onClick={() => onAddNode('decision')}>
        <DiamondIcon /> Decision
      </button>
      <button onClick={() => onAddNode('end')}>
        <StopIcon /> End
      </button>

      <Separator />

      <button onClick={onUndo} disabled={!canUndo}>
        <UndoIcon /> Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo}>
        <RedoIcon /> Redo
      </button>

      <Separator />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <DownloadIcon /> Export
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onExport('agf')}>
            AIGP (.json)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('mermaid')}>
            Mermaid
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('svg')}>
            SVG Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('png')}>
            PNG Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button onClick={onSave} className="btn-primary">
        <SaveIcon /> Save
      </button>
    </div>
  );
}
```

#### 3. Property Panel

```typescript
interface PropertyPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (id: string, updates: Partial<Node>) => void;
  onUpdateEdge: (id: string, updates: Partial<Edge>) => void;
  onDelete: () => void;
}

export function PropertyPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDelete
}: PropertyPanelProps) {
  if (selectedNode) {
    return (
      <div className="property-panel">
        <h3>Node Properties</h3>

        <Label>ID</Label>
        <Input value={selectedNode.id} disabled />

        <Label>Type</Label>
        <Select
          value={selectedNode.type}
          onValueChange={(type) => onUpdateNode(selectedNode.id, { type })}
        >
          <SelectOption value="start">Start</SelectOption>
          <SelectOption value="process">Process</SelectOption>
          <SelectOption value="decision">Decision</SelectOption>
          <SelectOption value="end">End</SelectOption>
        </Select>

        <Label>Label</Label>
        <Input
          value={selectedNode.label}
          onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
        />

        <Label>Description</Label>
        <Textarea
          value={selectedNode.data?.description || ''}
          onChange={(e) =>
            onUpdateNode(selectedNode.id, {
              data: { ...selectedNode.data, description: e.target.value }
            })
          }
        />

        <button onClick={onDelete} className="btn-danger">
          Delete Node
        </button>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="property-panel">
        <h3>Edge Properties</h3>

        <Label>ID</Label>
        <Input value={selectedEdge.id} disabled />

        <Label>Source</Label>
        <Input value={selectedEdge.source} disabled />

        <Label>Target</Label>
        <Input value={selectedEdge.target} disabled />

        <Label>Label</Label>
        <Input
          value={selectedEdge.label || ''}
          onChange={(e) => onUpdateEdge(selectedEdge.id, { label: e.target.value })}
        />

        <Label>Type</Label>
        <Select
          value={selectedEdge.type}
          onValueChange={(type) => onUpdateEdge(selectedEdge.id, { type })}
        >
          <SelectOption value="flow">Flow</SelectOption>
          <SelectOption value="conditional">Conditional</SelectOption>
          <SelectOption value="data-flow">Data Flow</SelectOption>
        </Select>

        <button onClick={onDelete} className="btn-danger">
          Delete Edge
        </button>
      </div>
    );
  }

  return (
    <div className="property-panel empty">
      <p>Select a node or edge to edit properties</p>
    </div>
  );
}
```

#### 4. Code Editor

```typescript
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  diagram: AIGPDocument;
  onChange: (diagram: AIGPDocument) => void;
}

export function CodeEditor({ diagram, onChange }: CodeEditorProps) {
  const [code, setCode] = useState(JSON.stringify(diagram, null, 2));
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (value: string | undefined) => {
    if (!value) return;

    setCode(value);

    try {
      const parsed = JSON.parse(value);
      const validation = validate(parsed);

      if (validation.valid) {
        onChange(parsed);
        setErrors([]);
      } else {
        setErrors(validation.errors.map(e => e.message));
      }
    } catch (err) {
      setErrors(['Invalid JSON']);
    }
  };

  return (
    <div className="code-editor">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          formatOnPaste: true,
          formatOnType: true
        }}
      />

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <div key={i} className="error">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 5. Template Library

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  diagram: AIGPDocument;
  thumbnail: string;
  category: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'simple-flow',
    name: 'Simple Flow',
    description: 'Basic sequential flow with start and end',
    category: 'Flowchart',
    thumbnail: '/templates/simple-flow.svg',
    diagram: {
      // ... template diagram
    }
  },
  {
    id: 'decision-flow',
    name: 'Decision Flow',
    description: 'Flow with decision branches',
    category: 'Flowchart',
    thumbnail: '/templates/decision-flow.svg',
    diagram: {
      // ... template diagram
    }
  },
  // ... more templates
];

export function TemplateLibrary({ onSelect }: { onSelect: (template: Template) => void }) {
  const [category, setCategory] = useState<string>('all');

  const filteredTemplates = category === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === category);

  return (
    <div className="template-library">
      <h2>Template Library</h2>

      <div className="categories">
        <button
          className={category === 'all' ? 'active' : ''}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        <button
          className={category === 'Flowchart' ? 'active' : ''}
          onClick={() => setCategory('Flowchart')}
        >
          Flowchart
        </button>
        <button
          className={category === 'Sequence' ? 'active' : ''}
          onClick={() => setCategory('Sequence')}
        >
          Sequence
        </button>
        <button
          className={category === 'Class' ? 'active' : ''}
          onClick={() => setCategory('Class')}
        >
          Class
        </button>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => onSelect(template)}
          >
            <img src={template.thumbnail} alt={template.name} />
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Main Application

```typescript
export function SchemaBuilder() {
  const [diagram, setDiagram] = useState<AIGPDocument>(createEmptyDiagram());
  const [history, setHistory] = useState<AIGPDocument[]>([diagram]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [view, setView] = useState<'canvas' | 'code' | 'split'>('canvas');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setDiagram(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setDiagram(history[historyIndex + 1]);
    }
  };

  const updateDiagram = (updated: AIGPDocument) => {
    setDiagram(updated);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Node operations
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type,
      label: `New ${type}`,
      data: {},
      position: { x: 250, y: 250 }
    };

    updateDiagram({
      ...diagram,
      graph: {
        ...diagram.graph,
        nodes: [...diagram.graph.nodes, newNode]
      }
    });
  };

  const updateNode = (id: string, updates: Partial<Node>) => {
    const updatedNodes = diagram.graph.nodes.map(n =>
      n.id === id ? { ...n, ...updates } : n
    );
    updateDiagram({
      ...diagram,
      graph: {
        ...diagram.graph,
        nodes: updatedNodes
      }
    });
  };

  const deleteNode = (id: string) => {
    updateDiagram({
      ...diagram,
      graph: {
        nodes: diagram.graph.nodes.filter(n => n.id !== id),
        edges: diagram.graph.edges.filter(
          e => e.source !== id && e.target !== id
        )
      }
    });
  };

  // Edge operations
  const updateEdge = (id: string, updates: Partial<Edge>) => {
    const updatedEdges = diagram.graph.edges.map(e =>
      e.id === id ? { ...e, ...updates } : e
    );
    updateDiagram({
      ...diagram,
      graph: {
        ...diagram.graph,
        edges: updatedEdges
      }
    });
  };

  const deleteEdge = (id: string) => {
    updateDiagram({
      ...diagram,
      graph: {
        ...diagram.graph,
        edges: diagram.graph.edges.filter(e => e.id !== id)
      }
    });
  };

  // Export
  const handleExport = async (format: ExportFormat) => {
    switch (format) {
      case 'agf':
        downloadJSON(diagram, 'diagram.json');
        break;
      case 'mermaid':
        const mermaid = toMermaid(diagram);
        downloadText(mermaid, 'diagram.md');
        break;
      case 'svg':
        const svg = toSVG(diagram);
        downloadText(svg, 'diagram.svg');
        break;
      case 'png':
        const blob = await toPNG(diagram);
        downloadBlob(blob, 'diagram.png');
        break;
    }
  };

  // Save (to localStorage or API)
  const handleSave = () => {
    localStorage.setItem('aigp-diagram', JSON.stringify(diagram));
    alert('Diagram saved!');
  };

  // Load template
  const handleSelectTemplate = (template: Template) => {
    updateDiagram(template.diagram);
    setShowTemplates(false);
  };

  return (
    <div className="schema-builder">
      <header>
        <h1>AIGP Schema Builder</h1>
        <div className="view-toggle">
          <button
            className={view === 'canvas' ? 'active' : ''}
            onClick={() => setView('canvas')}
          >
            Canvas
          </button>
          <button
            className={view === 'code' ? 'active' : ''}
            onClick={() => setView('code')}
          >
            Code
          </button>
          <button
            className={view === 'split' ? 'active' : ''}
            onClick={() => setView('split')}
          >
            Split
          </button>
        </div>
      </header>

      <Toolbar
        onAddNode={addNode}
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
        onSave={handleSave}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="main-content">
        <aside className="left-sidebar">
          <button onClick={() => setShowTemplates(true)}>
            Templates
          </button>
          {/* Node palette */}
        </aside>

        <div className="canvas-area">
          {(view === 'canvas' || view === 'split') && (
            <Canvas
              diagram={diagram}
              onUpdate={updateDiagram}
              onSelectNode={setSelectedNode}
              onSelectEdge={setSelectedEdge}
            />
          )}

          {(view === 'code' || view === 'split') && (
            <CodeEditor diagram={diagram} onChange={updateDiagram} />
          )}
        </div>

        <aside className="right-sidebar">
          <PropertyPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={updateNode}
            onUpdateEdge={updateEdge}
            onDelete={() => {
              if (selectedNode) deleteNode(selectedNode.id);
              if (selectedEdge) deleteEdge(selectedEdge.id);
            }}
          />

          <ValidationPanel diagram={diagram} />
        </aside>
      </div>

      {showTemplates && (
        <Modal onClose={() => setShowTemplates(false)}>
          <TemplateLibrary onSelect={handleSelectTemplate} />
        </Modal>
      )}
    </div>
  );
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + S` | Save |
| `Ctrl/Cmd + C` | Copy selected |
| `Ctrl/Cmd + V` | Paste |
| `Delete/Backspace` | Delete selected |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + D` | Duplicate selected |
| `Space` | Pan mode |
| `N` | Add node |
| `E` | Add edge |

---

## Deployment

### Build for Production

```bash
pnpm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

### Self-hosted

```bash
pnpm run build
# Serve dist/ folder with any static server
pnpm dlx serve dist/
```

---

## URL Structure

```
https://builder.aigp.dev/

Routes:
  /               - Landing page
  /new            - New diagram
  /edit/:id       - Edit existing diagram
  /templates      - Template library
  /docs           - Documentation
  /examples       - Example diagrams
```

---

## Features Roadmap

### Phase 1 (MVP)
- ✅ Visual canvas with drag-and-drop
- ✅ Node/edge creation and editing
- ✅ Property panel
- ✅ Code editor
- ✅ Export to AIGP/Mermaid/SVG
- ✅ Template library

### Phase 2
- [ ] User accounts and cloud storage
- [ ] Sharing and collaboration
- [ ] Version history
- [ ] Comments and annotations
- [ ] Real-time collaboration (multiplayer)

### Phase 3
- [ ] AI-assisted diagram generation
- [ ] Advanced styling and themes
- [ ] Custom plugins
- [ ] Diagram animations
- [ ] Mobile app

---

## Resources

- Live Demo: https://builder.aigp.dev
- GitHub: https://github.com/aigp/schema-builder
- Documentation: https://aigp.dev/docs/builder
- Video Tutorial: https://aigp.dev/tutorials/builder
