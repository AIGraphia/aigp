# AIGP React Components Library

## Overview

Production-ready React components for rendering and editing AIGP diagrams.

---

## Installation

```bash
pnpm add @aigraphia/react react react-dom
# or
yarn add @aigraphia/react react react-dom
# or
pnpm add @aigraphia/react react react-dom
```

---

## Components

### DiagramViewer

View-only diagram renderer with zoom/pan support.

```typescript
interface DiagramViewerProps {
  diagram: AIGPDocument;
  width?: number | string;
  height?: number | string;
  theme?: 'light' | 'dark';
  interactive?: boolean;
  zoom?: boolean;
  pan?: boolean;
  fit?: boolean;
  className?: string;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
  onBackgroundClick?: () => void;
}

export function DiagramViewer(props: DiagramViewerProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramViewer } from '@aigraphia/react';
import { AIGPDocument } from '@aigraphia/protocol';

function App() {
  const diagram: AIGPDocument = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: { title: 'User Login' },
    graph: {
      nodes: [
        { id: 'start', type: 'start', label: 'Start' },
        { id: 'login', type: 'process', label: 'Enter Credentials' },
        { id: 'validate', type: 'decision', label: 'Valid?' },
        { id: 'success', type: 'end', label: 'Success' },
        { id: 'error', type: 'end', label: 'Error' }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'login' },
        { id: 'e2', source: 'login', target: 'validate' },
        { id: 'e3', source: 'validate', target: 'success', label: 'Yes' },
        { id: 'e4', source: 'validate', target: 'error', label: 'No' }
      ]
    }
  };

  return (
    <DiagramViewer
      diagram={diagram}
      width={800}
      height={600}
      theme="light"
      interactive
      onNodeClick={(node) => console.log('Clicked:', node.label)}
    />
  );
}
```

---

### DiagramEditor

Full-featured diagram editor.

```typescript
interface DiagramEditorProps {
  diagram: AIGPDocument;
  onChange?: (diagram: AIGPDocument) => void;
  onSave?: (diagram: AIGPDocument) => void;
  width?: number | string;
  height?: number | string;
  theme?: 'light' | 'dark';
  tools?: EditorTool[];
  readOnly?: boolean;
  className?: string;
}

type EditorTool = 'select' | 'pan' | 'node' | 'edge' | 'delete' | 'undo' | 'redo';

export function DiagramEditor(props: DiagramEditorProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramEditor } from '@aigraphia/react';
import { useState } from 'react';

function DiagramEditPage() {
  const [diagram, setDiagram] = useState<AIGPDocument>({
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: { title: 'New Diagram' },
    graph: { nodes: [], edges: [] }
  });

  const handleSave = (updatedDiagram: AIGPDocument) => {
    // Save to backend
    fetch('/api/diagrams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDiagram)
    });
  };

  return (
    <div>
      <h1>Diagram Editor</h1>
      <DiagramEditor
        diagram={diagram}
        onChange={setDiagram}
        onSave={handleSave}
        width="100%"
        height={600}
        theme="light"
        tools={['select', 'pan', 'node', 'edge', 'delete', 'undo', 'redo']}
      />
    </div>
  );
}
```

---

### DiagramList

Display and manage multiple diagrams.

```typescript
interface DiagramListProps {
  diagrams: DiagramMetadata[];
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  renderItem?: (diagram: DiagramMetadata) => React.ReactNode;
  className?: string;
}

interface DiagramMetadata {
  id: string;
  title: string;
  type: string;
  thumbnail?: string;
  createdAt: string;
  modifiedAt: string;
  nodeCount?: number;
  edgeCount?: number;
}

export function DiagramList(props: DiagramListProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramList } from '@aigraphia/react';
import { useNavigate } from 'react-router-dom';

function DiagramsPage() {
  const navigate = useNavigate();
  const [diagrams, setDiagrams] = useState<DiagramMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/diagrams')
      .then(res => res.json())
      .then(data => {
        setDiagrams(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this diagram?')) {
      await fetch(`/api/diagrams/${id}`, { method: 'DELETE' });
      setDiagrams(diagrams.filter(d => d.id !== id));
    }
  };

  return (
    <div>
      <h1>My Diagrams</h1>
      <DiagramList
        diagrams={diagrams}
        loading={loading}
        onSelect={(id) => navigate(`/diagrams/${id}`)}
        onDelete={handleDelete}
        emptyMessage="No diagrams yet. Create your first diagram!"
      />
    </div>
  );
}
```

---

### DiagramCard

Individual diagram card for lists/grids.

```typescript
interface DiagramCardProps {
  diagram: DiagramMetadata;
  onClick?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showActions?: boolean;
  className?: string;
}

export function DiagramCard(props: DiagramCardProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramCard } from '@aigraphia/react';

function CustomDiagramList() {
  const diagrams = [...]; // Your diagrams

  return (
    <div className="diagram-grid">
      {diagrams.map(diagram => (
        <DiagramCard
          key={diagram.id}
          diagram={diagram}
          onClick={() => openDiagram(diagram.id)}
          onDelete={() => deleteDiagram(diagram.id)}
          showActions
        />
      ))}
    </div>
  );
}
```

---

### DiagramUpload

Drag-and-drop file upload component.

```typescript
interface DiagramUploadProps {
  onUpload: (diagram: AIGPDocument) => void;
  onError?: (error: Error) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function DiagramUpload(props: DiagramUploadProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramUpload } from '@aigraphia/react';

function UploadPage() {
  const handleUpload = (diagram: AIGPDocument) => {
    console.log('Uploaded:', diagram.metadata.title);
    // Process diagram
  };

  const handleError = (error: Error) => {
    alert('Upload failed: ' + error.message);
  };

  return (
    <DiagramUpload
      onUpload={handleUpload}
      onError={handleError}
      accept=".json,.json"
      multiple
    />
  );
}
```

---

### DiagramExport

Export dialog with format options.

```typescript
interface DiagramExportProps {
  diagram: AIGPDocument;
  onClose?: () => void;
  defaultFormat?: ExportFormat;
}

type ExportFormat = 'agf' | 'mermaid' | 'plantuml' | 'svg' | 'png' | 'pdf';

export function DiagramExport(props: DiagramExportProps): JSX.Element;
```

**Usage:**

```tsx
import { DiagramExport } from '@aigraphia/react';
import { useState } from 'react';

function EditorPage() {
  const [showExport, setShowExport] = useState(false);
  const diagram = ...; // Your diagram

  return (
    <div>
      <button onClick={() => setShowExport(true)}>Export</button>

      {showExport && (
        <DiagramExport
          diagram={diagram}
          onClose={() => setShowExport(false)}
          defaultFormat="png"
        />
      )}
    </div>
  );
}
```

---

### Hooks

#### useDiagram

```typescript
interface UseDiagramOptions {
  initialDiagram?: AIGPDocument;
  onChange?: (diagram: AIGPDocument) => void;
}

interface UseDiagramReturn {
  diagram: AIGPDocument;
  setDiagram: (diagram: AIGPDocument) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  validate: () => ValidationResult;
}

export function useDiagram(options?: UseDiagramOptions): UseDiagramReturn;
```

**Usage:**

```tsx
import { useDiagram } from '@aigraphia/react';

function CustomEditor() {
  const {
    diagram,
    addNode,
    removeNode,
    addEdge,
    undo,
    redo,
    canUndo,
    canRedo
  } = useDiagram({
    initialDiagram: myDiagram,
    onChange: (updated) => console.log('Changed:', updated)
  });

  const handleAddNode = () => {
    addNode({
      id: `node_${Date.now()}`,
      type: 'process',
      label: 'New Node',
      data: {}
    });
  };

  return (
    <div>
      <button onClick={handleAddNode}>Add Node</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>

      <DiagramViewer diagram={diagram} />
    </div>
  );
}
```

#### useDiagramValidation

```typescript
interface UseDiagramValidationReturn {
  validate: () => ValidationResult;
  errors: ValidationError[];
  warnings: string[];
  isValid: boolean;
}

export function useDiagramValidation(
  diagram: AIGPDocument
): UseDiagramValidationReturn;
```

**Usage:**

```tsx
import { useDiagramValidation } from '@aigraphia/react';

function ValidationPanel({ diagram }: { diagram: AIGPDocument }) {
  const { isValid, errors, warnings } = useDiagramValidation(diagram);

  return (
    <div>
      <h3>Validation</h3>
      {isValid ? (
        <p style={{ color: 'green' }}>✓ Valid diagram</p>
      ) : (
        <div>
          <p style={{ color: 'red' }}>✗ {errors.length} errors</p>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div>
          <p style={{ color: 'orange' }}>⚠ {warnings.length} warnings</p>
          <ul>
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

#### useDiagramExport

```typescript
interface UseDiagramExportReturn {
  exportToFormat: (format: ExportFormat, options?: ExportOptions) => Promise<void>;
  exportSVG: (options?: SVGOptions) => string;
  exportPNG: (options?: PNGOptions) => Promise<Blob>;
  exportPDF: (options?: PDFOptions) => Promise<Blob>;
  downloadAs: (filename: string, format: ExportFormat) => Promise<void>;
}

export function useDiagramExport(
  diagram: AIGPDocument
): UseDiagramExportReturn;
```

**Usage:**

```tsx
import { useDiagramExport } from '@aigraphia/react';

function ExportButtons({ diagram }: { diagram: AIGPDocument }) {
  const { downloadAs, exportPNG } = useDiagramExport(diagram);

  return (
    <div>
      <button onClick={() => downloadAs('diagram.json', 'agf')}>
        Download .json
      </button>
      <button onClick={() => downloadAs('diagram.svg', 'svg')}>
        Download SVG
      </button>
      <button onClick={async () => {
        const blob = await exportPNG({ scale: 2 });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.png';
        a.click();
      }}>
        Download PNG
      </button>
    </div>
  );
}
```

---

## Complete Example: Full Application

```tsx
import React, { useState, useEffect } from 'react';
import {
  DiagramEditor,
  DiagramList,
  DiagramUpload,
  DiagramExport,
  useDiagram,
  useDiagramValidation
} from '@aigraphia/react';
import { AIGPDocument } from '@aigraphia/protocol';

function App() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [diagrams, setDiagrams] = useState<DiagramMetadata[]>([]);
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const {
    diagram,
    setDiagram,
    addNode,
    removeNode,
    addEdge,
    undo,
    redo,
    canUndo,
    canRedo
  } = useDiagram();

  const { isValid, errors } = useDiagramValidation(diagram);

  // Load diagrams from API
  useEffect(() => {
    fetch('/api/diagrams')
      .then(res => res.json())
      .then(setDiagrams);
  }, []);

  // Load specific diagram
  const loadDiagram = async (id: string) => {
    const res = await fetch(`/api/diagrams/${id}`);
    const data = await res.json();
    setDiagram(data);
    setCurrentDiagramId(id);
    setView('editor');
  };

  // Save diagram
  const saveDiagram = async () => {
    const method = currentDiagramId ? 'PUT' : 'POST';
    const url = currentDiagramId
      ? `/api/diagrams/${currentDiagramId}`
      : '/api/diagrams';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagram)
    });

    const saved = await res.json();
    setCurrentDiagramId(saved.id);

    // Refresh list
    const listRes = await fetch('/api/diagrams');
    const list = await listRes.json();
    setDiagrams(list);

    alert('Diagram saved!');
  };

  // Delete diagram
  const deleteDiagram = async (id: string) => {
    if (!confirm('Delete this diagram?')) return;

    await fetch(`/api/diagrams/${id}`, { method: 'DELETE' });
    setDiagrams(diagrams.filter(d => d.id !== id));

    if (currentDiagramId === id) {
      setView('list');
      setCurrentDiagramId(null);
    }
  };

  // Create new diagram
  const createNew = () => {
    setDiagram({
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: 'flowchart',
      metadata: { title: 'New Diagram' },
      graph: { nodes: [], edges: [] }
    });
    setCurrentDiagramId(null);
    setView('editor');
  };

  return (
    <div className="app">
      <header>
        <h1>AIGP Diagram Tool</h1>
        <nav>
          <button onClick={() => setView('list')}>My Diagrams</button>
          <button onClick={createNew}>New Diagram</button>
        </nav>
      </header>

      <main>
        {view === 'list' ? (
          <div>
            <DiagramUpload
              onUpload={(uploaded) => {
                setDiagram(uploaded);
                setView('editor');
              }}
              onError={(error) => alert(error.message)}
            />

            <DiagramList
              diagrams={diagrams}
              onSelect={loadDiagram}
              onDelete={deleteDiagram}
            />
          </div>
        ) : (
          <div className="editor-view">
            <div className="toolbar">
              <button onClick={undo} disabled={!canUndo}>Undo</button>
              <button onClick={redo} disabled={!canRedo}>Redo</button>
              <button onClick={saveDiagram} disabled={!isValid}>
                Save
              </button>
              <button onClick={() => setShowExport(true)}>Export</button>
              <span className={isValid ? 'valid' : 'invalid'}>
                {isValid ? '✓ Valid' : `✗ ${errors.length} errors`}
              </span>
            </div>

            <DiagramEditor
              diagram={diagram}
              onChange={setDiagram}
              onSave={saveDiagram}
              width="100%"
              height="calc(100vh - 150px)"
            />

            {showExport && (
              <DiagramExport
                diagram={diagram}
                onClose={() => setShowExport(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## Styling

### CSS Classes

All components use BEM naming convention:

```css
.aigp-diagram-viewer { }
.aigp-diagram-viewer__canvas { }
.aigp-diagram-viewer__controls { }

.aigp-diagram-editor { }
.aigp-diagram-editor__toolbar { }
.aigp-diagram-editor__canvas { }
.aigp-diagram-editor__sidebar { }

.aigp-diagram-list { }
.aigp-diagram-list__item { }
.aigp-diagram-list__empty { }

.aigp-diagram-card { }
.aigp-diagram-card__thumbnail { }
.aigp-diagram-card__title { }
.aigp-diagram-card__meta { }
.aigp-diagram-card__actions { }
```

### Custom Styling

```tsx
import '@aigraphia/react/dist/styles.css'; // Default styles

// Or use your own styles
import './custom-aigp-styles.css';
```

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { DiagramViewer, DiagramEditor, useDiagram } from '@aigraphia/react';
import type { DiagramViewerProps, DiagramEditorProps } from '@aigraphia/react';
```

---

## Performance

- Components use React.memo for performance
- Virtual scrolling for large diagram lists
- Lazy loading for thumbnails
- Debounced onChange handlers
- Efficient diff algorithms for updates

---

## Peer Dependencies

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## Bundle Size

- `@aigraphia/react`: 52KB (14KB gzipped)
- Tree-shakeable - import only what you need

---

## Resources

- NPM: https://www.npmjs.com/package/@aigraphia/react
- GitHub: https://github.com/AIGraphia/aigp/tree/main/packages/react
- Storybook: https://aigp.dev/storybook/react
- Documentation: https://aigp.dev/docs/react
