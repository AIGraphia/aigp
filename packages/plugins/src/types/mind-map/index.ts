/**
 * Mind map plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const mindMapPlugin: DiagramPlugin = {
  type: 'mind-map',
  name: 'Mind Map',
  description: 'Brainstorming, concept exploration, idea organization',

  nodeTypes: {
    central: {
      name: 'central',
      label: 'Central Topic',
      description: 'Main central idea',
      defaultStyle: {
        shape: 'ellipse',
        backgroundColor: '#ff6f00',
        textColor: '#ffffff',
        fontSize: 18,
      },
    },
    main: {
      name: 'main',
      label: 'Main Branch',
      description: 'Main category or theme',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#ffa726',
        textColor: '#ffffff',
        fontSize: 14,
      },
    },
    sub: {
      name: 'sub',
      label: 'Sub-topic',
      description: 'Sub-topic or detail',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#ffcc80',
        textColor: '#333333',
        fontSize: 12,
      },
    },
    detail: {
      name: 'detail',
      label: 'Detail',
      description: 'Detailed point or note',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#ffe0b2',
        textColor: '#333333',
        fontSize: 10,
      },
    },
  },

  edgeTypes: {
    branch: {
      name: 'branch',
      label: 'Branch',
      description: 'Mind map branch connection',
      defaultStyle: {
        strokeColor: '#ff6f00',
        strokeWidth: 3,
        curved: true,
      },
    },
    association: {
      name: 'association',
      label: 'Association',
      description: 'Cross-branch association',
      defaultStyle: {
        strokeColor: '#2196f3',
        strokeWidth: 2,
        strokeStyle: 'dashed',
        arrowEnd: 'arrow',
      },
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);

    // Check for central node
    if (result.valid) {
      const centralNodes = diagram.graph.nodes.filter(n => n.type === 'central');
      if (centralNodes.length === 0) {
        return {
          valid: false,
          errors: [{
            path: 'graph.nodes',
            message: 'Mind map must have at least one central node',
          }],
        };
      }
      if (centralNodes.length > 1) {
        return {
          valid: false,
          errors: [{
            path: 'graph.nodes',
            message: 'Mind map should have only one central node',
          }],
        };
      }
    }

    return result;
  },

  defaultLayout: {
    algorithm: 'radial',
    spacing: {
      node: 60,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      borderColor: '#333333',
      padding: 8,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      curved: true,
    },
  },

  aiPrompts: {
    systemPrompt: `Mind maps are radial diagrams for brainstorming and organizing ideas.

Node types:
- central: The main central topic (only one, at the center)
- main: Main branches (primary categories)
- sub: Sub-topics (secondary ideas)
- detail: Detailed points or notes

Edge types:
- branch: Hierarchical connections (curved, from center outward)
- association: Cross-branch connections (dashed lines)

Structure:
1. Start with ONE central node
2. Main branches radiate from center
3. Sub-topics branch from main topics
4. Details branch from sub-topics
5. Use associations to link related concepts across branches

Best practices:
- Keep node labels concise (2-5 words)
- Use colors to distinguish branches
- Radial layout spreads branches evenly
- Use icons in data.icon for visual cues`,
    examples: [],
  },
};
