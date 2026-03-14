import { describe, it, expect } from 'vitest';
import { AIGraphDocumentSchema } from '../schema';

describe('Protocol Validation', () => {
  describe('Basic Diagram Structure', () => {
    it('should validate a minimal valid diagram', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should apply default version if not provided', () => {
      const diagram = {
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.version).toBe('1.0.0');
      }
    });

    it('should require type field', () => {
      const diagram = {
        version: '1.0.0',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('type'))).toBe(true);
      }
    });

    it('should require metadata field', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('metadata'))).toBe(true);
      }
    });

    it('should validate diagram with full metadata', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: {
          title: 'Test Diagram',
          description: 'A test diagram',
          author: 'Test Author'
        },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });
  });

  describe('Nodes Validation', () => {
    it('should validate nodes with required fields', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'process',
              label: 'Process Step',
              data: {}
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should require node id', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              type: 'process',
              label: 'Process Step',
              data: {}
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(false);
    });

    it('should validate nodes with position', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'process',
              label: 'Process Step',
              data: {},
              position: {
                x: 100,
                y: 200
              }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should validate nodes with size', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'process',
              label: 'Process Step',
              data: {},
              size: {
                width: 150,
                height: 80
              }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });
  });

  describe('Edges Validation', () => {
    it('should validate edges between nodes', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'start',
              label: 'Start',
              data: {}
            },
            {
              id: 'node2',
              type: 'process',
              label: 'Process',
              data: {}
            }
          ],
          edges: [
            {
              id: 'edge1',
              type: 'flow',
              source: 'node1',
              target: 'node2',
              data: {}
            }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should validate edges with labels', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'decision',
              label: 'Decision',
              data: {}
            },
            {
              id: 'node2',
              type: 'process',
              label: 'Process',
              data: {}
            }
          ],
          edges: [
            {
              id: 'edge1',
              type: 'flow',
              source: 'node1',
              target: 'node2',
              label: 'Yes',
              data: {}
            }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should require source field in edges', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'start',
              label: 'Start',
              data: {}
            }
          ],
          edges: [
            {
              id: 'edge1',
              type: 'flow',
              target: 'node1',
              data: {}
            }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(false);
    });

    it('should require target field in edges', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'start',
              label: 'Start',
              data: {}
            }
          ],
          edges: [
            {
              id: 'edge1',
              type: 'flow',
              source: 'node1',
              data: {}
            }
          ]
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(false);
    });
  });

  describe('Layout Configuration', () => {
    it('should validate layout with algorithm', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: {
          algorithm: 'hierarchical' as const
        }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should validate layout with direction', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: {
          algorithm: 'hierarchical' as const,
          direction: 'TB' as const
        }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should validate layout with spacing', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: {
          algorithm: 'hierarchical' as const,
          spacing: {
            node: 50,
            rank: 100
          }
        }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });
  });

  describe('Styling', () => {
    it('should validate diagram-level styling', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const },
        styling: {
          theme: 'light'
        }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });

    it('should validate node-level styling', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: { title: 'Test' },
        graph: {
          nodes: [
            {
              id: 'node1',
              type: 'process',
              label: 'Process',
              data: {},
              style: {
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                textColor: '#ffffff'
              }
            }
          ],
          edges: []
        },
        layout: { algorithm: 'hierarchical' as const }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
    });
  });

  describe('Complex Diagrams', () => {
    it('should validate a complete flowchart diagram', () => {
      const diagram = {
        version: '1.0.0',
        type: 'flowchart',
        metadata: {
          title: 'User Login Flow',
          description: 'Login process diagram',
          author: 'Test User',
          created: '2026-03-09T00:00:00Z'
        },
        graph: {
          nodes: [
            {
              id: 'start',
              type: 'start',
              label: 'Start',
              data: {}
            },
            {
              id: 'login',
              type: 'process',
              label: 'Enter Credentials',
              data: {}
            },
            {
              id: 'validate',
              type: 'decision',
              label: 'Valid?',
              data: {}
            },
            {
              id: 'success',
              type: 'end',
              label: 'Success',
              data: {}
            },
            {
              id: 'error',
              type: 'end',
              label: 'Error',
              data: {}
            }
          ],
          edges: [
            { id: 'e1', type: 'flow', source: 'start', target: 'login', data: {} },
            { id: 'e2', type: 'flow', source: 'login', target: 'validate', data: {} },
            { id: 'e3', type: 'flow', source: 'validate', target: 'success', label: 'Yes', data: {} },
            { id: 'e4', type: 'flow', source: 'validate', target: 'error', label: 'No', data: {} }
          ]
        },
        layout: {
          algorithm: 'hierarchical' as const,
          direction: 'TB' as const
        }
      };

      const result = AIGraphDocumentSchema.safeParse(diagram);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.graph.nodes).toHaveLength(5);
        expect(result.data.graph.edges).toHaveLength(4);
      }
    });
  });
});
