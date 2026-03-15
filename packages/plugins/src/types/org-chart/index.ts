/**
 * Org chart plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const orgChartPlugin: DiagramPlugin = {
  type: 'org-chart',
  name: 'Organization Chart',
  description: 'Organizational structure, reporting relationships',

  nodeTypes: {
    executive: {
      name: 'executive',
      label: 'Executive',
      description: 'C-level executive',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#1a237e',
        textColor: '#ffffff',
      },
    },
    manager: {
      name: 'manager',
      label: 'Manager',
      description: 'Department or team manager',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
    },
    employee: {
      name: 'employee',
      label: 'Employee',
      description: 'Individual contributor',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#64b5f6',
        textColor: '#ffffff',
      },
    },
    contractor: {
      name: 'contractor',
      label: 'Contractor',
      description: 'External contractor or consultant',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#90caf9',
        textColor: '#333333',
        borderStyle: 'dashed',
      },
    },
    vacant: {
      name: 'vacant',
      label: 'Vacant Position',
      description: 'Open or vacant position',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#eeeeee',
        textColor: '#666666',
        borderStyle: 'dashed',
      },
    },
  },

  edgeTypes: {
    reports: {
      name: 'reports',
      label: 'Reports To',
      description: 'Direct reporting relationship',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    dotted: {
      name: 'dotted',
      label: 'Dotted Line',
      description: 'Indirect or matrix reporting',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
        strokeStyle: 'dashed',
        arrowEnd: 'arrow',
      },
    },
  },

  groupTypes: {
    department: {
      name: 'department',
      label: 'Department',
      description: 'Organizational department',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
      },
    },
    team: {
      name: 'team',
      label: 'Team',
      description: 'Team or working group',
      defaultStyle: {
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
        borderWidth: 1,
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'hierarchical',
    direction: 'TB',
    spacing: {
      node: 60,
      rank: 80,
    },
    alignment: 'center',
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
    systemPrompt: `Organization charts show reporting structure and hierarchy.

Node types:
- executive: C-level executives (CEO, CTO, etc.)
- manager: Department or team managers
- employee: Individual contributors
- contractor: External contractors or consultants
- vacant: Open or vacant positions

Edge types:
- reports: Direct reporting relationship (solid line)
- dotted: Indirect or matrix reporting (dashed line)

Group types:
- department: Organizational departments
- team: Teams or working groups

Best practices:
- Place highest level (CEO) at top
- Arrange by reporting hierarchy (top-down)
- Group by department or function
- Use labels for names and titles
- Use data.description for additional info (email, location, etc.)`,
    examples: [],
  },
};
