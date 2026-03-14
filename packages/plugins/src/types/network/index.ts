/**
 * Network diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const networkPlugin: DiagramPlugin = {
  type: 'network',
  name: 'Network Diagram',
  description: 'Generic node-edge graphs, network analysis',

  nodeTypes: {
    node: {
      name: 'node',
      label: 'Node',
      description: 'Generic network node',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
    },
  },

  edgeTypes: {
    edge: {
      name: 'edge',
      label: 'Edge',
      description: 'Generic connection',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
      },
    },
  },

  groupTypes: {
    cluster: {
      name: 'cluster',
      label: 'Cluster',
      description: 'Node cluster or community',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'force-directed',
    spacing: {
      edge: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      padding: 8,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
    },
  },

  aiPrompts: {
    systemPrompt: `Network diagrams show generic node-edge graphs.

Node type: node (generic)
- Use data.value for node weight/importance
- Use data.custom for domain-specific properties

Edge type: edge (generic)
- Use data.weight for edge strength
- Use data.direction for 'unidirectional' or 'bidirectional'

Layout: Force-directed for natural clustering`,
    examples: [],
  },
};
