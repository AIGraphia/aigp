/**
 * Radial layout engine (for mind maps)
 */

import { hierarchy, tree } from 'd3-hierarchy';
import { Graph, Position, DiagramType } from '@aigp/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class RadialLayoutEngine implements LayoutEngine {
  name = 'Radial';
  algorithm = 'radial' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    if (graph.nodes.length === 0) {
      return { nodes, edges, bounds: { width: 0, height: 0 } };
    }

    // Find central node (for mind maps)
    const centralNode = graph.nodes.find((n) => n.type === 'central') || graph.nodes[0];

    // Build tree structure
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
    const edgeMap = new Map<string, string[]>();

    for (const edge of graph.edges) {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, []);
      }
      edgeMap.get(edge.source)!.push(edge.target);
    }

    // Build hierarchy
    const buildHierarchy = (nodeId: string, visited = new Set<string>()): any => {
      if (visited.has(nodeId)) return null;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      const children = edgeMap.get(nodeId) || [];

      return {
        id: nodeId,
        data: node,
        children: children
          .map((childId) => buildHierarchy(childId, visited))
          .filter(Boolean),
      };
    };

    const root = hierarchy(buildHierarchy(centralNode.id));

    // Create radial tree layout
    const radius = 500;
    const treeLayout = tree<any>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    treeLayout(root);

    // Convert to Cartesian coordinates
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    root.each((node: any) => {
      const angle = node.x;
      const r = node.y;

      const x = r * Math.cos(angle - Math.PI / 2);
      const y = r * Math.sin(angle - Math.PI / 2);

      nodes.set(node.data.id, { x, y });

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    // Normalize to start from (0, 0)
    const offsetX = -minX + 50;
    const offsetY = -minY + 50;

    for (const [id, pos] of nodes) {
      nodes.set(id, {
        x: pos.x + offsetX,
        y: pos.y + offsetY,
      });
    }

    const bounds = {
      width: maxX - minX + 100,
      height: maxY - minY + 100,
    };

    return { nodes, edges, bounds };
  }

  supports(type: DiagramType): boolean {
    return ['mind-map', 'tree'].includes(type);
  }
}
