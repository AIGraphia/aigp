# AIGP Vue Components Library

## Overview

Production-ready Vue 3 components for rendering and editing AIGP diagrams.

---

## Installation

```bash
pnpm install @aigraphia/vue vue
# or
yarn add @aigraphia/vue vue
# or
pnpm add @aigraphia/vue vue
```

---

## Components

### DiagramViewer

View-only diagram renderer with zoom/pan support.

```vue
<template>
  <DiagramViewer
    :diagram="diagram"
    :width="800"
    :height="600"
    theme="light"
    :interactive="true"
    @node-click="handleNodeClick"
    @edge-click="handleEdgeClick"
  />
</template>

<script setup lang="ts">
import { DiagramViewer } from '@aigraphia/vue';
import { ref } from 'vue';
import type { AIGPDocument, Node, Edge } from '@aigraphia/protocol';

const diagram = ref<AIGPDocument>({
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
});

const handleNodeClick = (node: Node) => {
  console.log('Clicked:', node.label);
};

const handleEdgeClick = (edge: Edge) => {
  console.log('Clicked edge:', edge.id);
};
</script>
```

**Props:**

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
}
```

**Events:**

```typescript
{
  'node-click': (node: Node) => void;
  'edge-click': (edge: Edge) => void;
  'background-click': () => void;
}
```

---

### DiagramEditor

Full-featured diagram editor.

```vue
<template>
  <DiagramEditor
    v-model="diagram"
    :width="'100%'"
    :height="600"
    theme="light"
    :tools="['select', 'pan', 'node', 'edge', 'delete', 'undo', 'redo']"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { DiagramEditor } from '@aigraphia/vue';
import { ref } from 'vue';
import type { AIGPDocument } from '@aigraphia/protocol';

const diagram = ref<AIGPDocument>({
  schema: 'https://aigraphia.com/schema/v1',
  version: '1.0.0',
  type: 'flowchart',
  metadata: { title: 'New Diagram' },
  graph: { nodes: [], edges: [] }
});

const handleSave = (savedDiagram: AIGPDocument) => {
  fetch('/api/diagrams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(savedDiagram)
  });
};
</script>
```

**Props:**

```typescript
interface DiagramEditorProps {
  modelValue: AIGPDocument;
  width?: number | string;
  height?: number | string;
  theme?: 'light' | 'dark';
  tools?: EditorTool[];
  readOnly?: boolean;
}

type EditorTool = 'select' | 'pan' | 'node' | 'edge' | 'delete' | 'undo' | 'redo';
```

**Events:**

```typescript
{
  'update:modelValue': (diagram: AIGPDocument) => void;
  'save': (diagram: AIGPDocument) => void;
  'node-add': (node: Node) => void;
  'node-delete': (nodeId: string) => void;
  'edge-add': (edge: Edge) => void;
  'edge-delete': (edgeId: string) => void;
}
```

---

### DiagramList

Display and manage multiple diagrams.

```vue
<template>
  <DiagramList
    :diagrams="diagrams"
    :loading="loading"
    @select="handleSelect"
    @delete="handleDelete"
    @duplicate="handleDuplicate"
  >
    <template #empty>
      <p>No diagrams yet. Create your first diagram!</p>
    </template>
  </DiagramList>
</template>

<script setup lang="ts">
import { DiagramList } from '@aigraphia/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { DiagramMetadata } from '@aigraphia/vue';

const router = useRouter();
const diagrams = ref<DiagramMetadata[]>([]);
const loading = ref(true);

onMounted(async () => {
  const res = await fetch('/api/diagrams');
  diagrams.value = await res.json();
  loading.value = false;
});

const handleSelect = (id: string) => {
  router.push(`/diagrams/${id}`);
};

const handleDelete = async (id: string) => {
  if (confirm('Delete this diagram?')) {
    await fetch(`/api/diagrams/${id}`, { method: 'DELETE' });
    diagrams.value = diagrams.value.filter(d => d.id !== id);
  }
};

const handleDuplicate = async (id: string) => {
  const res = await fetch(`/api/diagrams/${id}/duplicate`, { method: 'POST' });
  const duplicated = await res.json();
  diagrams.value.push(duplicated);
};
</script>
```

**Props:**

```typescript
interface DiagramListProps {
  diagrams: DiagramMetadata[];
  loading?: boolean;
  emptyMessage?: string;
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
```

**Events:**

```typescript
{
  'select': (id: string) => void;
  'delete': (id: string) => void;
  'duplicate': (id: string) => void;
}
```

**Slots:**

```typescript
{
  empty: () => void;
  item: (props: { diagram: DiagramMetadata }) => void;
}
```

---

### DiagramCard

Individual diagram card for lists/grids.

```vue
<template>
  <DiagramCard
    :diagram="diagram"
    :show-actions="true"
    @click="handleClick"
    @delete="handleDelete"
    @duplicate="handleDuplicate"
  />
</template>

<script setup lang="ts">
import { DiagramCard } from '@aigraphia/vue';
import type { DiagramMetadata } from '@aigraphia/vue';

const props = defineProps<{
  diagram: DiagramMetadata;
}>();

const handleClick = () => {
  console.log('Opening', props.diagram.id);
};

const handleDelete = () => {
  console.log('Deleting', props.diagram.id);
};

const handleDuplicate = () => {
  console.log('Duplicating', props.diagram.id);
};
</script>
```

---

### DiagramUpload

Drag-and-drop file upload component.

```vue
<template>
  <DiagramUpload
    :accept="'.json,.json'"
    :multiple="true"
    @upload="handleUpload"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { DiagramUpload } from '@aigraphia/vue';
import type { AIGPDocument } from '@aigraphia/protocol';

const handleUpload = (diagram: AIGPDocument) => {
  console.log('Uploaded:', diagram.metadata.title);
};

const handleError = (error: Error) => {
  alert('Upload failed: ' + error.message);
};
</script>
```

**Props:**

```typescript
interface DiagramUploadProps {
  accept?: string;
  multiple?: boolean;
}
```

**Events:**

```typescript
{
  'upload': (diagram: AIGPDocument) => void;
  'error': (error: Error) => void;
}
```

---

### DiagramExport

Export dialog with format options.

```vue
<template>
  <DiagramExport
    v-if="showExport"
    :diagram="diagram"
    :default-format="'png'"
    @close="showExport = false"
  />
</template>

<script setup lang="ts">
import { DiagramExport } from '@aigraphia/vue';
import { ref } from 'vue';
import type { AIGPDocument } from '@aigraphia/protocol';

const showExport = ref(false);
const diagram = ref<AIGPDocument>({ ... });
</script>
```

**Props:**

```typescript
interface DiagramExportProps {
  diagram: AIGPDocument;
  defaultFormat?: ExportFormat;
}

type ExportFormat = 'agf' | 'mermaid' | 'plantuml' | 'svg' | 'png' | 'pdf';
```

**Events:**

```typescript
{
  'close': () => void;
  'export': (format: ExportFormat, data: string | Blob) => void;
}
```

---

## Composables

### useDiagram

```typescript
interface UseDiagramOptions {
  initialDiagram?: AIGPDocument;
  onChange?: (diagram: AIGPDocument) => void;
}

interface UseDiagramReturn {
  diagram: Ref<AIGPDocument>;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: ComputedRef<boolean>;
  canRedo: ComputedRef<boolean>;
  validate: () => ValidationResult;
}

export function useDiagram(options?: UseDiagramOptions): UseDiagramReturn;
```

**Usage:**

```vue
<template>
  <div>
    <button @click="handleAddNode">Add Node</button>
    <button @click="undo" :disabled="!canUndo">Undo</button>
    <button @click="redo" :disabled="!canRedo">Redo</button>

    <DiagramViewer :diagram="diagram" />
  </div>
</template>

<script setup lang="ts">
import { useDiagram } from '@aigraphia/vue';

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
</script>
```

---

### useDiagramValidation

```typescript
interface UseDiagramValidationReturn {
  validate: () => ValidationResult;
  errors: ComputedRef<ValidationError[]>;
  warnings: ComputedRef<string[]>;
  isValid: ComputedRef<boolean>;
}

export function useDiagramValidation(
  diagram: Ref<AIGPDocument>
): UseDiagramValidationReturn;
```

**Usage:**

```vue
<template>
  <div class="validation-panel">
    <h3>Validation</h3>
    <div v-if="isValid" style="color: green;">✓ Valid diagram</div>
    <div v-else>
      <p style="color: red;">✗ {{ errors.length }} errors</p>
      <ul>
        <li v-for="(error, i) in errors" :key="i">{{ error.message }}</li>
      </ul>
    </div>

    <div v-if="warnings.length > 0">
      <p style="color: orange;">⚠ {{ warnings.length }} warnings</p>
      <ul>
        <li v-for="(warning, i) in warnings" :key="i">{{ warning }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiagramValidation } from '@aigraphia/vue';
import { ref } from 'vue';
import type { AIGPDocument } from '@aigraphia/protocol';

const diagram = ref<AIGPDocument>({ ... });
const { isValid, errors, warnings } = useDiagramValidation(diagram);
</script>
```

---

### useDiagramExport

```typescript
interface UseDiagramExportReturn {
  exportToFormat: (format: ExportFormat, options?: ExportOptions) => Promise<void>;
  exportSVG: (options?: SVGOptions) => string;
  exportPNG: (options?: PNGOptions) => Promise<Blob>;
  exportPDF: (options?: PDFOptions) => Promise<Blob>;
  downloadAs: (filename: string, format: ExportFormat) => Promise<void>;
}

export function useDiagramExport(
  diagram: Ref<AIGPDocument>
): UseDiagramExportReturn;
```

**Usage:**

```vue
<template>
  <div>
    <button @click="downloadAs('diagram.json', 'agf')">Download .json</button>
    <button @click="downloadAs('diagram.svg', 'svg')">Download SVG</button>
    <button @click="handleExportPNG">Download PNG</button>
  </div>
</template>

<script setup lang="ts">
import { useDiagramExport } from '@aigraphia/vue';
import { ref } from 'vue';

const diagram = ref({ ... });
const { downloadAs, exportPNG } = useDiagramExport(diagram);

const handleExportPNG = async () => {
  const blob = await exportPNG({ scale: 2 });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diagram.png';
  a.click();
};
</script>
```

---

## Complete Example: Full Application

```vue
<template>
  <div class="app">
    <header>
      <h1>AIGP Diagram Tool</h1>
      <nav>
        <button @click="view = 'list'">My Diagrams</button>
        <button @click="createNew">New Diagram</button>
      </nav>
    </header>

    <main>
      <div v-if="view === 'list'">
        <DiagramUpload
          @upload="handleUpload"
          @error="handleUploadError"
        />

        <DiagramList
          :diagrams="diagrams"
          :loading="loading"
          @select="loadDiagram"
          @delete="deleteDiagram"
        />
      </div>

      <div v-else class="editor-view">
        <div class="toolbar">
          <button @click="undo" :disabled="!canUndo">Undo</button>
          <button @click="redo" :disabled="!canRedo">Redo</button>
          <button @click="saveDiagram" :disabled="!isValid">Save</button>
          <button @click="showExport = true">Export</button>
          <span :class="{ valid: isValid, invalid: !isValid }">
            {{ isValid ? '✓ Valid' : `✗ ${errors.length} errors` }}
          </span>
        </div>

        <DiagramEditor
          v-model="diagram"
          width="100%"
          height="calc(100vh - 150px)"
          @save="saveDiagram"
        />

        <DiagramExport
          v-if="showExport"
          :diagram="diagram"
          @close="showExport = false"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  DiagramEditor,
  DiagramList,
  DiagramUpload,
  DiagramExport,
  useDiagram,
  useDiagramValidation
} from '@aigraphia/vue';
import type { AIGPDocument, DiagramMetadata } from '@aigraphia/vue';

const view = ref<'list' | 'editor'>('list');
const diagrams = ref<DiagramMetadata[]>([]);
const loading = ref(true);
const currentDiagramId = ref<string | null>(null);
const showExport = ref(false);

const {
  diagram,
  addNode,
  removeNode,
  addEdge,
  undo,
  redo,
  canUndo,
  canRedo
} = useDiagram();

const { isValid, errors } = useDiagramValidation(diagram);

// Load diagrams
onMounted(async () => {
  const res = await fetch('/api/diagrams');
  diagrams.value = await res.json();
  loading.value = false;
});

// Load specific diagram
const loadDiagram = async (id: string) => {
  const res = await fetch(`/api/diagrams/${id}`);
  const data = await res.json();
  diagram.value = data;
  currentDiagramId.value = id;
  view.value = 'editor';
};

// Save diagram
const saveDiagram = async () => {
  const method = currentDiagramId.value ? 'PUT' : 'POST';
  const url = currentDiagramId.value
    ? `/api/diagrams/${currentDiagramId.value}`
    : '/api/diagrams';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(diagram.value)
  });

  const saved = await res.json();
  currentDiagramId.value = saved.id;

  // Refresh list
  const listRes = await fetch('/api/diagrams');
  diagrams.value = await listRes.json();

  alert('Diagram saved!');
};

// Delete diagram
const deleteDiagram = async (id: string) => {
  if (!confirm('Delete this diagram?')) return;

  await fetch(`/api/diagrams/${id}`, { method: 'DELETE' });
  diagrams.value = diagrams.value.filter(d => d.id !== id);

  if (currentDiagramId.value === id) {
    view.value = 'list';
    currentDiagramId.value = null;
  }
};

// Create new diagram
const createNew = () => {
  diagram.value = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: { title: 'New Diagram' },
    graph: { nodes: [], edges: [] }
  };
  currentDiagramId.value = null;
  view.value = 'editor';
};

// Upload handlers
const handleUpload = (uploaded: AIGPDocument) => {
  diagram.value = uploaded;
  view.value = 'editor';
};

const handleUploadError = (error: Error) => {
  alert(error.message);
};
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

nav button {
  margin-right: 1rem;
}

main {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.toolbar {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.toolbar button {
  margin-right: 0.5rem;
}

.valid {
  color: green;
  font-weight: bold;
}

.invalid {
  color: red;
  font-weight: bold;
}
</style>
```

---

## Styling

### Import Styles

```typescript
import '@aigraphia/vue/dist/style.css';
```

### CSS Classes

```css
.aigp-diagram-viewer { }
.aigp-diagram-viewer__canvas { }
.aigp-diagram-viewer__controls { }

.aigp-diagram-editor { }
.aigp-diagram-editor__toolbar { }
.aigp-diagram-editor__canvas { }

.aigp-diagram-list { }
.aigp-diagram-list__item { }

.aigp-diagram-card { }
.aigp-diagram-card__thumbnail { }
.aigp-diagram-card__title { }
```

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { DiagramViewer, DiagramEditor, useDiagram } from '@aigraphia/vue';
import type { DiagramViewerProps, DiagramEditorProps } from '@aigraphia/vue';
```

---

## Nuxt 3 Integration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@aigraphia/vue/nuxt']
});
```

**Usage in Nuxt:**

```vue
<template>
  <DiagramViewer :diagram="diagram" />
</template>

<script setup lang="ts">
// Auto-imported, no need for explicit import
const diagram = ref({ ... });
</script>
```

---

## Performance

- Components use `shallowRef` and `shallowReactive` for performance
- Virtual scrolling for large diagram lists
- Lazy loading for thumbnails
- Efficient reactivity with `watchEffect` and `computed`

---

## Peer Dependencies

```json
{
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}
```

---

## Bundle Size

- `@aigraphia/vue`: 48KB (13KB gzipped)
- Tree-shakeable - import only what you need

---

## Resources

- NPM: https://www.npmjs.com/package/@aigraphia/vue
- GitHub: https://github.com/AIGraphia/aigp/tree/main/packages/vue
- Documentation: https://aigp.dev/docs/vue
- Examples: https://aigp.dev/examples/vue
