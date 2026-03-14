/**
 * Sequence diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const sequencePlugin: DiagramPlugin = {
  type: 'sequence',
  name: 'Sequence Diagram',
  description: 'Temporal interactions, API calls, message flows',

  nodeTypes: {
    actor: {
      name: 'actor',
      label: 'Actor',
      description: 'Human actor or external system',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
      },
      requiredFields: ['lifeline'],
    },
    object: {
      name: 'object',
      label: 'Object/Component',
      description: 'System component or object',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
      },
      requiredFields: ['lifeline'],
    },
    database: {
      name: 'database',
      label: 'Database',
      description: 'Database system',
      defaultStyle: {
        shape: 'cylinder',
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
      },
      requiredFields: ['lifeline'],
    },
  },

  edgeTypes: {
    sync: {
      name: 'sync',
      label: 'Synchronous Call',
      description: 'Synchronous message (waits for response)',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
      requiredFields: ['messageType'],
    },
    async: {
      name: 'async',
      label: 'Asynchronous Call',
      description: 'Asynchronous message (no wait)',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
      requiredFields: ['messageType'],
    },
    return: {
      name: 'return',
      label: 'Return',
      description: 'Return value or response',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 1,
        strokeStyle: 'dashed',
        arrowEnd: 'arrow',
      },
      requiredFields: ['messageType'],
    },
  },

  groupTypes: {
    fragment: {
      name: 'fragment',
      label: 'Fragment',
      description: 'Interaction fragment (alt, opt, loop, etc.)',
      defaultStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#999999',
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);

    // Additional sequence diagram validation
    if (result.valid) {
      const lifelineNodes = diagram.graph.nodes.filter(n => n.data.lifeline);
      if (lifelineNodes.length === 0) {
        return {
          valid: false,
          errors: [{
            path: 'graph.nodes',
            message: 'Sequence diagram must have at least one lifeline node',
          }],
        };
      }
    }

    return result;
  },

  defaultLayout: {
    algorithm: 'timeline',
    direction: 'TB',
    spacing: {
      node: 150,
      rank: 80,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      padding: 10,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
    },
  },

  aiPrompts: {
    systemPrompt: `Sequence diagrams show temporal interactions between actors and systems.

Node types:
- actor: Human users or external systems (with lifeline)
- object: System components, services, or classes (with lifeline)
- database: Database systems (with lifeline)

All nodes must have data.lifeline = true.

Edge types:
- sync: Synchronous call (solid arrow, waits for response)
- async: Asynchronous message (dashed arrow, doesn't wait)
- return: Return value or response (dashed arrow, lighter color)

Best practices:
- Arrange lifelines left to right in order of interaction
- Use labels to describe method calls or messages
- Use return edges to show responses
- Group related interactions with fragments (alt, opt, loop)
- Order edges by timestamp (use data.timestamp)`,
    examples: [],
  },
};
