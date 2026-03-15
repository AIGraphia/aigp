/**
 * Timeline layout engine (horizontal time-based layout)
 */

import { Graph, Position, DiagramType } from '@aigraphia/protocol';
import { LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

export class TimelineLayoutEngine implements LayoutEngine {
  name = 'Timeline';
  algorithm = 'timeline' as const;

  async layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult> {
    const nodes = new Map<string, Position>();
    const edges = new Map<string, Position[]>();

    const direction = config.direction || 'TB';
    const isHorizontal = direction === 'LR' || direction === 'RL';

    if (graph.nodes.length === 0) {
      return { nodes, edges, bounds: { width: 0, height: 0 } };
    }

    // For sequence diagrams: arrange lifelines horizontally
    const lifelineNodes = graph.nodes.filter((n) => n.data.lifeline);
    const eventNodes = graph.nodes.filter((n) => !n.data.lifeline);

    if (lifelineNodes.length > 0) {
      // Sequence diagram layout
      const spacing = config.spacing?.node || 150;
      const timeSpacing = config.spacing?.rank || 80;

      // Position lifelines horizontally
      lifelineNodes.forEach((node, i) => {
        nodes.set(node.id, {
          x: i * spacing,
          y: 0,
        });
      });

      // Sort edges by timestamp
      const sortedEdges = [...graph.edges].sort((a, b) => {
        const aTime = a.data.timestamp || 0;
        const bTime = b.data.timestamp || 0;
        return aTime - bTime;
      });

      // Position events vertically based on timestamp
      const timeMap = new Map<string, number>();
      sortedEdges.forEach((edge, i) => {
        const time = (i + 1) * timeSpacing;
        timeMap.set(edge.id, time);

        // Store edge waypoints
        const sourcePos = nodes.get(edge.source);
        const targetPos = nodes.get(edge.target);

        if (sourcePos && targetPos) {
          edges.set(edge.id, [
            { x: sourcePos.x, y: time },
            { x: targetPos.x, y: time },
          ]);
        }
      });

      const width = lifelineNodes.length * spacing;
      const height = sortedEdges.length * timeSpacing + 100;

      return { nodes, edges, bounds: { width, height } };
    } else {
      // Generic timeline layout (for timeline diagrams)
      const spacing = config.spacing?.node || 100;

      // Sort by date if available
      const sortedNodes = [...graph.nodes].sort((a, b) => {
        const aDate = a.data.startDate || '';
        const bDate = b.data.startDate || '';
        return aDate.localeCompare(bDate);
      });

      sortedNodes.forEach((node, i) => {
        if (isHorizontal) {
          nodes.set(node.id, {
            x: i * spacing,
            y: 0,
          });
        } else {
          nodes.set(node.id, {
            x: 0,
            y: i * spacing,
          });
        }
      });

      const width = isHorizontal ? sortedNodes.length * spacing : 200;
      const height = isHorizontal ? 200 : sortedNodes.length * spacing;

      return { nodes, edges, bounds: { width, height } };
    }
  }

  supports(type: DiagramType): boolean {
    return ['sequence', 'timeline', 'customer-journey'].includes(type);
  }
}
