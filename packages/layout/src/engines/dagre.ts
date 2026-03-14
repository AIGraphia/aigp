/**
 * Dagre layout engine (hierarchical layout)
 */

import dagre from 'dagre';
import { Graph, Position, DiagramType } from '@aigp/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class DagreLayoutEngine implements LayoutEngine {
  name = 'Dagre';
  algorithm = 'hierarchical' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    const g = new dagre.graphlib.Graph();

    // Configure graph
    g.setGraph({
      rankdir: config.direction || 'TB',
      nodesep: config.spacing?.node || 50,
      ranksep: config.spacing?.rank || 100,
      edgesep: config.spacing?.edge || 10,
      align: config.alignment,
    });

    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    for (const node of graph.nodes) {
      const width = node.size?.width || 150;
      const height = node.size?.height || 60;
      g.setNode(node.id, { width, height, label: node.label });
    }

    // Add edges
    for (const edge of graph.edges) {
      g.setEdge(edge.source, edge.target);
    }

    // Compute layout
    dagre.layout(g);

    // Extract positions
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    g.nodes().forEach((nodeId) => {
      const node = g.node(nodeId);
      nodes.set(nodeId, {
        x: node.x,
        y: node.y,
      });
    });

    g.edges().forEach((edgeId) => {
      const edge = g.edge(edgeId);
      const id = `${edgeId.v}-${edgeId.w}`;
      if (edge.points) {
        edges.set(id, edge.points.map((p: any) => ({ x: p.x, y: p.y })));
      }
    });

    // Calculate bounds
    const graphInfo = g.graph();
    const bounds = {
      width: graphInfo.width || 0,
      height: graphInfo.height || 0,
    };

    return { nodes, edges, bounds };
  }

  supports(type: DiagramType): boolean {
    return [
      'flowchart',
      'org-chart',
      'tree',
      'uml-class',
      'er',
    ].includes(type);
  }
}
