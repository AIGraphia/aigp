/**
 * DOT (Graphviz) importer and exporter for AIGP diagrams
 * DOT is the graph description language used by Graphviz
 */

import type { AIGraphDocument, Node, Edge } from '@aigraphia/protocol';

export interface DOTImportResult {
  success: boolean;
  document?: AIGraphDocument;
  errors?: string[];
}

/**
 * Import DOT to AIGP format
 */
export function fromDOT(dot: string): DOTImportResult {
  try {
    const lines = dot.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));

    // Determine if graph is directed
    const isDirected = lines[0].match(/^\s*(digraph|strict digraph)/i) !== null;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, Node>();

    for (const line of lines) {
      // Skip graph declaration and closing brace
      if (line.match(/^(di)?graph\s+/i) || line === '}') {
        continue;
      }

      // Node declaration: nodeId [label="Label", ...]
      const nodeMatch = line.match(/^(\w+)\s*\[([^\]]+)\]/);
      if (nodeMatch) {
        const [, id, attrs] = nodeMatch;

        const labelMatch = attrs.match(/label="([^"]+)"/);
        const shapeMatch = attrs.match(/shape=(\w+)/);
        const label = labelMatch ? labelMatch[1] : id;

        const node: Node = {
          id,
          type: mapDOTShapeToType(shapeMatch?.[1]),
          label,
          data: {}
        };

        nodes.push(node);
        nodeMap.set(id, node);
        continue;
      }

      // Edge declaration: nodeA -> nodeB or nodeA -- nodeB
      const edgeMatch = line.match(/^(\w+)\s*(->|--)\s*(\w+)(?:\s*\[([^\]]+)\])?/);
      if (edgeMatch) {
        const [, source, arrow, target, attrs] = edgeMatch;

        // Ensure nodes exist
        if (!nodeMap.has(source)) {
          const sourceNode: Node = { id: source, type: 'process', label: source, data: {} };
          nodes.push(sourceNode);
          nodeMap.set(source, sourceNode);
        }
        if (!nodeMap.has(target)) {
          const targetNode: Node = { id: target, type: 'process', label: target, data: {} };
          nodes.push(targetNode);
          nodeMap.set(target, targetNode);
        }

        const labelMatch = attrs?.match(/label="([^"]+)"/);
        const label = labelMatch ? labelMatch[1] : undefined;

        edges.push({
          id: `e${edges.length}`,
          source,
          target,
          type: 'flow',
          label,
          data: {}
        });
      }
    }

    const aigpDoc: AIGraphDocument = {
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: isDirected ? 'flowchart' : 'network',
      metadata: {
        title: 'Imported from DOT',
        description: 'Converted from Graphviz DOT format',
        author: 'DOT Importer',
        tags: ['dot', 'graphviz', 'imported']
      },
      graph: {
        nodes,
        edges
      },
      layout: {
        algorithm: 'hierarchical',
        direction: 'TB'
      }
    };

    return {
      success: true,
      document: aigpDoc
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}

function mapDOTShapeToType(shape?: string): string {
  const shapeMap: Record<string, string> = {
    'box': 'process',
    'ellipse': 'start',
    'circle': 'end',
    'diamond': 'decision',
    'parallelogram': 'io',
    'hexagon': 'preparation',
    'cylinder': 'database',
    'folder': 'document'
  };

  return shapeMap[shape || 'box'] || 'process';
}

/**
 * Export AIGP to DOT format
 */
export function toDOT(document: AIGraphDocument): string {
  const isDirected = document.type !== 'network';
  const graphType = isDirected ? 'digraph' : 'graph';
  const edgeOp = isDirected ? '->' : '--';

  let dot = `${graphType} ${sanitizeID(document.metadata.title)} {\n`;
  dot += `  label="${escapeQuotes(document.metadata.title)}";\n`;
  dot += `  labelloc="t";\n`;
  dot += `  fontsize=20;\n`;

  // Graph layout attributes based on AIGP layout
  const layout = document.layout?.algorithm || 'hierarchical';
  const direction = document.layout?.direction || 'TB';

  if (layout === 'hierarchical') {
    dot += `  rankdir="${direction}";\n`;
  }

  dot += '\n';

  // Export nodes
  for (const node of document.graph.nodes) {
    const shape = mapTypeToShape(node.type);
    dot += `  ${sanitizeID(node.id)} [label="${escapeQuotes(node.label)}", shape=${shape}];\n`;
  }

  dot += '\n';

  // Export edges
  for (const edge of document.graph.edges) {
    const attrs = edge.label ? ` [label="${escapeQuotes(edge.label)}"]` : '';
    dot += `  ${sanitizeID(edge.source)} ${edgeOp} ${sanitizeID(edge.target)}${attrs};\n`;
  }

  dot += '}\n';

  return dot;
}

function mapTypeToShape(type: string): string {
  const shapeMap: Record<string, string> = {
    'process': 'box',
    'start': 'ellipse',
    'end': 'ellipse',
    'decision': 'diamond',
    'io': 'parallelogram',
    'preparation': 'hexagon',
    'database': 'cylinder',
    'document': 'folder',
    'actor': 'none',
    'class': 'record',
    'entity': 'box'
  };

  return shapeMap[type] || 'box';
}

function sanitizeID(id: string): string {
  // Replace spaces and special chars with underscores
  return id.replace(/[^\w]/g, '_');
}

function escapeQuotes(text: string): string {
  return text.replace(/"/g, '\\"');
}

/**
 * Generate DOT with advanced Graphviz attributes
 */
export function toDOTAdvanced(
  document: AIGraphDocument,
  options: {
    rankdir?: 'TB' | 'LR' | 'BT' | 'RL';
    splines?: 'line' | 'ortho' | 'curved' | 'polyline';
    ranksep?: number;
    nodesep?: number;
    bgcolor?: string;
  } = {}
): string {
  const {
    rankdir = 'TB',
    splines = 'ortho',
    ranksep = 0.5,
    nodesep = 0.5,
    bgcolor = 'transparent'
  } = options;

  const isDirected = document.type !== 'network';
  const graphType = isDirected ? 'digraph' : 'graph';
  const edgeOp = isDirected ? '->' : '--';

  let dot = `${graphType} ${sanitizeID(document.metadata.title)} {\n`;

  // Global graph attributes
  dot += `  graph [
    label="${escapeQuotes(document.metadata.title)}",
    labelloc="t",
    fontsize=20,
    rankdir="${rankdir}",
    ranksep=${ranksep},
    nodesep=${nodesep},
    splines="${splines}",
    bgcolor="${bgcolor}"
  ];\n\n`;

  // Default node attributes
  dot += `  node [
    fontname="Arial",
    fontsize=12,
    style="filled",
    fillcolor="white"
  ];\n\n`;

  // Default edge attributes
  dot += `  edge [
    fontname="Arial",
    fontsize=10,
    color="gray50"
  ];\n\n`;

  // Export nodes with colors based on type
  for (const node of document.graph.nodes) {
    const shape = mapTypeToShape(node.type);
    const fillcolor = getNodeColor(node.type);

    dot += `  ${sanitizeID(node.id)} [`;
    dot += `label="${escapeQuotes(node.label)}", `;
    dot += `shape=${shape}, `;
    dot += `fillcolor="${fillcolor}"`;
    dot += `];\n`;
  }

  dot += '\n';

  // Export edges
  for (const edge of document.graph.edges) {
    const attrs: string[] = [];

    if (edge.label) {
      attrs.push(`label="${escapeQuotes(edge.label)}"`);
    }

    const edgeType = edge.type || 'flow';
    if (edgeType === 'dependency') {
      attrs.push('style="dashed"');
    } else if (edgeType === 'inheritance') {
      attrs.push('arrowhead="empty"');
    }

    const attrStr = attrs.length > 0 ? ` [${attrs.join(', ')}]` : '';
    dot += `  ${sanitizeID(edge.source)} ${edgeOp} ${sanitizeID(edge.target)}${attrStr};\n`;
  }

  dot += '}\n';

  return dot;
}

function getNodeColor(type: string): string {
  const colorMap: Record<string, string> = {
    'start': '#55efc4',
    'end': '#fab1a0',
    'decision': '#ffeaa7',
    'process': '#74b9ff',
    'io': '#a29bfe',
    'database': '#fd79a8',
    'actor': '#fdcb6e',
    'class': '#e17055',
    'entity': '#00b894'
  };

  return colorMap[type] || 'lightgray';
}
