# @aigraphia/export

SVG and PNG export functionality for AIGP diagrams.

## Installation

```bash
pnpm install @aigraphia/export
```

## Features

- ✅ **SVG Export** - Convert AIGP diagrams to scalable vector graphics
- ✅ **PNG Export** - High-quality raster image export
- ✅ **Automatic Layout** - Applies layout if positions not specified
- ✅ **Custom Styling** - Respects node/edge/group styles
- ✅ **Multiple Shapes** - Rectangle, circle, diamond, hexagon support
- ✅ **Retina Ready** - 2x scale by default for PNG
- ✅ **Type Safe** - Full TypeScript support

## Usage

### SVG Export

```typescript
import { renderToSVG } from '@aigraphia/export';
import type { AIGraphDocument } from '@aigraphia/protocol';

const diagram: AIGraphDocument = {
  version: '1.0.0',
  type: 'flowchart',
  metadata: { title: 'My Diagram' },
  graph: {
    nodes: [
      {
        id: 'a',
        type: 'process',
        label: 'Start',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 50 },
        data: {},
      },
    ],
    edges: [],
  },
  layout: { algorithm: 'manual' },
};

// Render to SVG string
const svg = await renderToSVG(diagram);

// With options
const svg = await renderToSVG(diagram, {
  width: 1200,
  height: 800,
  padding: 40,
  backgroundColor: '#f5f5f5',
});

// Save to file
import fs from 'fs/promises';
await fs.writeFile('diagram.svg', svg);
```

### PNG Export

```typescript
import { exportToPNG, exportToPNGFile } from '@aigraphia/export';

// Export to buffer
const buffer = await exportToPNG(diagram, {
  width: 800,
  height: 600,
  scale: 2, // 2x for retina displays
  quality: 90,
});

// Export directly to file
await exportToPNGFile(diagram, 'diagram.png', {
  width: 1200,
  height: 800,
  scale: 3, // Extra high quality
});

// Export as JPEG
await exportToPNGFile(diagram, 'diagram.jpg', {
  format: 'jpeg',
  quality: 85,
});

// Export as WebP
await exportToPNGFile(diagram, 'diagram.webp', {
  format: 'webp',
  quality: 90,
});
```

### Using the Renderer Class

```typescript
import { SVGRenderer } from '@aigraphia/export';

const renderer = new SVGRenderer({
  width: 1000,
  height: 800,
  padding: 20,
  backgroundColor: 'transparent',
});

const svg = await renderer.render(diagram);
```

## Options

### SVGRenderOptions

```typescript
interface SVGRenderOptions {
  width?: number;          // SVG width (default: 800)
  height?: number;         // SVG height (default: 600)
  padding?: number;        // Padding around diagram (default: 20)
  backgroundColor?: string; // Background color (default: '#ffffff')
  includeStyles?: boolean; // Include inline styles (default: true)
  viewBox?: boolean;       // Use viewBox attribute (default: true)
}
```

### PNGExportOptions

Extends `SVGRenderOptions` with:

```typescript
interface PNGExportOptions extends SVGRenderOptions {
  scale?: number;          // Scale factor (default: 2)
  quality?: number;        // Image quality 1-100 (default: 90)
  format?: 'png' | 'jpeg' | 'webp'; // Output format (default: 'png')
}
```

## Supported Shapes

- **rectangle** - Rounded rectangles (default)
- **circle** / **ellipse** - Circular/elliptical nodes
- **diamond** - Decision diamond shape
- **hexagon** - Six-sided polygon
- **parallelogram** - Slanted rectangle (coming soon)
- **cylinder** - Database/storage shape (coming soon)

## Supported Edge Styles

- **solid** - Solid line (default)
- **dashed** - Dashed line
- **dotted** - Dotted line
- **curved** - Curved bezier path

## Automatic Layout

If your diagram nodes don't have positions, the exporter will automatically apply the specified layout algorithm:

```typescript
const diagram: AIGraphDocument = {
  version: '1.0.0',
  type: 'flowchart',
  metadata: { title: 'Auto Layout' },
  graph: {
    nodes: [
      { id: 'a', type: 'process', label: 'A', data: {} }, // No position!
      { id: 'b', type: 'process', label: 'B', data: {} },
    ],
    edges: [
      { id: 'e1', type: 'flow', source: 'a', target: 'b', data: {} },
    ],
  },
  layout: { algorithm: 'hierarchical' }, // Will be applied automatically
};

const svg = await renderToSVG(diagram);
// Nodes will have computed positions
```

## Examples

### Flowchart

```typescript
import { exportToPNGFile } from '@aigraphia/export';

const flowchart = {
  version: '1.0.0',
  type: 'flowchart',
  metadata: { title: 'Decision Flow' },
  graph: {
    nodes: [
      { id: '1', type: 'start', label: 'Start', position: { x: 100, y: 0 }, data: {} },
      { id: '2', type: 'decision', label: 'Check?', position: { x: 100, y: 100 }, data: {}, style: { shape: 'diamond' } },
      { id: '3', type: 'process', label: 'Yes', position: { x: 0, y: 200 }, data: {} },
      { id: '4', type: 'process', label: 'No', position: { x: 200, y: 200 }, data: {} },
    ],
    edges: [
      { id: 'e1', type: 'flow', source: '1', target: '2', data: {} },
      { id: 'e2', type: 'flow', source: '2', target: '3', label: 'Yes', data: {} },
      { id: 'e3', type: 'flow', source: '2', target: '4', label: 'No', data: {} },
    ],
  },
  layout: { algorithm: 'hierarchical' },
};

await exportToPNGFile(flowchart, 'flowchart.png', {
  width: 800,
  height: 600,
});
```

### Organization Chart

```typescript
const orgChart = {
  version: '1.0.0',
  type: 'org-chart',
  metadata: { title: 'Company Structure' },
  graph: {
    nodes: [
      { id: 'ceo', type: 'executive', label: 'CEO', data: {} },
      { id: 'cto', type: 'executive', label: 'CTO', data: {} },
      { id: 'cfo', type: 'executive', label: 'CFO', data: {} },
    ],
    edges: [
      { id: 'e1', type: 'reports-to', source: 'cto', target: 'ceo', data: {} },
      { id: 'e2', type: 'reports-to', source: 'cfo', target: 'ceo', data: {} },
    ],
  },
  layout: { algorithm: 'hierarchical', direction: 'TB' },
};

await exportToPNGFile(orgChart, 'org-chart.png');
```

## Advanced Usage

### Custom Arrow Styles

The SVG renderer includes arrow markers for directed edges:

```typescript
const diagram = {
  // ...
  graph: {
    nodes: [/* ... */],
    edges: [
      {
        id: 'e1',
        type: 'flow',
        source: 'a',
        target: 'b',
        data: {},
        style: {
          strokeColor: '#ff0000',
          strokeWidth: 3,
          arrowEnd: 'arrow', // Will render arrow marker
        },
      },
    ],
  },
};
```

### Group Rendering

Groups (containers, swimlanes) are rendered as semi-transparent backgrounds:

```typescript
const diagram = {
  // ...
  graph: {
    nodes: [
      { id: 'a', type: 'process', label: 'Task A', position: { x: 10, y: 10 }, data: {} },
      { id: 'b', type: 'process', label: 'Task B', position: { x: 10, y: 80 }, data: {} },
    ],
    edges: [],
    groups: [
      {
        id: 'g1',
        type: 'swimlane',
        label: 'Team Alpha',
        nodeIds: ['a', 'b'],
        data: {},
        style: {
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
          opacity: 0.3,
        },
      },
    ],
  },
};
```

## Performance

- **SVG Rendering**: <50ms for typical diagrams (50 nodes, 50 edges)
- **PNG Export**: ~200ms for 800x600 @ 2x scale
- **Large Diagrams**: Tested up to 1000 nodes

## Dependencies

- `@aigraphia/protocol` - Core AIGP types
- `@aigraphia/plugins` - Plugin system
- `@aigraphia/layout` - Layout engines
- `sharp` - High-performance image processing
- `jsdom` - DOM manipulation for SVG

## License

MIT - See LICENSE file for details

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Related Packages

- `@aigraphia/protocol` - Core protocol definitions
- `@aigraphia/layout` - Layout algorithms
- `@aigraphia/converters` - Format converters (Mermaid, etc.)
- `@aigraphia/cli` - Command-line interface
