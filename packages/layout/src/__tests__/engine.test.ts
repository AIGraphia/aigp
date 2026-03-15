import { describe, it, expect, beforeEach } from 'vitest';
import { LayoutEngineRegistry, LayoutEngine, LayoutConfig, LayoutResult } from '../engine';

describe('Layout Engine Registry', () => {
  let registry: LayoutEngineRegistry;

  beforeEach(() => {
    registry = new LayoutEngineRegistry();
  });

  describe('Engine Registration', () => {
    it('should register a layout engine', () => {
      const mockEngine: LayoutEngine = {
        name: 'Test Engine',
        algorithm: 'hierarchical',
        layout: async () => ({
          nodes: new Map(),
          edges: new Map(),
          bounds: { width: 100, height: 100 }
        }),
        supports: () => true
      };

      registry.register(mockEngine);
      const retrieved = registry.get('hierarchical');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Engine');
    });
  });

  describe('Engine Retrieval', () => {
    beforeEach(() => {
      const mockEngine: LayoutEngine = {
        name: 'Test Engine',
        algorithm: 'hierarchical',
        layout: async () => ({
          nodes: new Map(),
          edges: new Map(),
          bounds: { width: 100, height: 100 }
        }),
        supports: () => true
      };
      registry.register(mockEngine);
    });

    it('should retrieve registered engine', () => {
      const engine = registry.get('hierarchical');
      expect(engine).toBeDefined();
      expect(engine?.algorithm).toBe('hierarchical');
    });

    it('should return undefined for unregistered engine', () => {
      const engine = registry.get('force-directed');
      expect(engine).toBeUndefined();
    });

    it('should throw error with getOrThrow for unregistered engine', () => {
      expect(() => registry.getOrThrow('force-directed')).toThrow('No layout engine registered');
    });

    it('should list all registered engines', () => {
      const engines = registry.list();
      expect(engines).toHaveLength(1);
      expect(engines[0].algorithm).toBe('hierarchical');
    });
  });

  describe('Multiple Engines', () => {
    it('should handle multiple registered engines', () => {
      const engine1: LayoutEngine = {
        name: 'Hierarchical',
        algorithm: 'hierarchical',
        layout: async () => ({
          nodes: new Map(),
          edges: new Map(),
          bounds: { width: 100, height: 100 }
        }),
        supports: () => true
      };

      const engine2: LayoutEngine = {
        name: 'Force',
        algorithm: 'force-directed',
        layout: async () => ({
          nodes: new Map(),
          edges: new Map(),
          bounds: { width: 100, height: 100 }
        }),
        supports: () => true
      };

      registry.register(engine1);
      registry.register(engine2);

      expect(registry.list()).toHaveLength(2);
      expect(registry.get('hierarchical')?.name).toBe('Hierarchical');
      expect(registry.get('force-directed')?.name).toBe('Force');
    });
  });
});
