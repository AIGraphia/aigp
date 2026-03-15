/**
 * Core AIGraphia Protocol Schema
 * Universal JSON format for AI-native diagrams
 */

import { z } from 'zod';

// ============================================================================
// Diagram Types
// ============================================================================

export const DiagramTypeSchema = z.enum([
  // Software Engineering
  'sequence',
  'uml-class',
  'uml-component',
  'uml-state',
  'er',
  'flowchart',
  'architecture',
  // Business & Process
  'bpmn',
  'org-chart',
  'customer-journey',
  'value-stream',
  'kanban',
  // Financial & Data
  'sankey',
  'funnel',
  'timeline',
  'network',
  // Scientific & Analysis
  'mind-map',
  'concept-map',
  'decision-tree',
  // Hierarchical Visualizations
  'treemap',
  'circle-packing',
  'sunburst',
  // Relationship & Flow
  'chord',
  'alluvial',
  // Formal Models
  'petri-net',
  // General
  'graph',
  'tree',
  'custom',
]);

export type DiagramType = z.infer<typeof DiagramTypeSchema>;

// ============================================================================
// Metadata
// ============================================================================

export const DiagramMetadataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  created: z.string().datetime().optional(),
  modified: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  version: z.string().optional(),
});

export type DiagramMetadata = z.infer<typeof DiagramMetadataSchema>;

// ============================================================================
// Basic Structures
// ============================================================================

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
});

export type Position = z.infer<typeof PositionSchema>;

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type Size = z.infer<typeof SizeSchema>;

// ============================================================================
// Node Data
// ============================================================================

export const AttributeSchema = z.object({
  name: z.string(),
  type: z.string(),
  visibility: z.enum(['public', 'private', 'protected']).optional(),
});

export const MethodSchema = z.object({
  name: z.string(),
  parameters: z.array(z.string()).optional(),
  returnType: z.string().optional(),
  visibility: z.enum(['public', 'private', 'protected']).optional(),
});

export const NodeDataSchema = z.object({
  // General
  description: z.string().optional(),
  icon: z.string().optional(),

  // UML-specific
  attributes: z.array(AttributeSchema).optional(),
  methods: z.array(MethodSchema).optional(),
  visibility: z.enum(['public', 'private', 'protected']).optional(),

  // BPMN-specific
  taskType: z.enum(['user', 'service', 'script', 'manual']).optional(),
  eventType: z.enum(['start', 'intermediate', 'end']).optional(),
  gatewayType: z.enum(['exclusive', 'parallel', 'inclusive']).optional(),

  // Sequence diagram-specific
  lifeline: z.boolean().optional(),
  activationStart: z.number().optional(),
  activationEnd: z.number().optional(),

  // Timeline-specific
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.number().optional(),

  // Metric-specific
  value: z.number().optional(),
  unit: z.string().optional(),
  percentage: z.number().optional(),

  // Extensibility
  custom: z.record(z.any()).optional(),
});

export type NodeData = z.infer<typeof NodeDataSchema>;

// ============================================================================
// Node Style
// ============================================================================

export const NodeStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  textColor: z.string().optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.enum(['normal', 'bold']).optional(),
  shape: z.enum(['rectangle', 'ellipse', 'diamond', 'parallelogram', 'hexagon', 'cylinder', 'circle']).optional(),
  padding: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

export type NodeStyle = z.infer<typeof NodeStyleSchema>;

// ============================================================================
// Node
// ============================================================================

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  data: NodeDataSchema,
  style: NodeStyleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export type Node = z.infer<typeof NodeSchema>;

// ============================================================================
// Edge Data
// ============================================================================

export const EdgeDataSchema = z.object({
  // General
  direction: z.enum(['unidirectional', 'bidirectional']).optional(),
  weight: z.number().optional(),

  // UML-specific
  relationship: z.enum(['association', 'aggregation', 'composition', 'inheritance', 'dependency']).optional(),
  multiplicity: z.object({
    source: z.string(),
    target: z.string(),
  }).optional(),

  // Sequence-specific
  messageType: z.enum(['sync', 'async', 'return', 'create', 'destroy']).optional(),
  timestamp: z.number().optional(),

  // BPMN-specific
  flowType: z.enum(['sequence', 'message', 'association']).optional(),
  condition: z.string().optional(),

  // Decision tree-specific
  probability: z.number().optional(),

  // Sankey-specific
  quantity: z.number().optional(),
  percentage: z.number().optional(),

  // Routing
  waypoints: z.array(PositionSchema).optional(),

  // Extensibility
  custom: z.record(z.any()).optional(),
});

export type EdgeData = z.infer<typeof EdgeDataSchema>;

// ============================================================================
// Edge Style
// ============================================================================

export const EdgeStyleSchema = z.object({
  strokeColor: z.string().optional(),
  strokeWidth: z.number().optional(),
  strokeStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  arrowStart: z.enum(['none', 'arrow', 'diamond', 'circle']).optional(),
  arrowEnd: z.enum(['none', 'arrow', 'diamond', 'circle']).optional(),
  textColor: z.string().optional(),
  fontSize: z.number().optional(),
  curved: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

export type EdgeStyle = z.infer<typeof EdgeStyleSchema>;

// ============================================================================
// Edge
// ============================================================================

export const EdgeSchema = z.object({
  id: z.string(),
  type: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  data: EdgeDataSchema,
  style: EdgeStyleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export type Edge = z.infer<typeof EdgeSchema>;

// ============================================================================
// Group Data
// ============================================================================

export const GroupDataSchema = z.object({
  // Swim lane-specific
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  role: z.string().optional(),

  // Phase-specific
  order: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Cluster-specific
  clusterType: z.string().optional(),

  // Extensibility
  custom: z.record(z.any()).optional(),
});

export type GroupData = z.infer<typeof GroupDataSchema>;

// ============================================================================
// Group Style
// ============================================================================

export const GroupStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  textColor: z.string().optional(),
  fontSize: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

export type GroupStyle = z.infer<typeof GroupStyleSchema>;

// ============================================================================
// Group
// ============================================================================

export const GroupSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  nodeIds: z.array(z.string()),
  childGroupIds: z.array(z.string()).optional(),
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  data: GroupDataSchema,
  style: GroupStyleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export type Group = z.infer<typeof GroupSchema>;

// ============================================================================
// Graph
// ============================================================================

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  groups: z.array(GroupSchema).optional(),
});

export type Graph = z.infer<typeof GraphSchema>;

// ============================================================================
// Layout
// ============================================================================

export const LayoutAlgorithmSchema = z.enum([
  'hierarchical',
  'force-directed',
  'layered',
  'timeline',
  'radial',
  'grid',
  'manual',
  'circular',
  'treemap',
  'circle-packing',
]);

export type LayoutAlgorithm = z.infer<typeof LayoutAlgorithmSchema>;

export const LayoutConfigSchema = z.object({
  algorithm: LayoutAlgorithmSchema,
  direction: z.enum(['TB', 'BT', 'LR', 'RL', 'radial']).optional(),
  spacing: z.object({
    node: z.number().optional(),
    rank: z.number().optional(),
    edge: z.number().optional(),
  }).optional(),
  alignment: z.enum(['start', 'center', 'end']).optional(),
  custom: z.record(z.any()).optional(),
});

export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;

// ============================================================================
// Style Config
// ============================================================================

export const StyleConfigSchema = z.object({
  defaultNodeStyle: NodeStyleSchema.optional(),
  defaultEdgeStyle: EdgeStyleSchema.optional(),
  defaultGroupStyle: GroupStyleSchema.optional(),
  theme: z.string().optional(),
  customStyles: z.record(z.any()).optional(),
});

export type StyleConfig = z.infer<typeof StyleConfigSchema>;

// ============================================================================
// AIGraph Document (Root)
// ============================================================================

export const AIGraphDocumentSchema = z.object({
  schema: z.string().default('https://aigraphia.com/schema/v1'),
  version: z.string().default('1.0.0'),
  type: DiagramTypeSchema,
  metadata: DiagramMetadataSchema,
  graph: GraphSchema,
  layout: LayoutConfigSchema,
  styling: StyleConfigSchema.optional(),
});

export type AIGraphDocument = z.infer<typeof AIGraphDocumentSchema>;

// ============================================================================
// Exports
// ============================================================================

export {
  AIGraphDocumentSchema as default,
};
