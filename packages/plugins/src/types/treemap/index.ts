/**
 * Tree map diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const treemapPlugin: DiagramPlugin = {
  type: 'treemap',
  name: 'Tree Map',
  description: 'Hierarchical data visualization using nested rectangles sized by value',

  nodeTypes: {
    root: {
      name: 'root',
      label: 'Root Node',
      description: 'Top-level container',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#e3f2fd',
        textColor: '#1565c0',
        borderWidth: 2,
        borderColor: '#2196f3',
      },
      requiredFields: ['value'],
    },
    branch: {
      name: 'branch',
      label: 'Branch Node',
      description: 'Intermediate grouping node',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#bbdefb',
        textColor: '#0d47a1',
        borderWidth: 1,
        borderColor: '#2196f3',
      },
      requiredFields: ['value'],
    },
    leaf: {
      name: 'leaf',
      label: 'Leaf Node',
      description: 'Terminal node with actual data',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#90caf9',
        textColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#2196f3',
      },
      requiredFields: ['value'],
    },
  },

  edgeTypes: {
    contains: {
      name: 'contains',
      label: 'Contains',
      description: 'Hierarchical containment relationship',
      defaultStyle: {
        strokeColor: 'transparent',
        strokeWidth: 0,
        arrowEnd: 'none',
      },
    },
  },

  groupTypes: {
    category: {
      name: 'category',
      label: 'Category',
      description: 'Visual grouping for related items',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all nodes have positive values
    for (const node of diagram.graph.nodes) {
      if (typeof node.data.value !== 'number' || node.data.value <= 0) {
        errors.push({
          path: `graph.nodes.${node.id}.data.value`,
          message: 'Tree map nodes must have positive numeric values',
        });
      }
    }

    // Check for exactly one root node
    const roots = diagram.graph.nodes.filter(n => n.type === 'root');
    if (roots.length !== 1) {
      errors.push({
        path: 'graph.nodes',
        message: 'Tree map must have exactly one root node',
      });
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'treemap',
    spacing: {
      node: 4,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 1,
      borderColor: '#2196f3',
      padding: 8,
    },
    defaultEdgeStyle: {
      strokeWidth: 0,
    },
    defaultGroupStyle: {
      backgroundColor: '#e3f2fd',
      borderWidth: 2,
      borderColor: '#2196f3',
    },
  },

  aiPrompts: {
    systemPrompt: `Tree maps visualize hierarchical data using nested rectangles where size represents value.

Node Types:
- root: Top-level container (exactly one required, must have value)
- branch: Intermediate grouping nodes (must have value)
- leaf: Terminal nodes with actual data (must have value)

Edge Type:
- contains: Parent-child hierarchy (rendered as nesting, not lines)

Layout Rules:
- Rectangle size proportional to value
- Parent size = sum of children values
- Nested rectangles show hierarchy
- Larger values get more visual space
- Color intensity can show additional metric

Value Requirements:
- ALL nodes MUST have positive numeric values
- Parent value should equal sum of children
- Leaf values represent actual measurements
- Values determine rectangle sizes

Common Use Cases:
- Disk space usage (folders and files)
- Budget allocation (categories and items)
- Portfolio allocation (sectors, stocks, values)
- Website analytics (sections, pages, traffic)
- Market capitalization (industries and companies)
- Code base size (directories and file sizes)
- Organization hierarchy (departments, headcount)

Best Practices:
- Use color gradients to show additional dimensions
- Label nodes with both name and value
- Keep hierarchy depth reasonable (3-5 levels)
- Ensure parent value = sum of children
- Use contrasting colors for better readability
- Consider aspect ratio for readability
- Group similar items together
- Show percentages alongside absolute values`,
    examples: [
      'Disk usage: Documents (10GB) → Reports (3GB), Images (5GB), Videos (2GB)',
      'Portfolio: Stocks (60%) → Tech (40%), Finance (20%); Bonds (30%); Cash (10%)',
      'Budget: Operations (500k) → Salaries (300k), Infrastructure (150k), Tools (50k)',
    ],
  },
};
