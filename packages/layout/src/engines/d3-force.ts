/**
 * D3 Force layout engine (force-directed layout)
 */

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import { Graph, Position, DiagramType } from '@aigraphia/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

interface D3Node extends SimulationNodeDatum {
  id: string;
  size: number;
}

interface D3Link extends SimulationLinkDatum<D3Node> {
  id: string;
}

export class D3ForceLayoutEngine implements LayoutEngine {
  name = 'D3 Force';
  algorithm = 'force-directed' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    // Convert to D3 format
    const nodes: D3Node[] = graph.nodes.map((node) => ({
      id: node.id,
      size: Math.max(node.size?.width || 100, node.size?.height || 60) / 2,
    }));

    const links: D3Link[] = graph.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));

    // Create simulation
    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink<D3Node, D3Link>(links)
          .id((d) => d.id)
          .distance(config.spacing?.edge || 100)
      )
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(0, 0))
      .force(
        'collision',
        forceCollide<D3Node>().radius((d) => d.size + 10)
      );

    // Run simulation synchronously
    const iterations = 300;
    for (let i = 0; i < iterations; i++) {
      simulation.tick();
    }

    simulation.stop();

    // Extract positions
    const nodePositions = new Map<string, Position>();
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const node of nodes) {
      const x = node.x || 0;
      const y = node.y || 0;

      nodePositions.set(node.id, { x, y });

      minX = Math.min(minX, x - node.size);
      minY = Math.min(minY, y - node.size);
      maxX = Math.max(maxX, x + node.size);
      maxY = Math.max(maxY, y + node.size);
    }

    // Normalize positions to start from (0, 0)
    const offsetX = -minX;
    const offsetY = -minY;

    for (const [id, pos] of nodePositions) {
      nodePositions.set(id, {
        x: pos.x + offsetX,
        y: pos.y + offsetY,
      });
    }

    const bounds = {
      width: maxX - minX,
      height: maxY - minY,
    };

    return {
      nodes: nodePositions,
      edges: new Map(),
      bounds,
    };
  }

  supports(type: DiagramType): boolean {
    return ['network', 'concept-map', 'graph'].includes(type);
  }
}
