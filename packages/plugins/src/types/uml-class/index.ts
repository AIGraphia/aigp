/**
 * UML Class Diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const umlClassPlugin: DiagramPlugin = {
  type: 'uml-class',
  name: 'UML Class Diagram',
  description: 'Object-oriented design, class hierarchies',

  nodeTypes: {
    class: {
      name: 'class',
      label: 'Class',
      description: 'Class definition',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
      },
      requiredFields: ['attributes', 'methods'],
    },
    interface: {
      name: 'interface',
      label: 'Interface',
      description: 'Interface definition',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
      },
    },
    abstract: {
      name: 'abstract',
      label: 'Abstract Class',
      description: 'Abstract class',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
      },
    },
  },

  edgeTypes: {
    inheritance: {
      name: 'inheritance',
      label: 'Inheritance',
      description: 'Class inheritance (is-a)',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    composition: {
      name: 'composition',
      label: 'Composition',
      description: 'Strong ownership (has-a)',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'diamond',
      },
    },
    aggregation: {
      name: 'aggregation',
      label: 'Aggregation',
      description: 'Weak ownership (has-a)',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
        arrowEnd: 'diamond',
      },
    },
  },

  groupTypes: {
    package: {
      name: 'package',
      label: 'Package',
      description: 'Package or namespace',
      defaultStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#999999',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'layered',
    direction: 'TB',
    spacing: {
      node: 80,
      rank: 100,
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
    systemPrompt: `UML class diagrams show object-oriented design.

Node types:
- class: Regular class with attributes and methods
- interface: Interface definition
- abstract: Abstract class

Use data.attributes: [{name: "id", type: "number", visibility: "private"}]
Use data.methods: [{name: "getId", returnType: "number", visibility: "public"}]

Edge types:
- inheritance: Class inheritance (arrow to parent)
- composition: Strong ownership (diamond on owner side)
- aggregation: Weak ownership (hollow diamond)`,
    examples: [],
  },
};
