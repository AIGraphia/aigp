/**
 * Layout selector - automatically choose layout engine
 */

import { AIGraphDocument, DiagramType } from '@aigp/protocol';
import { LayoutEngine } from './engine.js';
import { DagreLayoutEngine } from './engines/dagre.js';
import { ELKLayoutEngine } from './engines/elk.js';
import { D3ForceLayoutEngine } from './engines/d3-force.js';
import { TimelineLayoutEngine } from './engines/timeline.js';
import { RadialLayoutEngine } from './engines/radial.js';
import { GridLayoutEngine } from './engines/grid.js';
import { ManualLayoutEngine } from './engines/manual.js';

// Initialize all engines
const dagreEngine = new DagreLayoutEngine();
const elkEngine = new ELKLayoutEngine();
const d3ForceEngine = new D3ForceLayoutEngine();
const timelineEngine = new TimelineLayoutEngine();
const radialEngine = new RadialLayoutEngine();
const gridEngine = new GridLayoutEngine();
const manualEngine = new ManualLayoutEngine();

/**
 * Select appropriate layout engine for diagram
 */
export function selectLayoutEngine(diagram: AIGraphDocument): LayoutEngine {
  // If manual layout specified, use it
  if (diagram.layout.algorithm === 'manual') {
    return manualEngine;
  }

  // If explicit algorithm specified, use corresponding engine
  if (diagram.layout.algorithm) {
    return getEngineByAlgorithm(diagram.layout.algorithm);
  }

  // Auto-select based on diagram type
  switch (diagram.type) {
    case 'flowchart':
    case 'org-chart':
    case 'tree':
      return dagreEngine;

    case 'bpmn':
    case 'uml-class':
    case 'uml-component':
    case 'uml-state':
    case 'architecture':
      return elkEngine;

    case 'network':
    case 'concept-map':
    case 'graph':
      return d3ForceEngine;

    case 'sequence':
    case 'timeline':
    case 'customer-journey':
      return timelineEngine;

    case 'mind-map':
      return radialEngine;

    case 'kanban':
      return gridEngine;

    case 'er':
      return dagreEngine;

    default:
      return dagreEngine; // Safe fallback
  }
}

/**
 * Get engine by algorithm name
 */
export function getEngineByAlgorithm(algorithm: string): LayoutEngine {
  const engines: Record<string, LayoutEngine> = {
    hierarchical: dagreEngine,
    layered: elkEngine,
    'force-directed': d3ForceEngine,
    timeline: timelineEngine,
    radial: radialEngine,
    grid: gridEngine,
    manual: manualEngine,
  };

  return engines[algorithm] || dagreEngine;
}

/**
 * Apply layout to diagram
 */
export async function applyLayout(diagram: AIGraphDocument): Promise<AIGraphDocument> {
  const engine = selectLayoutEngine(diagram);
  const result = await engine.layout(diagram.graph, diagram.layout);

  // Update node positions
  const updatedNodes = diagram.graph.nodes.map((node) => {
    const position = result.nodes.get(node.id);
    return position ? { ...node, position } : node;
  });

  // Update edge waypoints
  const updatedEdges = diagram.graph.edges.map((edge) => {
    const waypoints = result.edges.get(edge.id);
    if (waypoints && waypoints.length > 0) {
      return {
        ...edge,
        data: {
          ...edge.data,
          waypoints,
        },
      };
    }
    return edge;
  });

  return {
    ...diagram,
    graph: {
      ...diagram.graph,
      nodes: updatedNodes,
      edges: updatedEdges,
    },
  };
}
