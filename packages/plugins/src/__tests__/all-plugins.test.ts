import { describe, it, expect } from 'vitest';
import { registry } from '../index';

describe('Plugin Registry - All Plugins', () => {
  it('should have 20 plugins registered', () => {
    const plugins = registry.list();
    expect(plugins.length).toBe(20);
  });

  it('should have all original plugins', () => {
    expect(registry.has('flowchart')).toBe(true);
    expect(registry.has('sequence')).toBe(true);
    expect(registry.has('architecture')).toBe(true);
    expect(registry.has('org-chart')).toBe(true);
    expect(registry.has('mind-map')).toBe(true);
    expect(registry.has('er')).toBe(true);
    expect(registry.has('uml-class')).toBe(true);
    expect(registry.has('timeline')).toBe(true);
    expect(registry.has('network')).toBe(true);
  });

  it('should have all new plugins', () => {
    expect(registry.has('bpmn')).toBe(true);
    expect(registry.has('sankey')).toBe(true);
    expect(registry.has('funnel')).toBe(true);
    expect(registry.has('uml-state')).toBe(true);
    expect(registry.has('kanban')).toBe(true);
    expect(registry.has('treemap')).toBe(true);
    expect(registry.has('circle-packing')).toBe(true);
    expect(registry.has('sunburst')).toBe(true);
    expect(registry.has('chord')).toBe(true);
    expect(registry.has('alluvial')).toBe(true);
    expect(registry.has('petri-net')).toBe(true);
  });

  it('should retrieve BPMN plugin', () => {
    const plugin = registry.get('bpmn');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('BPMN');
    expect(plugin?.nodeTypes.startEvent).toBeDefined();
    expect(plugin?.nodeTypes.task).toBeDefined();
    expect(plugin?.nodeTypes.exclusiveGateway).toBeDefined();
  });

  it('should retrieve Sankey plugin', () => {
    const plugin = registry.get('sankey');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Sankey Diagram');
    expect(plugin?.nodeTypes.source).toBeDefined();
    expect(plugin?.edgeTypes.flow).toBeDefined();
  });

  it('should retrieve Funnel plugin', () => {
    const plugin = registry.get('funnel');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Funnel Diagram');
    expect(plugin?.nodeTypes.stage).toBeDefined();
  });

  it('should retrieve State Machine plugin', () => {
    const plugin = registry.get('uml-state');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('State Machine');
    expect(plugin?.nodeTypes.initialState).toBeDefined();
    expect(plugin?.nodeTypes.state).toBeDefined();
    expect(plugin?.nodeTypes.finalState).toBeDefined();
  });

  it('should retrieve Kanban plugin', () => {
    const plugin = registry.get('kanban');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Kanban Board');
    expect(plugin?.nodeTypes.card).toBeDefined();
    expect(plugin?.groupTypes.column).toBeDefined();
  });

  it('should retrieve Tree Map plugin', () => {
    const plugin = registry.get('treemap');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Tree Map');
    expect(plugin?.nodeTypes.root).toBeDefined();
    expect(plugin?.nodeTypes.leaf).toBeDefined();
  });

  it('should retrieve Circle Packing plugin', () => {
    const plugin = registry.get('circle-packing');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Circle Packing');
    expect(plugin?.nodeTypes.root).toBeDefined();
  });

  it('should retrieve Sunburst plugin', () => {
    const plugin = registry.get('sunburst');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Sunburst Diagram');
    expect(plugin?.nodeTypes.center).toBeDefined();
  });

  it('should retrieve Chord plugin', () => {
    const plugin = registry.get('chord');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Chord Diagram');
    expect(plugin?.nodeTypes.segment).toBeDefined();
    expect(plugin?.edgeTypes.flow).toBeDefined();
  });

  it('should retrieve Alluvial plugin', () => {
    const plugin = registry.get('alluvial');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Alluvial Diagram');
    expect(plugin?.nodeTypes.category).toBeDefined();
    expect(plugin?.edgeTypes.stream).toBeDefined();
  });

  it('should retrieve Petri Net plugin', () => {
    const plugin = registry.get('petri-net');
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe('Petri Net');
    expect(plugin?.nodeTypes.place).toBeDefined();
    expect(plugin?.nodeTypes.transition).toBeDefined();
    expect(plugin?.edgeTypes.arc).toBeDefined();
  });

  describe('Plugin Completeness', () => {
    const pluginTypes = [
      'bpmn',
      'sankey',
      'funnel',
      'uml-state',
      'kanban',
      'treemap',
      'circle-packing',
      'sunburst',
      'chord',
      'alluvial',
      'petri-net',
    ];

    pluginTypes.forEach(type => {
      it(`${type} plugin should have all required properties`, () => {
        const plugin = registry.getOrThrow(type as any);

        expect(plugin.type).toBeTruthy();
        expect(plugin.name).toBeTruthy();
        expect(plugin.description).toBeTruthy();
        expect(plugin.nodeTypes).toBeDefined();
        expect(plugin.edgeTypes).toBeDefined();
        expect(plugin.groupTypes).toBeDefined();
        expect(plugin.validator).toBeDefined();
        expect(plugin.defaultLayout).toBeDefined();
        expect(plugin.defaultStyles).toBeDefined();
        expect(plugin.aiPrompts).toBeDefined();
        expect(plugin.aiPrompts.systemPrompt).toBeTruthy();
        expect(Array.isArray(plugin.aiPrompts.examples)).toBe(true);
      });

      it(`${type} plugin should have at least one node type`, () => {
        const plugin = registry.getOrThrow(type as any);
        const nodeTypeCount = Object.keys(plugin.nodeTypes).length;
        expect(nodeTypeCount).toBeGreaterThan(0);
      });

      it(`${type} plugin should have at least one edge type`, () => {
        const plugin = registry.getOrThrow(type as any);
        const edgeTypeCount = Object.keys(plugin.edgeTypes).length;
        expect(edgeTypeCount).toBeGreaterThan(0);
      });
    });
  });
});
