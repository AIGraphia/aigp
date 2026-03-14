import { describe, it, expect } from 'vitest';
import { selectLayoutEngine, getEngineByAlgorithm, applyLayout } from '../selector';

describe('Layout Selector', () => {
  describe('Engine Selection by Algorithm', () => {
    it('should select hierarchical engine', () => {
      const engine = getEngineByAlgorithm('hierarchical');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('hierarchical');
    });

    it('should select layered (ELK) engine', () => {
      const engine = getEngineByAlgorithm('layered');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('layered');
    });

    it('should select force-directed engine', () => {
      const engine = getEngineByAlgorithm('force-directed');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('force-directed');
    });

    it('should select timeline engine', () => {
      const engine = getEngineByAlgorithm('timeline');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('timeline');
    });

    it('should select radial engine', () => {
      const engine = getEngineByAlgorithm('radial');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('radial');
    });

    it('should select grid engine', () => {
      const engine = getEngineByAlgorithm('grid');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('grid');
    });

    it('should select manual engine', () => {
      const engine = getEngineByAlgorithm('manual');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('manual');
    });

    it('should fallback to hierarchical for unknown algorithm', () => {
      const engine = getEngineByAlgorithm('unknown');
      expect(engine).toBeDefined();
      expect(engine.algorithm).toBe('hierarchical');
    });
  });

  describe('Auto Selection by Diagram Type', () => {
    it('should select hierarchical for flowchart', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'hierarchical' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('hierarchical');
    });

    it('should select hierarchical for org-chart', () => {
      const diagram = {
        version: '1.0.0',
        type: 'org-chart' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'hierarchical' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('hierarchical');
    });

    it('should select layered for architecture', () => {
      const diagram = {
        version: '1.0.0',
        type: 'architecture' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'layered' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('layered');
    });

    it('should select force-directed for network', () => {
      const diagram = {
        version: '1.0.0',
        type: 'network' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'force-directed' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('force-directed');
    });

    it('should select timeline for sequence diagrams', () => {
      const diagram = {
        version: '1.0.0',
        type: 'sequence' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'timeline' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('timeline');
    });

    it('should select radial for mind-map', () => {
      const diagram = {
        version: '1.0.0',
        type: 'mind-map' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'radial' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('radial');
    });

    it('should select grid for kanban', () => {
      const diagram = {
        version: '1.0.0',
        type: 'kanban' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'grid' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('grid');
    });

    it('should select manual when specified', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: { nodes: [], edges: [] },
        layout: { algorithm: 'manual' as const }
      };

      const engine = selectLayoutEngine(diagram);
      expect(engine.algorithm).toBe('manual');
    });
  });

  describe('Apply Layout', () => {
    it('should apply layout to diagram with manual engine', async () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'n1',
              type: 'process',
              label: 'Node 1',
              data: {},
              position: { x: 0, y: 0 }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'manual' as const }
      };

      const result = await applyLayout(diagram);
      expect(result).toBeDefined();
      expect(result.graph.nodes).toHaveLength(1);
      expect(result.graph.nodes[0].position).toBeDefined();
    });

    it('should preserve existing positions with manual layout', async () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'n1',
              type: 'process',
              label: 'Node 1',
              data: {},
              position: { x: 100, y: 200 }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'manual' as const }
      };

      const result = await applyLayout(diagram);
      expect(result.graph.nodes[0].position?.x).toBe(100);
      expect(result.graph.nodes[0].position?.y).toBe(200);
    });
  });
});
