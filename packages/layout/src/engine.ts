/**
 * Layout engine interface and types
 */

import { Graph, Position, LayoutAlgorithm, DiagramType } from '@aigp/protocol';

// ============================================================================
// Layout Engine Interface
// ============================================================================

export interface LayoutConfig {
  algorithm: LayoutAlgorithm;
  direction?: 'TB' | 'BT' | 'LR' | 'RL' | 'radial';
  spacing?: {
    node?: number;
    rank?: number;
    edge?: number;
  };
  alignment?: 'start' | 'center' | 'end';
  custom?: Record<string, any>;
}

export interface LayoutResult {
  nodes: Map<string, Position>;
  edges: Map<string, Position[]>;
  bounds: {
    width: number;
    height: number;
  };
}

export interface LayoutEngine {
  name: string;
  algorithm: LayoutAlgorithm;

  /**
   * Compute layout for graph
   */
  layout(graph: Graph, config: LayoutConfig): Promise<LayoutResult>;

  /**
   * Check if engine supports diagram type
   */
  supports(type: DiagramType): boolean;
}

// ============================================================================
// Layout Engine Registry
// ============================================================================

export class LayoutEngineRegistry {
  private engines = new Map<LayoutAlgorithm, LayoutEngine>();

  register(engine: LayoutEngine): void {
    this.engines.set(engine.algorithm, engine);
  }

  get(algorithm: LayoutAlgorithm): LayoutEngine | undefined {
    return this.engines.get(algorithm);
  }

  getOrThrow(algorithm: LayoutAlgorithm): LayoutEngine {
    const engine = this.engines.get(algorithm);
    if (!engine) {
      throw new Error(`No layout engine registered for algorithm: ${algorithm}`);
    }
    return engine;
  }

  list(): LayoutEngine[] {
    return Array.from(this.engines.values());
  }
}

// Global registry
export const registry = new LayoutEngineRegistry();
