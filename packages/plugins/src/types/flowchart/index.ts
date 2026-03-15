/**
 * Flowchart plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const flowchartPlugin: DiagramPlugin = {
  type: 'flowchart',
  name: 'Flowchart',
  description: 'Process flows, algorithms, decision trees',

  nodeTypes: {
    start: {
      name: 'start',
      label: 'Start/End',
      description: 'Start or end of process',
      defaultStyle: {
        shape: 'ellipse',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
      },
    },
    process: {
      name: 'process',
      label: 'Process',
      description: 'Process step or action',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
    },
    decision: {
      name: 'decision',
      label: 'Decision',
      description: 'Conditional branching',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
      },
    },
    input: {
      name: 'input',
      label: 'Input/Output',
      description: 'Data input or output',
      defaultStyle: {
        shape: 'parallelogram',
        backgroundColor: '#9c27b0',
        textColor: '#ffffff',
      },
    },
    subprocess: {
      name: 'subprocess',
      label: 'Subprocess',
      description: 'Predefined subprocess',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#00bcd4',
        textColor: '#ffffff',
        borderWidth: 3,
      },
    },
  },

  edgeTypes: {
    flow: {
      name: 'flow',
      label: 'Flow',
      description: 'Process flow connection',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    conditional: {
      name: 'conditional',
      label: 'Conditional',
      description: 'Conditional flow (from decision)',
      defaultStyle: {
        strokeColor: '#ff9800',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'hierarchical',
    direction: 'TB',
    spacing: {
      node: 50,
      rank: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      borderColor: '#333333',
      padding: 10,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      strokeColor: '#333333',
    },
  },

  aiPrompts: {
    systemPrompt: `Flowchart diagrams represent processes, algorithms, and decision flows.

Node types:
- start: Start or end points (ellipse shape)
- process: Process steps (rectangle)
- decision: Decision points with conditions (diamond)
- input: Input/output operations (parallelogram)
- subprocess: Predefined subprocess (double-border rectangle)

Edge types:
- flow: Standard process flow
- conditional: Conditional branches from decisions (label with condition)

Best practices:
- Start with a 'start' node
- End with a 'start' node (representing end)
- Label decision edges with conditions (Yes/No, True/False)
- Keep process steps clear and actionable
- Use subprocess for complex sub-processes`,
    examples: [],
  },
};
