import { describe, it, expect } from 'vitest';
import { convertToMermaid } from '../export/mermaid';

describe('Mermaid Converter', () => {
  describe('Flowchart Conversion', () => {
    it('should convert simple flowchart to mermaid', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'start', type: 'start', label: 'Start', data: {} },
            { id: 'end', type: 'start', label: 'End', data: {} }
          ],
          edges: [
            { id: 'e1', type: 'flow', source: 'start', target: 'end', data: {} }
          ]
        },
        layout: { algorithm: 'hierarchical' as const, direction: 'TB' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('flowchart TB');
      expect(mermaid).toContain('start');
      expect(mermaid).toContain('Start');
      expect(mermaid).toContain('end');
      expect(mermaid).toContain('End');
      expect(mermaid).toContain('-->');
    });

    it('should handle edge labels in flowchart', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'n1', type: 'decision', label: 'Decision', data: {} },
            { id: 'n2', type: 'process', label: 'Process', data: {} }
          ],
          edges: [
            { id: 'e1', type: 'flow', source: 'n1', target: 'n2', label: 'Yes', data: {} }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('-- Yes -->');
    });

    it('should handle different layout directions', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'n1', type: 'process', label: 'Node', data: {} }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const, direction: 'LR' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('flowchart LR');
    });
  });

  describe('Sequence Diagram Conversion', () => {
    it('should convert sequence diagram to mermaid', () => {
      const diagram = {
        version: '1.0.0',
        type: 'sequence' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'user', type: 'actor', label: 'User', data: {} },
            { id: 'server', type: 'participant', label: 'Server', data: {} }
          ],
          edges: [
            {
              id: 'e1',
              type: 'message',
              source: 'user',
              target: 'server',
              label: 'Request',
              data: { messageType: 'sync' }
            }
          ]
        },
        layout: { algorithm: 'timeline' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('sequenceDiagram');
      expect(mermaid).toContain('actor user');
      expect(mermaid).toContain('participant server');
      expect(mermaid).toContain('user->>server: Request');
    });

    it('should handle different message types', () => {
      const diagram = {
        version: '1.0.0',
        type: 'sequence' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'a', type: 'participant', label: 'A', data: {} },
            { id: 'b', type: 'participant', label: 'B', data: {} }
          ],
          edges: [
            {
              id: 'e1',
              type: 'message',
              source: 'a',
              target: 'b',
              label: 'Async',
              data: { messageType: 'async' }
            },
            {
              id: 'e2',
              type: 'message',
              source: 'b',
              target: 'a',
              label: 'Return',
              data: { messageType: 'return', timestamp: 2 }
            }
          ]
        },
        layout: { algorithm: 'timeline' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('->>'); // async arrow
      expect(mermaid).toContain('-->'); // return arrow
    });
  });

  describe('ER Diagram Conversion', () => {
    it('should convert ER diagram to mermaid', () => {
      const diagram = {
        version: '1.0.0',
        type: 'er' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'user',
              type: 'entity',
              label: 'User',
              data: {
                attributes: [
                  { name: 'id', type: 'int' },
                  { name: 'name', type: 'string' }
                ]
              }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('erDiagram');
      expect(mermaid).toContain('user {');
      expect(mermaid).toContain('int id');
      expect(mermaid).toContain('string name');
    });
  });

  describe('Mind Map Conversion', () => {
    it('should convert mind map to mermaid', () => {
      const diagram = {
        version: '1.0.0',
        type: 'mind-map' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'root', type: 'central', label: 'Central Topic', data: {} },
            { id: 'branch1', type: 'branch', label: 'Branch 1', data: {} }
          ],
          edges: [
            { id: 'e1', type: 'branch', source: 'root', target: 'branch1', data: {} }
          ]
        },
        layout: { algorithm: 'radial' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('mindmap');
      expect(mermaid).toContain('Central Topic');
      expect(mermaid).toContain('Branch 1');
    });
  });

  describe('Org Chart Conversion', () => {
    it('should convert org chart to mermaid', () => {
      const diagram = {
        version: '1.0.0',
        type: 'org-chart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'ceo', type: 'person', label: 'CEO', data: {} },
            { id: 'cto', type: 'person', label: 'CTO', data: {} }
          ],
          edges: [
            { id: 'e1', type: 'reports', source: 'cto', target: 'ceo', data: {} }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('flowchart');
      expect(mermaid).toContain('ceo');
      expect(mermaid).toContain('CEO');
      expect(mermaid).toContain('cto');
      expect(mermaid).toContain('CTO');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty diagrams', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Empty' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      expect(mermaid).toContain('flowchart');
    });

    it('should escape special characters in labels', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'n1', type: 'process', label: 'Label "with" quotes', data: {} }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      // Should escape quotes
      expect(mermaid).toContain('\\"');
    });

    it('should handle unknown diagram types with generic fallback', () => {
      const diagram = {
        version: '1.0.0',
        type: 'custom' as const,
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            { id: 'n1', type: 'node', label: 'Node', data: {} }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const mermaid = convertToMermaid(diagram);

      // Should use generic/fallback conversion
      expect(mermaid).toBeTruthy();
    });
  });
});
