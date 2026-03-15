/**
 * Mermaid exporter - CRITICAL for inline rendering
 */

import { AIGraphDocument } from '@aigraphia/protocol';

export function convertToMermaid(diagram: AIGraphDocument): string {
  switch (diagram.type) {
    case 'flowchart':
      return convertFlowchartToMermaid(diagram);
    case 'sequence':
      return convertSequenceToMermaid(diagram);
    case 'architecture':
      return convertArchitectureToMermaid(diagram);
    case 'er':
      return convertERToMermaid(diagram);
    case 'org-chart':
      return convertOrgChartToMermaid(diagram);
    case 'mind-map':
      return convertMindMapToMermaid(diagram);
    default:
      return convertGenericToMermaid(diagram);
  }
}

function convertFlowchartToMermaid(diagram: AIGraphDocument): string {
  const dir = diagram.layout.direction || 'TB';
  let mermaid = `flowchart ${dir}\n`;

  // Nodes
  for (const node of diagram.graph.nodes) {
    const shape = getNodeShape(node.type);
    const label = node.label.replace(/"/g, '\\"');
    mermaid += `    ${node.id}${shape.open}"${label}"${shape.close}\n`;
  }

  // Edges
  for (const edge of diagram.graph.edges) {
    const arrow = edge.label ? `-- ${edge.label} -->` : '-->';
    mermaid += `    ${edge.source} ${arrow} ${edge.target}\n`;
  }

  // Groups (subgraphs)
  if (diagram.graph.groups) {
    for (const group of diagram.graph.groups) {
      mermaid += `    subgraph ${group.label}\n`;
      for (const nodeId of group.nodeIds) {
        mermaid += `        ${nodeId}\n`;
      }
      mermaid += `    end\n`;
    }
  }

  return mermaid;
}

function convertSequenceToMermaid(diagram: AIGraphDocument): string {
  let mermaid = 'sequenceDiagram\n';

  // Participants
  for (const node of diagram.graph.nodes) {
    const participant = node.type === 'actor' ? 'actor' : 'participant';
    mermaid += `    ${participant} ${node.id} as ${node.label}\n`;
  }

  // Sort edges by timestamp
  const sortedEdges = [...diagram.graph.edges].sort((a, b) => {
    const aTime = a.data.timestamp || 0;
    const bTime = b.data.timestamp || 0;
    return aTime - bTime;
  });

  // Messages
  for (const edge of sortedEdges) {
    let arrow = '->>'; // sync
    if (edge.data.messageType === 'async') arrow = '->>';
    if (edge.data.messageType === 'return') arrow = '-->';

    const label = edge.label || '';
    mermaid += `    ${edge.source}${arrow}${edge.target}: ${label}\n`;
  }

  return mermaid;
}

function convertArchitectureToMermaid(diagram: AIGraphDocument): string {
  return convertFlowchartToMermaid(diagram); // Use flowchart syntax
}

function convertERToMermaid(diagram: AIGraphDocument): string {
  let mermaid = 'erDiagram\n';

  // Entities
  for (const node of diagram.graph.nodes) {
    mermaid += `    ${node.id} {\n`;
    if (node.data.attributes) {
      for (const attr of node.data.attributes) {
        mermaid += `        ${attr.type} ${attr.name}\n`;
      }
    }
    mermaid += `    }\n`;
  }

  // Relationships
  for (const edge of diagram.graph.edges) {
    const rel = edge.data.relationship || 'association';
    const card = getERCardinality(rel);
    const label = edge.label ? ` : "${edge.label}"` : '';
    mermaid += `    ${edge.source} ${card} ${edge.target}${label}\n`;
  }

  return mermaid;
}

function convertOrgChartToMermaid(diagram: AIGraphDocument): string {
  return convertFlowchartToMermaid(diagram);
}

function convertMindMapToMermaid(diagram: AIGraphDocument): string {
  let mermaid = 'mindmap\n';

  // Find root
  const root = diagram.graph.nodes.find((n) => n.type === 'central');
  if (!root) return 'mindmap\n  root(Empty)\n';

  // Build tree
  const buildTree = (nodeId: string, indent: number): string => {
    const node = diagram.graph.nodes.find((n) => n.id === nodeId);
    if (!node) return '';

    let result = '  '.repeat(indent) + `${node.label}\n`;

    const children = diagram.graph.edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target);

    for (const childId of children) {
      result += buildTree(childId, indent + 1);
    }

    return result;
  };

  mermaid += buildTree(root.id, 1);
  return mermaid;
}

function convertGenericToMermaid(diagram: AIGraphDocument): string {
  return convertFlowchartToMermaid(diagram);
}

function getNodeShape(type: string): { open: string; close: string } {
  const shapes: Record<string, { open: string; close: string }> = {
    start: { open: '([', close: '])' },
    process: { open: '[', close: ']' },
    decision: { open: '{', close: '}' },
    input: { open: '[/', close: '/]' },
    subprocess: { open: '[[', close: ']]' },
    default: { open: '[', close: ']' },
  };
  return shapes[type] || shapes.default;
}

function getERCardinality(relationship: string): string {
  const cardMap: Record<string, string> = {
    association: '||--||',
    aggregation: 'o{--||',
    composition: '||--o{',
    inheritance: '||--|>',
  };
  return cardMap[relationship] || '||--||';
}
