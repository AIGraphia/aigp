/**
 * Sankey diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const sankeyPlugin: DiagramPlugin = {
  type: 'sankey',
  name: 'Sankey Diagram',
  description: 'Flow diagrams showing quantity flow between nodes',

  nodeTypes: {
    source: {
      name: 'source',
      label: 'Source Node',
      description: 'Starting point of flow',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
        borderWidth: 0,
      },
    },
    intermediate: {
      name: 'intermediate',
      label: 'Intermediate Node',
      description: 'Flow passes through',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 0,
      },
    },
    sink: {
      name: 'sink',
      label: 'Sink Node',
      description: 'End point of flow',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#f44336',
        textColor: '#ffffff',
        borderWidth: 0,
      },
    },
  },

  edgeTypes: {
    flow: {
      name: 'flow',
      label: 'Flow',
      description: 'Quantity flowing between nodes',
      defaultStyle: {
        strokeColor: '#90caf9',
        strokeWidth: 5,
        arrowEnd: 'arrow',
        opacity: 0.6,
      },
      requiredFields: ['quantity'],
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    // Validate that all edges have quantity
    const errors: any[] = [];
    for (const edge of diagram.graph.edges) {
      if (!edge.data.quantity || edge.data.quantity <= 0) {
        errors.push({
          path: `graph.edges.${edge.id}.data.quantity`,
          message: 'Sankey flows must have positive quantity values',
        });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'layered',
    direction: 'LR',
    spacing: {
      node: 100,
      rank: 200,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 0,
      padding: 15,
    },
    defaultEdgeStyle: {
      strokeWidth: 10,
      opacity: 0.6,
    },
  },

  aiPrompts: {
    systemPrompt: `Sankey diagrams visualize flows and their quantities between nodes.

Node Types:
- source: Starting points (green)
- intermediate: Pass-through nodes (blue)
- sink: End points (red)

Flow Properties:
- quantity: Numeric value representing flow amount (REQUIRED)
- percentage: Optional percentage of total flow
- Width of flow line represents quantity

Use Cases:
- Energy flows (production → consumption)
- Material flows (raw materials → products → waste)
- Budget allocation (revenue → departments → expenses)
- Website traffic (sources → pages → conversions)
- Supply chain flows

Best Practices:
- ALL edges MUST have quantity values
- Quantities should be positive numbers
- Flow width proportional to quantity
- Group related nodes vertically
- Left-to-right flow direction typical
- Conservation of flow (in = out for intermediate nodes)
- Use color coding to show different flow types`,
    examples: [
      'Energy flow from sources (solar, wind, coal) through grid to consumers',
      'Website traffic from channels (organic, paid, social) to pages to conversions',
      'Budget flow from revenue streams to departments to expense categories',
    ],
  },
};
