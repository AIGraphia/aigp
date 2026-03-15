# AIGraphia Protocol Documentation

## Overview

AIGraphia uses a universal JSON protocol designed for AI-first diagram generation. This document specifies the complete schema.

## Core Document Structure

```typescript
interface AIGraphDocument {
  schema: string;              // "https://aigraphia.com/schema/v1"
  version: string;             // "1.0.0"
  type: DiagramType;          // See diagram types below
  metadata: DiagramMetadata;
  graph: Graph;
  layout: LayoutConfig;
  styling?: StyleConfig;
}
```

## Diagram Types

### Software Engineering
- `flowchart` - Process flows, algorithms, decision trees
- `sequence` - Temporal interactions, API calls, message flows
- `architecture` - System design, microservices, infrastructure
- `uml-class` - Object-oriented design, class hierarchies
- `er` - Database schema, entity relationships

### Business & Process
- `bpmn` - Business processes, workflows
- `org-chart` - Organizational structure, reporting lines
- `customer-journey` - User experiences, touchpoints
- `value-stream` - Process steps with metrics
- `kanban` - Task boards, workflow stages

### Data & Analysis
- `sankey` - Flow analysis, resource allocation
- `funnel` - Conversion analysis, sales pipelines
- `timeline` - Project planning, history, roadmaps
- `network` - Generic node-edge graphs
- `mind-map` - Brainstorming, concept exploration
- `concept-map` - Knowledge relationships
- `decision-tree` - Decision analysis with probabilities

### General
- `graph` - Generic graph structure
- `tree` - Hierarchical tree
- `custom` - Custom diagram type

## Metadata

```typescript
interface DiagramMetadata {
  title: string;
  description?: string;
  author?: string;
  created?: string;          // ISO 8601 datetime
  modified?: string;         // ISO 8601 datetime
  tags?: string[];
  version?: string;
}
```

## Graph Structure

```typescript
interface Graph {
  nodes: Node[];
  edges: Edge[];
  groups?: Group[];
}
```

### Node

```typescript
interface Node {
  id: string;                 // Unique identifier
  type: string;               // Node type (diagram-specific)
  label: string;              // Display label
  position?: Position;        // Optional position (auto-layout if omitted)
  size?: Size;               // Optional size (auto-sized if omitted)
  data: NodeData;            // Type-specific data
  style?: NodeStyle;         // Custom styling
  metadata?: Record<string, any>;
}
```

### Edge

```typescript
interface Edge {
  id: string;
  type: string;
  source: string;            // Source node ID
  target: string;            // Target node ID
  label?: string;
  data: EdgeData;
  style?: EdgeStyle;
  metadata?: Record<string, any>;
}
```

### Group

```typescript
interface Group {
  id: string;
  type: string;              // 'swimlane', 'package', 'cluster', etc.
  label: string;
  nodeIds: string[];         // Nodes in this group
  childGroupIds?: string[];  // Nested groups
  position?: Position;
  size?: Size;
  data: GroupData;
  style?: GroupStyle;
  metadata?: Record<string, any>;
}
```

## Node Data Fields

### General
```typescript
{
  description?: string;
  icon?: string;
}
```

### UML-Specific
```typescript
{
  attributes?: Array<{
    name: string;
    type: string;
    visibility?: 'public' | 'private' | 'protected';
  }>;
  methods?: Array<{
    name: string;
    parameters?: string[];
    returnType?: string;
    visibility?: 'public' | 'private' | 'protected';
  }>;
}
```

### Sequence Diagram-Specific
```typescript
{
  lifeline?: boolean;         // Required for sequence diagrams
  activationStart?: number;
  activationEnd?: number;
}
```

### Timeline-Specific
```typescript
{
  startDate?: string;         // ISO 8601
  endDate?: string;          // ISO 8601
  duration?: number;         // In days
}
```

### Metric-Specific
```typescript
{
  value?: number;
  unit?: string;
  percentage?: number;
}
```

### Custom
```typescript
{
  custom?: Record<string, any>;
}
```

## Edge Data Fields

### General
```typescript
{
  direction?: 'unidirectional' | 'bidirectional';
  weight?: number;
}
```

### UML-Specific
```typescript
{
  relationship?: 'association' | 'aggregation' | 'composition' | 'inheritance';
  multiplicity?: {
    source: string;
    target: string;
  };
}
```

### Sequence-Specific
```typescript
{
  messageType?: 'sync' | 'async' | 'return' | 'create' | 'destroy';
  timestamp?: number;
}
```

## Layout Configuration

```typescript
interface LayoutConfig {
  algorithm: 'hierarchical' | 'force-directed' | 'layered' |
             'timeline' | 'radial' | 'grid' | 'manual';
  direction?: 'TB' | 'BT' | 'LR' | 'RL' | 'radial';
  spacing?: {
    node?: number;
    rank?: number;
    edge?: number;
  };
  alignment?: 'start' | 'center' | 'end';
  custom?: Record<string, any>;
}
```

### Algorithm Selection

- **hierarchical** (Dagre): Best for flowcharts, org charts, trees
- **layered** (ELK): Best for BPMN, UML, architecture
- **force-directed** (D3): Best for networks, concept maps
- **timeline**: Best for sequences, timelines
- **radial**: Best for mind maps
- **grid**: Best for Kanban boards
- **manual**: Preserve user-specified positions

## Styling

### Node Style
```typescript
{
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  shape?: 'rectangle' | 'ellipse' | 'diamond' | 'parallelogram' |
          'hexagon' | 'cylinder' | 'circle';
  padding?: number;
  opacity?: number;
}
```

### Edge Style
```typescript
{
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  arrowStart?: 'none' | 'arrow' | 'diamond' | 'circle';
  arrowEnd?: 'none' | 'arrow' | 'diamond' | 'circle';
  textColor?: string;
  fontSize?: number;
  curved?: boolean;
  opacity?: number;
}
```

## Example: Complete Flowchart

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "User Registration Flow",
    "description": "User registration with email verification",
    "author": "AIGraphia",
    "created": "2026-03-09T00:00:00Z"
  },
  "graph": {
    "nodes": [
      {
        "id": "start",
        "type": "start",
        "label": "Start",
        "data": {}
      },
      {
        "id": "form",
        "type": "input",
        "label": "Registration Form",
        "data": {
          "description": "User fills out registration form"
        }
      },
      {
        "id": "validate",
        "type": "process",
        "label": "Validate Input",
        "data": {}
      },
      {
        "id": "check",
        "type": "decision",
        "label": "Valid?",
        "data": {}
      },
      {
        "id": "create",
        "type": "process",
        "label": "Create Account",
        "data": {}
      },
      {
        "id": "email",
        "type": "process",
        "label": "Send Verification Email",
        "data": {}
      },
      {
        "id": "error",
        "type": "process",
        "label": "Show Errors",
        "data": {}
      },
      {
        "id": "end",
        "type": "start",
        "label": "End",
        "data": {}
      }
    ],
    "edges": [
      {
        "id": "e1",
        "type": "flow",
        "source": "start",
        "target": "form",
        "data": {}
      },
      {
        "id": "e2",
        "type": "flow",
        "source": "form",
        "target": "validate",
        "data": {}
      },
      {
        "id": "e3",
        "type": "flow",
        "source": "validate",
        "target": "check",
        "data": {}
      },
      {
        "id": "e4",
        "type": "conditional",
        "source": "check",
        "target": "create",
        "label": "Yes",
        "data": {}
      },
      {
        "id": "e5",
        "type": "conditional",
        "source": "check",
        "target": "error",
        "label": "No",
        "data": {}
      },
      {
        "id": "e6",
        "type": "flow",
        "source": "create",
        "target": "email",
        "data": {}
      },
      {
        "id": "e7",
        "type": "flow",
        "source": "email",
        "target": "end",
        "data": {}
      },
      {
        "id": "e8",
        "type": "flow",
        "source": "error",
        "target": "form",
        "data": {}
      }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB",
    "spacing": {
      "node": 50,
      "rank": 100
    }
  }
}
```

## Validation

All diagrams are validated using Zod schemas:

```typescript
import { validateFull } from '@aigraphia/protocol';

const result = validateFull(diagramData);

if (result.valid) {
  console.log('Valid diagram');
} else {
  console.error('Errors:', result.errors);
}
```

## Best Practices

1. **Use descriptive IDs**: `userLogin` instead of `n1`
2. **Omit positions**: Let auto-layout handle positioning
3. **Include metadata**: Title, description, author
4. **Use semantic types**: Choose appropriate node/edge types
5. **Validate early**: Check structure before rendering
6. **Keep it simple**: Start minimal, add details as needed

## File Format

AIGraphia files use `.json` extension (AIGraph Format):
- Plain JSON text
- UTF-8 encoding
- Git-friendly (human-readable)
- Can be edited in any text editor

## Further Reading

- [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)
- [Layout Engine Guide](./LAYOUT_ENGINE_GUIDE.md)
- [AI Skills Guide](../packages/skills/README.md)
- [Converter Guide](../packages/converters/README.md)
