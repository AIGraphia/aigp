# AIGP Plugin Development Guide

## Overview

Complete guide for creating custom diagram type plugins for AIGP. This guide covers the plugin architecture, development workflow, and best practices for extending AIGP with new diagram types.

---

## Plugin Architecture

### Plugin Interface

```typescript
interface AIGPPlugin {
  name: string;                           // Unique plugin identifier
  version: string;                        // Semantic version
  diagramType: string;                    // Diagram type this plugin handles
  schema: DiagramTypeSchema;              // JSON schema for validation
  renderer: DiagramRenderer;              // SVG rendering logic
  layoutEngine?: LayoutEngine;            // Optional custom layout
  converter?: FormatConverter;            // Optional format converters
  validator?: CustomValidator;            // Optional custom validation
  metadata?: PluginMetadata;              // Plugin information
}
```

### Core Components

```typescript
// Schema Definition
interface DiagramTypeSchema {
  nodeTypes: NodeTypeDefinition[];
  edgeTypes: EdgeTypeDefinition[];
  constraints?: ValidationConstraints;
  defaultStyles?: StyleDefinitions;
}

// Renderer
interface DiagramRenderer {
  render(document: AIGPDocument, options: RenderOptions): SVGElement;
  renderNode(node: Node, context: RenderContext): SVGElement;
  renderEdge(edge: Edge, context: RenderContext): SVGElement;
  calculateBounds(document: AIGPDocument): BoundingBox;
}

// Layout Engine (Optional)
interface LayoutEngine {
  name: string;
  apply(graph: Graph, options?: LayoutOptions): LayoutResult;
  validate(graph: Graph): boolean;
}
```

---

## Creating a Plugin

### Step 1: Set Up Project Structure

```bash
mkdir aigp-plugin-timeline
cd aigp-plugin-timeline
pnpm init
pnpm install @aigraphia/protocol zod
pnpm install -D typescript @types/node
```

**Directory Structure:**

```
aigp-plugin-timeline/
├── src/
│   ├── index.ts              # Main plugin export
│   ├── schema.ts             # Schema definition
│   ├── renderer.ts           # SVG rendering
│   ├── layout.ts             # Layout algorithm
│   ├── validator.ts          # Custom validation
│   └── styles.ts             # Default styles
├── examples/
│   └── product-launch.json   # Example diagram
├── tests/
│   ├── schema.test.ts
│   ├── renderer.test.ts
│   └── layout.test.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

### Step 2: Define Schema

**src/schema.ts:**

```typescript
import { z } from 'zod';

// Node types specific to timeline diagrams
export const TimelineNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['milestone', 'event', 'phase', 'deadline']),
  label: z.string(),
  data: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    duration?: z.number().optional(),               // Days
    status?: z.enum(['completed', 'in-progress', 'planned']).optional(),
    description?: z.string().optional(),
    assignee?: z.string().optional(),
    priority?: z.enum(['low', 'medium', 'high', 'critical']).optional()
  })
});

// Edge types for timeline relationships
export const TimelineEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(['depends-on', 'blocks', 'related']),
  label: z.string().optional(),
  data: z.object({
    lag?: z.number().optional()  // Days between events
  }).optional()
});

// Full diagram schema
export const TimelineDiagramSchema = z.object({
  schema: z.literal('https://aigraphia.com/schema/v1'),
  version: z.string(),
  type: z.literal('timeline'),
  metadata: z.object({
    title: z.string(),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    tags: z.array(z.string()).optional()
  }),
  graph: z.object({
    nodes: z.array(TimelineNodeSchema),
    edges: z.array(TimelineEdgeSchema).optional()
  })
});

export type TimelineNode = z.infer<typeof TimelineNodeSchema>;
export type TimelineEdge = z.infer<typeof TimelineEdgeSchema>;
export type TimelineDiagram = z.infer<typeof TimelineDiagramSchema>;
```

---

### Step 3: Implement Renderer

**src/renderer.ts:**

```typescript
import type { AIGPDocument, Node, Edge } from '@aigraphia/protocol';
import { getNodeStyle, getEdgeStyle } from './styles';

export class TimelineRenderer {
  private readonly TIMELINE_HEIGHT = 100;
  private readonly NODE_WIDTH = 120;
  private readonly NODE_HEIGHT = 80;
  private readonly PADDING = 50;

  render(document: AIGPDocument, options: RenderOptions = {}): SVGElement {
    const { width = 1200, height = 600 } = options;

    // Create SVG root
    const svg = this.createSVGElement('svg', {
      width: width.toString(),
      height: height.toString(),
      viewBox: `0 0 ${width} ${height}`,
      xmlns: 'http://www.w3.org/2000/svg'
    });

    // Add background
    const bg = this.createSVGElement('rect', {
      width: '100%',
      height: '100%',
      fill: '#ffffff'
    });
    svg.appendChild(bg);

    // Main group for diagram content
    const group = this.createSVGElement('g', {
      transform: `translate(${this.PADDING}, ${height / 2})`
    });
    svg.appendChild(group);

    // Calculate positions
    const positions = this.calculatePositions(document);

    // Draw timeline axis
    const axis = this.renderAxis(positions, document);
    group.appendChild(axis);

    // Render edges first (so they appear behind nodes)
    if (document.graph.edges) {
      document.graph.edges.forEach(edge => {
        const edgeElement = this.renderEdge(edge, positions);
        group.appendChild(edgeElement);
      });
    }

    // Render nodes
    document.graph.nodes.forEach(node => {
      const nodeElement = this.renderNode(node, positions);
      group.appendChild(nodeElement);
    });

    return svg;
  }

  private renderNode(node: Node, positions: Map<string, Position>): SVGElement {
    const pos = positions.get(node.id)!;
    const style = getNodeStyle(node.type);

    const nodeGroup = this.createSVGElement('g', {
      transform: `translate(${pos.x}, ${pos.y})`,
      class: `node node-${node.type}`
    });

    // Node background
    const rect = this.createSVGElement('rect', {
      x: (-this.NODE_WIDTH / 2).toString(),
      y: (-this.NODE_HEIGHT / 2).toString(),
      width: this.NODE_WIDTH.toString(),
      height: this.NODE_HEIGHT.toString(),
      rx: '8',
      fill: style.fill,
      stroke: style.stroke,
      'stroke-width': '2'
    });
    nodeGroup.appendChild(rect);

    // Node label
    const text = this.createSVGElement('text', {
      x: '0',
      y: '0',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: style.textColor,
      'font-size': '14',
      'font-weight': 'bold'
    });
    text.textContent = node.label;
    nodeGroup.appendChild(text);

    // Date label
    if (node.data?.date) {
      const dateText = this.createSVGElement('text', {
        x: '0',
        y: '20',
        'text-anchor': 'middle',
        fill: style.textColor,
        'font-size': '12'
      });
      dateText.textContent = node.data.date;
      nodeGroup.appendChild(dateText);
    }

    // Status indicator
    if (node.data?.status) {
      const indicator = this.createSVGElement('circle', {
        cx: (this.NODE_WIDTH / 2 - 15).toString(),
        cy: (-this.NODE_HEIGHT / 2 + 15).toString(),
        r: '6',
        fill: this.getStatusColor(node.data.status)
      });
      nodeGroup.appendChild(indicator);
    }

    return nodeGroup;
  }

  private renderEdge(edge: Edge, positions: Map<string, Position>): SVGElement {
    const sourcePos = positions.get(edge.source)!;
    const targetPos = positions.get(edge.target)!;
    const style = getEdgeStyle(edge.type);

    const edgeGroup = this.createSVGElement('g', {
      class: `edge edge-${edge.type}`
    });

    // Draw curved path
    const path = this.createSVGElement('path', {
      d: this.createCurvedPath(sourcePos, targetPos),
      stroke: style.stroke,
      'stroke-width': '2',
      fill: 'none',
      'marker-end': 'url(#arrowhead)'
    });
    edgeGroup.appendChild(path);

    // Edge label
    if (edge.label) {
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = (sourcePos.y + targetPos.y) / 2 - 10;

      const text = this.createSVGElement('text', {
        x: midX.toString(),
        y: midY.toString(),
        'text-anchor': 'middle',
        fill: style.textColor,
        'font-size': '12'
      });
      text.textContent = edge.label;
      edgeGroup.appendChild(text);
    }

    return edgeGroup;
  }

  private renderAxis(positions: Map<string, Position>, document: AIGPDocument): SVGElement {
    const axisGroup = this.createSVGElement('g', { class: 'timeline-axis' });

    // Calculate axis bounds
    const xPositions = Array.from(positions.values()).map(p => p.x);
    const minX = Math.min(...xPositions) - this.NODE_WIDTH;
    const maxX = Math.max(...xPositions) + this.NODE_WIDTH;

    // Draw main axis line
    const line = this.createSVGElement('line', {
      x1: minX.toString(),
      y1: '0',
      x2: maxX.toString(),
      y2: '0',
      stroke: '#333',
      'stroke-width': '3'
    });
    axisGroup.appendChild(line);

    return axisGroup;
  }

  private calculatePositions(document: AIGPDocument): Map<string, Position> {
    const positions = new Map<string, Position>();

    // Sort nodes by date
    const sortedNodes = [...document.graph.nodes].sort((a, b) => {
      const dateA = new Date(a.data?.date || 0).getTime();
      const dateB = new Date(b.data?.date || 0).getTime();
      return dateA - dateB;
    });

    // Calculate time span
    const dates = sortedNodes.map(n => new Date(n.data?.date || 0).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const timeSpan = maxDate - minDate || 1;

    // Position nodes along timeline
    const availableWidth = 1000; // Adjust based on viewport
    sortedNodes.forEach(node => {
      const nodeDate = new Date(node.data?.date || 0).getTime();
      const ratio = (nodeDate - minDate) / timeSpan;
      const x = ratio * availableWidth;

      // Alternate nodes above/below axis
      const index = sortedNodes.indexOf(node);
      const y = index % 2 === 0 ? -this.TIMELINE_HEIGHT : this.TIMELINE_HEIGHT;

      positions.set(node.id, { x, y });
    });

    return positions;
  }

  private createSVGElement(tag: string, attrs: Record<string, string>): SVGElement {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  private createCurvedPath(source: Position, target: Position): string {
    const midY = (source.y + target.y) / 2;
    return `M ${source.x} ${source.y} Q ${source.x} ${midY}, ${(source.x + target.x) / 2} ${midY} T ${target.x} ${target.y}`;
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'completed': '#10b981',
      'in-progress': '#3b82f6',
      'planned': '#94a3b8'
    };
    return colors[status] || '#94a3b8';
  }
}

interface Position {
  x: number;
  y: number;
}

interface RenderOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
}
```

---

### Step 4: Implement Layout Engine

**src/layout.ts:**

```typescript
import type { Graph, LayoutResult, LayoutOptions } from '@aigraphia/protocol';

export class TimelineLayoutEngine {
  name = 'timeline-horizontal';

  apply(graph: Graph, options: LayoutOptions = {}): LayoutResult {
    const { direction = 'horizontal', spacing = 150 } = options;

    // Sort nodes by date
    const sortedNodes = this.sortByDate(graph.nodes);

    // Calculate positions
    const positions: Record<string, { x: number; y: number }> = {};

    sortedNodes.forEach((node, index) => {
      if (direction === 'horizontal') {
        positions[node.id] = {
          x: index * spacing,
          y: index % 2 === 0 ? 0 : 100
        };
      } else {
        positions[node.id] = {
          x: index % 2 === 0 ? 0 : 100,
          y: index * spacing
        };
      }
    });

    return {
      positions,
      bounds: this.calculateBounds(positions)
    };
  }

  validate(graph: Graph): boolean {
    // Ensure all nodes have date field
    return graph.nodes.every(node => node.data?.date);
  }

  private sortByDate(nodes: any[]): any[] {
    return [...nodes].sort((a, b) => {
      const dateA = new Date(a.data?.date || 0).getTime();
      const dateB = new Date(b.data?.date || 0).getTime();
      return dateA - dateB;
    });
  }

  private calculateBounds(positions: Record<string, { x: number; y: number }>) {
    const coords = Object.values(positions);
    return {
      minX: Math.min(...coords.map(p => p.x)),
      minY: Math.min(...coords.map(p => p.y)),
      maxX: Math.max(...coords.map(p => p.x)),
      maxY: Math.max(...coords.map(p => p.y))
    };
  }
}
```

---

### Step 5: Add Custom Validation

**src/validator.ts:**

```typescript
import type { AIGPDocument, ValidationError } from '@aigraphia/protocol';

export function validateTimelineDiagram(document: AIGPDocument): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate date format
  document.graph.nodes.forEach(node => {
    if (!node.data?.date) {
      errors.push({
        path: `nodes.${node.id}.data.date`,
        message: `Node '${node.id}' is missing required date field`,
        code: 'MISSING_DATE'
      });
    } else if (!isValidDate(node.data.date)) {
      errors.push({
        path: `nodes.${node.id}.data.date`,
        message: `Invalid date format: '${node.data.date}'. Expected YYYY-MM-DD`,
        code: 'INVALID_DATE_FORMAT'
      });
    }
  });

  // Validate chronological order
  const dates = document.graph.nodes
    .map(n => ({ id: n.id, date: new Date(n.data?.date || 0) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Validate metadata date range
  if (document.metadata?.startDate) {
    const firstNodeDate = dates[0]?.date;
    const metaStartDate = new Date(document.metadata.startDate);
    if (firstNodeDate < metaStartDate) {
      errors.push({
        path: 'metadata.startDate',
        message: 'Metadata startDate is after first node date',
        code: 'INCONSISTENT_DATE_RANGE'
      });
    }
  }

  if (document.metadata?.endDate) {
    const lastNodeDate = dates[dates.length - 1]?.date;
    const metaEndDate = new Date(document.metadata.endDate);
    if (lastNodeDate > metaEndDate) {
      errors.push({
        path: 'metadata.endDate',
        message: 'Metadata endDate is before last node date',
        code: 'INCONSISTENT_DATE_RANGE'
      });
    }
  }

  // Validate dependencies make chronological sense
  if (document.graph.edges) {
    document.graph.edges.forEach(edge => {
      const sourceNode = document.graph.nodes.find(n => n.id === edge.source);
      const targetNode = document.graph.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceDate = new Date(sourceNode.data?.date || 0);
        const targetDate = new Date(targetNode.data?.date || 0);

        if (edge.type === 'depends-on' && sourceDate > targetDate) {
          errors.push({
            path: `edges.${edge.id}`,
            message: `Dependency error: Target '${edge.target}' occurs before source '${edge.source}'`,
            code: 'INVALID_DEPENDENCY_ORDER'
          });
        }
      }
    });
  }

  return errors;
}

function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
```

---

### Step 6: Define Styles

**src/styles.ts:**

```typescript
interface NodeStyle {
  fill: string;
  stroke: string;
  textColor: string;
}

interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  textColor: string;
}

export function getNodeStyle(nodeType: string): NodeStyle {
  const styles: Record<string, NodeStyle> = {
    milestone: {
      fill: '#fef3c7',
      stroke: '#f59e0b',
      textColor: '#92400e'
    },
    event: {
      fill: '#dbeafe',
      stroke: '#3b82f6',
      textColor: '#1e3a8a'
    },
    phase: {
      fill: '#e0e7ff',
      stroke: '#6366f1',
      textColor: '#312e81'
    },
    deadline: {
      fill: '#fecaca',
      stroke: '#ef4444',
      textColor: '#7f1d1d'
    }
  };

  return styles[nodeType] || styles.event;
}

export function getEdgeStyle(edgeType: string): EdgeStyle {
  const styles: Record<string, EdgeStyle> = {
    'depends-on': {
      stroke: '#6b7280',
      strokeWidth: 2,
      textColor: '#374151'
    },
    'blocks': {
      stroke: '#ef4444',
      strokeWidth: 2,
      textColor: '#991b1b'
    },
    'related': {
      stroke: '#94a3b8',
      strokeWidth: 1,
      textColor: '#475569'
    }
  };

  return styles[edgeType] || styles.related;
}
```

---

### Step 7: Main Plugin Export

**src/index.ts:**

```typescript
import type { AIGPPlugin } from '@aigraphia/protocol';
import { TimelineDiagramSchema } from './schema';
import { TimelineRenderer } from './renderer';
import { TimelineLayoutEngine } from './layout';
import { validateTimelineDiagram } from './validator';

export const TimelinePlugin: AIGPPlugin = {
  name: 'aigp-plugin-timeline',
  version: '1.0.0',
  diagramType: 'timeline',

  schema: {
    nodeTypes: [
      {
        type: 'milestone',
        label: 'Milestone',
        description: 'Major project milestone',
        requiredFields: ['date'],
        optionalFields: ['duration', 'status', 'description']
      },
      {
        type: 'event',
        label: 'Event',
        description: 'Single point-in-time event',
        requiredFields: ['date']
      },
      {
        type: 'phase',
        label: 'Phase',
        description: 'Time period or project phase',
        requiredFields: ['date', 'duration']
      },
      {
        type: 'deadline',
        label: 'Deadline',
        description: 'Hard deadline or due date',
        requiredFields: ['date'],
        optionalFields: ['priority']
      }
    ],
    edgeTypes: [
      {
        type: 'depends-on',
        label: 'Depends On',
        description: 'Dependency relationship'
      },
      {
        type: 'blocks',
        label: 'Blocks',
        description: 'Blocking relationship'
      },
      {
        type: 'related',
        label: 'Related',
        description: 'General relationship'
      }
    ],
    constraints: {
      requiredFields: {
        'metadata.startDate': true,
        'metadata.endDate': true
      }
    }
  },

  renderer: new TimelineRenderer(),

  layoutEngine: new TimelineLayoutEngine(),

  validator: validateTimelineDiagram,

  metadata: {
    author: 'AIGP Community',
    license: 'MIT',
    homepage: 'https://github.com/aigp/plugins/timeline',
    description: 'Timeline diagram plugin for project planning and scheduling',
    keywords: ['timeline', 'gantt', 'schedule', 'project-management']
  }
};

export default TimelinePlugin;
export { TimelineDiagramSchema, TimelineRenderer, TimelineLayoutEngine, validateTimelineDiagram };
```

---

### Step 8: Package Configuration

**package.json:**

```json
{
  "name": "aigp-plugin-timeline",
  "version": "1.0.0",
  "description": "Timeline diagram plugin for AIGP",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src/**/*.ts",
    "prepublishOnly": "pnpm run build && pnpm test"
  },
  "keywords": [
    "aigp",
    "plugin",
    "timeline",
    "diagram",
    "visualization"
  ],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "@aigraphia/protocol": "^1.0.0"
  },
  "devDependencies": {
    "@aigraphia/protocol": "^1.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "zod": "^3.22.0"
  }
}
```

---

## Example Diagram

**examples/product-launch.json:**

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "timeline",
  "metadata": {
    "title": "Product Launch Timeline",
    "description": "Q1 2027 Product Launch Schedule",
    "startDate": "2027-01-01",
    "endDate": "2027-03-31",
    "tags": ["product", "launch", "marketing"]
  },
  "graph": {
    "nodes": [
      {
        "id": "kickoff",
        "type": "milestone",
        "label": "Project Kickoff",
        "data": {
          "date": "2027-01-05",
          "status": "completed",
          "description": "Initial team meeting and planning"
        }
      },
      {
        "id": "design-complete",
        "type": "milestone",
        "label": "Design Complete",
        "data": {
          "date": "2027-01-20",
          "status": "completed",
          "assignee": "Design Team"
        }
      },
      {
        "id": "dev-phase",
        "type": "phase",
        "label": "Development Phase",
        "data": {
          "date": "2027-01-21",
          "duration": 30,
          "status": "in-progress",
          "assignee": "Engineering"
        }
      },
      {
        "id": "beta-release",
        "type": "event",
        "label": "Beta Release",
        "data": {
          "date": "2027-02-20",
          "status": "planned",
          "description": "Limited beta to 100 users"
        }
      },
      {
        "id": "marketing-campaign",
        "type": "phase",
        "label": "Marketing Campaign",
        "data": {
          "date": "2027-03-01",
          "duration": 21,
          "status": "planned",
          "assignee": "Marketing Team"
        }
      },
      {
        "id": "launch",
        "type": "deadline",
        "label": "Public Launch",
        "data": {
          "date": "2027-03-22",
          "status": "planned",
          "priority": "critical",
          "description": "Full public release"
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "kickoff",
        "target": "design-complete",
        "type": "depends-on"
      },
      {
        "id": "e2",
        "source": "design-complete",
        "target": "dev-phase",
        "type": "depends-on"
      },
      {
        "id": "e3",
        "source": "dev-phase",
        "target": "beta-release",
        "type": "depends-on"
      },
      {
        "id": "e4",
        "source": "beta-release",
        "target": "launch",
        "type": "depends-on"
      },
      {
        "id": "e5",
        "source": "marketing-campaign",
        "target": "launch",
        "type": "depends-on"
      }
    ]
  }
}
```

---

## Testing

**tests/schema.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { TimelineDiagramSchema } from '../src/schema';

describe('Timeline Schema', () => {
  it('validates correct timeline diagram', () => {
    const diagram = {
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: 'timeline',
      metadata: {
        title: 'Test Timeline',
        startDate: '2027-01-01',
        endDate: '2027-12-31'
      },
      graph: {
        nodes: [
          {
            id: 'n1',
            type: 'milestone',
            label: 'Start',
            data: { date: '2027-01-01' }
          }
        ]
      }
    };

    const result = TimelineDiagramSchema.safeParse(diagram);
    expect(result.success).toBe(true);
  });

  it('rejects invalid date format', () => {
    const diagram = {
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: 'timeline',
      metadata: { title: 'Test', startDate: '2027-01-01', endDate: '2027-12-31' },
      graph: {
        nodes: [
          {
            id: 'n1',
            type: 'milestone',
            label: 'Start',
            data: { date: '01/01/2027' } // Wrong format
          }
        ]
      }
    };

    const result = TimelineDiagramSchema.safeParse(diagram);
    expect(result.success).toBe(false);
  });
});
```

---

## Publishing

### To npm

```bash
pnpm login
pnpm publish --access public
```

### To AIGP Registry

```bash
# Submit plugin for review
aigp plugin submit ./aigp-plugin-timeline

# After approval, it will be available in the registry
aigp plugin install timeline
```

---

## Best Practices

### 1. Schema Design

- **Be specific**: Define clear node and edge types
- **Use constraints**: Enforce data integrity with validation rules
- **Provide defaults**: Make common use cases easy

### 2. Rendering

- **Performance**: Optimize for large diagrams (>500 nodes)
- **Accessibility**: Add ARIA labels, keyboard navigation
- **Responsiveness**: Support different viewport sizes
- **Theming**: Support light/dark modes

### 3. Validation

- **Early validation**: Fail fast with clear error messages
- **Helpful errors**: Include path, message, and suggested fix
- **Custom rules**: Implement domain-specific validation

### 4. Testing

- **Unit tests**: Test schema, renderer, layout separately
- **Integration tests**: Test full plugin with real diagrams
- **Visual regression**: Screenshot testing for rendering
- **Performance tests**: Benchmark with large datasets

### 5. Documentation

- **README**: Clear installation and usage instructions
- **Examples**: Provide 3-5 example diagrams
- **API docs**: Document all public interfaces
- **Migration guide**: If updating from previous version

---

## Plugin Registry

### Submission Process

1. **Prepare**: Ensure tests pass, documentation complete
2. **Submit**: `aigp plugin submit .`
3. **Review**: AIGP team reviews code quality, security
4. **Approval**: Plugin listed in registry
5. **Maintenance**: Keep plugin updated with AIGP protocol changes

### Quality Criteria

- ✅ Follows AIGP plugin interface
- ✅ 80%+ test coverage
- ✅ TypeScript with full type definitions
- ✅ Comprehensive documentation
- ✅ Example diagrams included
- ✅ Semantic versioning
- ✅ MIT/Apache 2.0 license

---

## Advanced Topics

### Custom Interactions

```typescript
interface InteractionHandler {
  onNodeClick?: (node: Node, event: MouseEvent) => void;
  onNodeHover?: (node: Node, event: MouseEvent) => void;
  onEdgeClick?: (edge: Edge, event: MouseEvent) => void;
  onBackgroundClick?: (event: MouseEvent) => void;
  onZoom?: (scale: number) => void;
  onPan?: (x: number, y: number) => void;
}

class InteractiveTimelineRenderer extends TimelineRenderer {
  constructor(private handlers: InteractionHandler) {
    super();
  }

  renderNode(node: Node, context: RenderContext): SVGElement {
    const element = super.renderNode(node, context);

    if (this.handlers.onNodeClick) {
      element.addEventListener('click', (e) => {
        this.handlers.onNodeClick!(node, e as MouseEvent);
      });
    }

    if (this.handlers.onNodeHover) {
      element.addEventListener('mouseenter', (e) => {
        this.handlers.onNodeHover!(node, e as MouseEvent);
      });
    }

    return element;
  }
}
```

### Animation Support

```typescript
interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  property: 'opacity' | 'transform' | 'fill';
}

class AnimatedTimelineRenderer extends TimelineRenderer {
  animateNodeEntry(node: Node, config: AnimationConfig): void {
    const element = document.querySelector(`#${node.id}`);
    if (!element) return;

    element.animate([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: config.duration,
      easing: config.easing
    });
  }
}
```

### Export to Custom Formats

```typescript
interface CustomExporter {
  exportToFormat(document: AIGPDocument, format: string): string | Blob;
}

class TimelineExporter implements CustomExporter {
  exportToFormat(document: AIGPDocument, format: string): string | Blob {
    switch (format) {
      case 'ical':
        return this.exportToICalendar(document);
      case 'gantt':
        return this.exportToMSProject(document);
      case 'csv':
        return this.exportToCSV(document);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private exportToICalendar(document: AIGPDocument): string {
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\n';

    document.graph.nodes.forEach(node => {
      ical += 'BEGIN:VEVENT\n';
      ical += `SUMMARY:${node.label}\n`;
      ical += `DTSTART:${node.data?.date?.replace(/-/g, '')}\n`;
      ical += `DESCRIPTION:${node.data?.description || ''}\n`;
      ical += 'END:VEVENT\n';
    });

    ical += 'END:VCALENDAR';
    return ical;
  }

  private exportToCSV(document: AIGPDocument): string {
    let csv = 'ID,Type,Label,Date,Status,Description\n';

    document.graph.nodes.forEach(node => {
      csv += `${node.id},${node.type},${node.label},${node.data?.date},${node.data?.status || ''},${node.data?.description || ''}\n`;
    });

    return csv;
  }
}
```

---

## Community Plugins

| Plugin | Type | Description |
|--------|------|-------------|
| **timeline** | Project Management | Timeline diagrams with dates |
| **gantt** | Project Management | Gantt charts with dependencies |
| **kanban** | Workflow | Kanban board visualization |
| **mindmap** | Brainstorming | Mind mapping diagrams |
| **org-chart** | Organization | Organizational hierarchies |
| **network-topology** | Infrastructure | Network infrastructure diagrams |
| **bpmn** | Business Process | BPMN 2.0 compliant diagrams |
| **uml-component** | Software Design | UML component diagrams |
| **data-lineage** | Data Engineering | Data pipeline lineage |

---

## Resources

- **Plugin Registry**: https://aigp.dev/plugins
- **Plugin Template**: https://github.com/aigp/plugin-template
- **Development Guide**: https://aigp.dev/docs/plugin-development
- **Community Forum**: https://github.com/AIGraphia/aigp/discussions
- **Example Plugins**: https://github.com/aigp/plugins

---

## Support

- GitHub Issues: https://github.com/AIGraphia/aigp/issues
- Discord: https://discord.gg/aigp
- Email: plugins@aigp.dev
