/**
 * Grid layout engine (for Kanban boards)
 */

import { Graph, Position, DiagramType } from '@aigp/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class GridLayoutEngine implements LayoutEngine {
  name = 'Grid';
  algorithm = 'grid' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    if (graph.nodes.length === 0) {
      return { nodes, edges, bounds: { width: 0, height: 0 } };
    }

    const columnSpacing = config.spacing?.node || 200;
    const cardSpacing = config.spacing?.rank || 20;
    const cardHeight = 100;

    // Group nodes by group (columns)
    const columnMap = new Map<string, string[]>();

    if (graph.groups && graph.groups.length > 0) {
      // Use defined groups as columns
      for (const group of graph.groups) {
        columnMap.set(group.id, [...group.nodeIds]);
      }
    } else {
      // Single column
      columnMap.set('default', graph.nodes.map((n) => n.id));
    }

    // Position nodes in columns
    let columnIndex = 0;
    let maxHeight = 0;

    for (const [columnId, nodeIds] of columnMap) {
      const x = columnIndex * columnSpacing;
      let y = 100; // Start below column header

      for (const nodeId of nodeIds) {
        nodes.set(nodeId, { x, y });
        y += cardHeight + cardSpacing;
      }

      maxHeight = Math.max(maxHeight, y);
      columnIndex++;
    }

    const bounds = {
      width: columnIndex * columnSpacing,
      height: maxHeight,
    };

    return { nodes, edges, bounds };
  }

  supports(type: DiagramType): boolean {
    return ['kanban'].includes(type);
  }
}
