/**
 * ELK layout engine (advanced layered layout)
 */

import ELK from 'elkjs';
import { Graph, Position, DiagramType } from '@aigraphia/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class ELKLayoutEngine implements LayoutEngine {
  name = 'ELK';
  algorithm = 'layered' as const;
  private elk = new ELK();

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    // Convert to ELK format
    const elkGraph: any = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': this.mapDirection(config.direction || 'TB'),
        'elk.spacing.nodeNode': String(config.spacing?.node || 80),
        'elk.layered.spacing.nodeNodeBetweenLayers': String(config.spacing?.rank || 100),
      },
      children: graph.nodes.map((node) => ({
        id: node.id,
        width: node.size?.width || 150,
        height: node.size?.height || 60,
        labels: [{ text: node.label }],
      })),
      edges: graph.edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    // Compute layout
    const result = await this.elk.layout(elkGraph);

    // Extract positions
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    if (result.children) {
      for (const node of result.children) {
        nodes.set(node.id, {
          x: node.x || 0,
          y: node.y || 0,
        });
      }
    }

    if (result.edges) {
      for (const edge of result.edges) {
        if (edge.sections && edge.sections[0]) {
          const section = edge.sections[0];
          const waypoints: Position[] = [];

          if (section.startPoint) {
            waypoints.push({ x: section.startPoint.x, y: section.startPoint.y });
          }

          if (section.bendPoints) {
            waypoints.push(...section.bendPoints.map((p: any) => ({ x: p.x, y: p.y })));
          }

          if (section.endPoint) {
            waypoints.push({ x: section.endPoint.x, y: section.endPoint.y });
          }

          edges.set(edge.id, waypoints);
        }
      }
    }

    const bounds = {
      width: result.width || 0,
      height: result.height || 0,
    };

    return { nodes, edges, bounds };
  }

  private mapDirection(dir: string): string {
    const map: Record<string, string> = {
      TB: 'DOWN',
      BT: 'UP',
      LR: 'RIGHT',
      RL: 'LEFT',
    };
    return map[dir] || 'DOWN';
  }

  supports(type: DiagramType): boolean {
    return [
      'bpmn',
      'uml-component',
      'uml-state',
      'architecture',
      'network',
    ].includes(type);
  }
}
