import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry, DiagramPlugin } from '../base';

describe('Plugin Registry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe('Plugin Registration', () => {
    it('should register a plugin successfully', () => {
      const mockPlugin: DiagramPlugin = {
        type: 'flowchart',
        name: 'Test Plugin',
        description: 'Test description',
        nodeTypes: {},
        edgeTypes: {},
        groupTypes: {},
        validator: () => ({ valid: true, errors: [] }),
        defaultLayout: { algorithm: 'hierarchical' },
        defaultStyles: {},
        aiPrompts: {
          systemPrompt: 'Test',
          examples: []
        }
      };

      registry.register(mockPlugin);
      expect(registry.has('flowchart')).toBe(true);
    });

    it('should throw error when registering duplicate plugin', () => {
      const mockPlugin: DiagramPlugin = {
        type: 'flowchart',
        name: 'Test Plugin',
        description: 'Test description',
        nodeTypes: {},
        edgeTypes: {},
        groupTypes: {},
        validator: () => ({ valid: true, errors: [] }),
        defaultLayout: { algorithm: 'hierarchical' },
        defaultStyles: {},
        aiPrompts: {
          systemPrompt: 'Test',
          examples: []
        }
      };

      registry.register(mockPlugin);
      expect(() => registry.register(mockPlugin)).toThrow('already registered');
    });
  });

  describe('Plugin Retrieval', () => {
    beforeEach(() => {
      const mockPlugin: DiagramPlugin = {
        type: 'flowchart',
        name: 'Test Plugin',
        description: 'Test description',
        nodeTypes: {},
        edgeTypes: {},
        groupTypes: {},
        validator: () => ({ valid: true, errors: [] }),
        defaultLayout: { algorithm: 'hierarchical' },
        defaultStyles: {},
        aiPrompts: {
          systemPrompt: 'Test',
          examples: []
        }
      };
      registry.register(mockPlugin);
    });

    it('should retrieve registered plugin', () => {
      const plugin = registry.get('flowchart');
      expect(plugin).toBeDefined();
      expect(plugin?.name).toBe('Test Plugin');
    });

    it('should return undefined for unregistered plugin', () => {
      const plugin = registry.get('sequence');
      expect(plugin).toBeUndefined();
    });

    it('should throw error when getting unregistered plugin with getOrThrow', () => {
      expect(() => registry.getOrThrow('sequence')).toThrow('No plugin registered');
    });

    it('should check if plugin exists', () => {
      expect(registry.has('flowchart')).toBe(true);
      expect(registry.has('sequence')).toBe(false);
    });

    it('should list all registered plugins', () => {
      const plugins = registry.list();
      expect(plugins).toHaveLength(1);
      expect(plugins[0].type).toBe('flowchart');
    });
  });

  describe('Plugin Validation', () => {
    beforeEach(() => {
      const mockPlugin: DiagramPlugin = {
        type: 'flowchart',
        name: 'Test Plugin',
        description: 'Test description',
        nodeTypes: {},
        edgeTypes: {},
        groupTypes: {},
        validator: (diagram) => {
          if (diagram.graph.nodes.length === 0) {
            return {
              valid: false,
              errors: [{ path: 'graph.nodes', message: 'At least one node required' }]
            };
          }
          return { valid: true, errors: [] };
        },
        defaultLayout: { algorithm: 'hierarchical' },
        defaultStyles: {},
        aiPrompts: {
          systemPrompt: 'Test',
          examples: []
        }
      };
      registry.register(mockPlugin);
    });

    it('should validate diagram using plugin validator', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = registry.validate(diagram);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('At least one node');
    });

    it('should return error for unregistered diagram type', () => {
      const diagram = {
        version: '1.0.0',
        type: 'sequence' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = registry.validate(diagram);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('No plugin registered');
    });
  });

  describe('Default Configurations', () => {
    beforeEach(() => {
      const mockPlugin: DiagramPlugin = {
        type: 'flowchart',
        name: 'Test Plugin',
        description: 'Test description',
        nodeTypes: {},
        edgeTypes: {},
        groupTypes: {},
        validator: () => ({ valid: true, errors: [] }),
        defaultLayout: {
          algorithm: 'hierarchical',
          direction: 'TB',
          spacing: { node: 50 }
        },
        defaultStyles: {
          theme: 'light',
          defaultNodeStyle: { backgroundColor: '#fff' }
        },
        aiPrompts: {
          systemPrompt: 'Test',
          examples: []
        }
      };
      registry.register(mockPlugin);
    });

    it('should retrieve default layout for diagram type', () => {
      const layout = registry.getDefaultLayout('flowchart');
      expect(layout).toBeDefined();
      expect(layout?.algorithm).toBe('hierarchical');
      expect(layout?.direction).toBe('TB');
    });

    it('should retrieve default styles for diagram type', () => {
      const styles = registry.getDefaultStyles('flowchart');
      expect(styles).toBeDefined();
      expect(styles?.theme).toBe('light');
    });

    it('should return undefined for unregistered type', () => {
      const layout = registry.getDefaultLayout('sequence');
      expect(layout).toBeUndefined();

      const styles = registry.getDefaultStyles('sequence');
      expect(styles).toBeUndefined();
    });
  });
});
