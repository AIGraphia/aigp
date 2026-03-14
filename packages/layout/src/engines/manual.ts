/**
 * Manual layout engine (preserves user positions)
 */

import { Graph, Position, DiagramType } from '@aigp/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class ManualLayoutEngine implements LayoutEngine {
  name = 'Manual';
  algorithm = 'manual' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    // Use existing positions
    for (const node of graph.nodes) {
      const pos = node.position || { x: 0, y: 0 };
      nodes.set(node.id, pos);

      const width = node.size?.width || 150;
      const height = node.size?.height || 60;

      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + width);
      maxY = Math.max(maxY, pos.y + height);
    }

    // Use edge waypoints if provided
    for (const edge of graph.edges) {
      if (edge.data.waypoints && edge.data.waypoints.length > 0) {
        edges.set(edge.id, edge.data.waypoints);
      }
    }

    const bounds = {
      width: maxX - minX || 800,
      height: maxY - minY || 600,
    };

    return { nodes, edges, bounds };
  }

  supports(type: DiagramType): boolean {
    return true; // Supports all types
  }
}
