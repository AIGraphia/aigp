import { describe, it, expect } from 'vitest';
import { flowchartPlugin } from '../types/flowchart';

describe('Flowchart Plugin', () => {
  it('should have correct metadata', () => {
    expect(flowchartPlugin.type).toBe('flowchart');
    expect(flowchartPlugin.name).toBe('Flowchart');
    expect(flowchartPlugin.description).toBeTruthy();
  });

  describe('Node Types', () => {
    it('should define start node type', () => {
      expect(flowchartPlugin.nodeTypes.start).toBeDefined();
      expect(flowchartPlugin.nodeTypes.start.name).toBe('start');
      expect(flowchartPlugin.nodeTypes.start.defaultStyle).toBeDefined();
      expect(flowchartPlugin.nodeTypes.start.defaultStyle.shape).toBe('ellipse');
    });

    it('should define process node type', () => {
      expect(flowchartPlugin.nodeTypes.process).toBeDefined();
      expect(flowchartPlugin.nodeTypes.process.name).toBe('process');
      expect(flowchartPlugin.nodeTypes.process.defaultStyle.shape).toBe('rectangle');
    });

    it('should define decision node type', () => {
      expect(flowchartPlugin.nodeTypes.decision).toBeDefined();
      expect(flowchartPlugin.nodeTypes.decision.name).toBe('decision');
      expect(flowchartPlugin.nodeTypes.decision.defaultStyle.shape).toBe('diamond');
    });

    it('should define input node type', () => {
      expect(flowchartPlugin.nodeTypes.input).toBeDefined();
      expect(flowchartPlugin.nodeTypes.input.name).toBe('input');
      expect(flowchartPlugin.nodeTypes.input.defaultStyle.shape).toBe('parallelogram');
    });

    it('should define subprocess node type', () => {
      expect(flowchartPlugin.nodeTypes.subprocess).toBeDefined();
      expect(flowchartPlugin.nodeTypes.subprocess.name).toBe('subprocess');
      expect(flowchartPlugin.nodeTypes.subprocess.defaultStyle.shape).toBe('rectangle');
    });

    it('should have at least 5 node types', () => {
      const nodeTypeCount = Object.keys(flowchartPlugin.nodeTypes).length;
      expect(nodeTypeCount).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Edge Types', () => {
    it('should define flow edge type', () => {
      expect(flowchartPlugin.edgeTypes.flow).toBeDefined();
      expect(flowchartPlugin.edgeTypes.flow.name).toBe('flow');
      expect(flowchartPlugin.edgeTypes.flow.defaultStyle).toBeDefined();
      expect(flowchartPlugin.edgeTypes.flow.defaultStyle.arrowEnd).toBe('arrow');
    });

    it('should define conditional edge type', () => {
      expect(flowchartPlugin.edgeTypes.conditional).toBeDefined();
      expect(flowchartPlugin.edgeTypes.conditional.name).toBe('conditional');
    });
  });

  describe('Default Configuration', () => {
    it('should have default layout', () => {
      expect(flowchartPlugin.defaultLayout).toBeDefined();
      expect(flowchartPlugin.defaultLayout.algorithm).toBe('hierarchical');
      expect(flowchartPlugin.defaultLayout.direction).toBe('TB');
      expect(flowchartPlugin.defaultLayout.spacing).toBeDefined();
    });

    it('should have default styles', () => {
      expect(flowchartPlugin.defaultStyles).toBeDefined();
      expect(flowchartPlugin.defaultStyles.defaultNodeStyle).toBeDefined();
      expect(flowchartPlugin.defaultStyles.defaultEdgeStyle).toBeDefined();
    });
  });

  describe('Validator', () => {
    it('should validate valid flowchart diagram', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test Flow' },
        graph: {
          nodes: [
            {
              id: 'start',
              type: 'start',
              label: 'Start',
              data: {}
            },
            {
              id: 'end',
              type: 'start',
              label: 'End',
              data: {}
            }
          ],
          edges: [
            {
              id: 'e1',
              type: 'flow',
              source: 'start',
              target: 'end',
              data: {}
            }
          ]
        },
        layout: {
          algorithm: 'hierarchical' as const,
          direction: 'TB' as const
        }
      };

      const result = flowchartPlugin.validator(diagram);
      expect(result.valid).toBe(true);
      if (result.errors) {
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe('AI Prompts', () => {
    it('should have system prompt', () => {
      expect(flowchartPlugin.aiPrompts.systemPrompt).toBeDefined();
      expect(flowchartPlugin.aiPrompts.systemPrompt.length).toBeGreaterThan(50);
    });

    it('should have examples array', () => {
      expect(flowchartPlugin.aiPrompts.examples).toBeDefined();
      expect(Array.isArray(flowchartPlugin.aiPrompts.examples)).toBe(true);
    });

    it('system prompt should mention node types', () => {
      const prompt = flowchartPlugin.aiPrompts.systemPrompt;
      expect(prompt).toContain('start');
      expect(prompt).toContain('process');
      expect(prompt).toContain('decision');
    });
  });
});
