/**
 * Circle packing diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const circlePackingPlugin: DiagramPlugin = {
  type: 'circle-packing',
  name: 'Circle Packing',
  description: 'Hierarchical data shown as nested circles sized by value',

  nodeTypes: {
    root: {
      name: 'root',
      label: 'Root Circle',
      description: 'Outermost container circle',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#e8eaf6',
        textColor: '#3f51b5',
        borderWidth: 2,
        borderColor: '#3f51b5',
      },
      requiredFields: ['value'],
    },
    parent: {
      name: 'parent',
      label: 'Parent Circle',
      description: 'Container for nested circles',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#c5cae9',
        textColor: '#283593',
        borderWidth: 1,
        borderColor: '#3f51b5',
      },
      requiredFields: ['value'],
    },
    leaf: {
      name: 'leaf',
      label: 'Leaf Circle',
      description: 'Innermost circle with no children',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#9fa8da',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#3f51b5',
      },
      requiredFields: ['value'],
    },
  },

  edgeTypes: {
    contains: {
      name: 'contains',
      label: 'Contains',
      description: 'Hierarchical containment',
      defaultStyle: {
        strokeColor: 'transparent',
        strokeWidth: 0,
        arrowEnd: 'none',
      },
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all nodes have positive values
    for (const node of diagram.graph.nodes) {
      if (typeof node.data.value !== 'number' || node.data.value <= 0) {
        errors.push({
          path: `graph.nodes.${node.id}.data.value`,
          message: 'Circle packing nodes must have positive numeric values',
        });
      }
    }

    // Check for exactly one root
    const roots = diagram.graph.nodes.filter(n => n.type === 'root');
    if (roots.length !== 1) {
      errors.push({
        path: 'graph.nodes',
        message: 'Circle packing must have exactly one root circle',
      });
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'circle-packing',
    spacing: {
      node: 5,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 1,
      borderColor: '#3f51b5',
      padding: 0,
    },
    defaultEdgeStyle: {
      strokeWidth: 0,
    },
  },

  aiPrompts: {
    systemPrompt: `Circle packing visualizes hierarchical data using nested circles where area represents value.

Node Types:
- root: Outermost container circle (exactly one required, must have value)
- parent: Container circles that hold other circles (must have value)
- leaf: Innermost circles with no children (must have value)

Edge Type:
- contains: Parent-child hierarchy (shown by nesting, not drawn lines)

Layout Rules:
- Circle area proportional to value
- Circles are tangent (touching) to maximize space
- Parent contains all its children
- No overlapping between siblings
- Tight packing for efficient use of space

Value Requirements:
- ALL nodes MUST have positive numeric values
- Parent value = sum of children values
- Area (not diameter) represents value
- Size formula: radius = sqrt(value / π)

Visual Properties:
- Color can encode additional dimensions
- Opacity can show depth level
- Labels positioned at circle centers
- Larger circles in hierarchy contain smaller ones
- Boundary circles show clear hierarchy

Common Use Cases:
- Software package dependencies and sizes
- Organization structure with employee counts
- Budget categories and allocations
- File system directory sizes
- Market share visualization
- Population demographics
- Species taxonomy with populations
- Product portfolio by revenue

Best Practices:
- Use contrasting colors for different branches
- Limit hierarchy depth (3-4 levels optimal)
- Ensure values are proportional
- Label significant circles clearly
- Use color gradients to show hierarchy depth
- Consider interactive zoom for deep hierarchies
- Show both absolute values and percentages
- Maintain good contrast for readability`,
    examples: [
      'Software packages: Core (1000 files) → Utils (400), UI (300), API (300)',
      'Company structure: HQ (500 people) → Engineering (200), Sales (150), Operations (150)',
      'Market share: Industry (100%) → Company A (40%), Company B (30%), Others (30%)',
    ],
  },
};
