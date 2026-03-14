/**
 * Sunburst diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const sunburstPlugin: DiagramPlugin = {
  type: 'sunburst',
  name: 'Sunburst Diagram',
  description: 'Radial hierarchical visualization with concentric rings',

  nodeTypes: {
    center: {
      name: 'center',
      label: 'Center Node',
      description: 'Central circle at the root',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#ffd54f',
        textColor: '#f57f17',
        borderWidth: 0,
      },
      requiredFields: ['value'],
    },
    ring1: {
      name: 'ring1',
      label: 'First Ring',
      description: 'First level children',
      defaultStyle: {
        shape: 'arc',
        backgroundColor: '#ffb74d',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ffffff',
      },
      requiredFields: ['value'],
    },
    ring2: {
      name: 'ring2',
      label: 'Second Ring',
      description: 'Second level children',
      defaultStyle: {
        shape: 'arc',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ffffff',
      },
      requiredFields: ['value'],
    },
    ring3: {
      name: 'ring3',
      label: 'Third Ring',
      description: 'Third level children',
      defaultStyle: {
        shape: 'arc',
        backgroundColor: '#fb8c00',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ffffff',
      },
      requiredFields: ['value'],
    },
    leaf: {
      name: 'leaf',
      label: 'Leaf Segment',
      description: 'Outermost segments',
      defaultStyle: {
        shape: 'arc',
        backgroundColor: '#f57c00',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ffffff',
      },
      requiredFields: ['value'],
    },
  },

  edgeTypes: {
    hierarchy: {
      name: 'hierarchy',
      label: 'Hierarchy',
      description: 'Parent-child relationship',
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
          message: 'Sunburst nodes must have positive numeric values',
        });
      }
    }

    // Check for exactly one center node
    const centers = diagram.graph.nodes.filter(n => n.type === 'center');
    if (centers.length !== 1) {
      errors.push({
        path: 'graph.nodes',
        message: 'Sunburst must have exactly one center node',
      });
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'radial',
    spacing: {
      node: 2,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 1,
      borderColor: '#ffffff',
      padding: 0,
    },
    defaultEdgeStyle: {
      strokeWidth: 0,
    },
  },

  aiPrompts: {
    systemPrompt: `Sunburst diagrams show hierarchical data as concentric rings radiating from a center.

Node Types:
- center: Central circle representing root (exactly one required, must have value)
- ring1: First ring of children around center (must have value)
- ring2: Second ring, children of ring1 (must have value)
- ring3: Third ring, children of ring2 (must have value)
- leaf: Outermost segments (must have value)

Edge Type:
- hierarchy: Parent-child relationship (shown by radial position, not lines)

Layout Rules:
- Center node at the origin
- Each level forms a ring at increasing radius
- Arc angle proportional to value
- Children occupy a subdivided arc of their parent
- Siblings are adjacent segments within same ring

Visual Properties:
- Arc angle = (value / parent_total_value) × parent_arc_angle
- Rings at fixed radii intervals
- Color can show categories or depth
- Hover/click can zoom into segments
- Breadcrumb trail shows current path

Value Requirements:
- ALL nodes MUST have positive numeric values
- Sibling values determine arc proportions
- Parent arc divided among children
- Root always spans 360 degrees

Common Use Cases:
- Disk space usage (nested directories)
- Budget breakdown (categories to subcategories)
- Website navigation structure
- Software package composition
- Biological taxonomy
- Organization hierarchy
- File system explorer
- Multi-level categorization

Best Practices:
- Limit depth to 3-4 levels for readability
- Use color to distinguish categories
- Lighter colors for outer rings
- Show percentages on segments
- Enable interactive drilling
- Provide breadcrumb navigation
- Maintain consistent ring width
- Use contrasting border colors
- Consider minimum arc angle for visibility
- Label significant segments clearly`,
    examples: [
      'Disk usage: Root → Documents (60°), Photos (150°), Videos (150°) → each subdivided',
      'Company budget: Total → Opex (200°), Capex (100°), R&D (60°) → departments → items',
      'Website: Home → Products (120°), Blog (90°), About (150°) → sub-pages',
    ],
  },
};
