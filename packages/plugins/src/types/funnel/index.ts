/**
 * Funnel diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const funnelPlugin: DiagramPlugin = {
  type: 'funnel',
  name: 'Funnel Diagram',
  description: 'Conversion funnels showing progressive reduction through stages',

  nodeTypes: {
    stage: {
      name: 'stage',
      label: 'Funnel Stage',
      description: 'A stage in the conversion funnel',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 2,
      },
      requiredFields: ['value'],
    },
  },

  edgeTypes: {
    conversion: {
      name: 'conversion',
      label: 'Conversion',
      description: 'Flow from one stage to next',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 3,
        arrowEnd: 'arrow',
      },
    },
    dropoff: {
      name: 'dropoff',
      label: 'Drop-off',
      description: 'Users leaving the funnel',
      defaultStyle: {
        strokeColor: '#f44336',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    // Validate that all nodes have values
    const errors: any[] = [];
    for (const node of diagram.graph.nodes) {
      if (!node.data.value || node.data.value < 0) {
        errors.push({
          path: `graph.nodes.${node.id}.data.value`,
          message: 'Funnel stages must have non-negative value',
        });
      }
    }

    // Validate that values decrease (or stay same) down the funnel
    const nodes = [...diagram.graph.nodes].sort((a, b) => {
      // Assuming nodes are ordered top to bottom
      return 0; // Would need position info for proper validation
    });

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
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
      borderColor: '#1976d2',
      padding: 20,
    },
    defaultEdgeStyle: {
      strokeWidth: 3,
      strokeColor: '#333333',
    },
  },

  aiPrompts: {
    systemPrompt: `Funnel diagrams visualize conversion processes where numbers decrease at each stage.

Node Type:
- stage: Each funnel stage with a value (count, amount, percentage)
  - REQUIRED: value (number of users/items at this stage)
  - OPTIONAL: percentage (conversion rate)
  - OPTIONAL: label (stage name)

Edge Types:
- conversion: Normal progression to next stage
- dropoff: Users/items leaving the funnel (dashed red)

Data Requirements:
- ALL stages MUST have numeric values
- Values typically decrease down the funnel
- Can include percentages (value / previous_stage_value * 100)

Common Use Cases:
- Sales funnel (leads → qualified → demo → proposal → closed)
- E-commerce (visits → product view → cart → checkout → purchase)
- User onboarding (signup → profile → first action → active user)
- Marketing (impressions → clicks → leads → customers)
- Content (page views → scroll → engagement → conversion)

Best Practices:
- Top to bottom flow
- Show both absolute numbers and percentages
- Highlight biggest drop-off points
- 4-7 stages typically optimal
- Label each stage clearly
- Calculate conversion rates between stages
- Center-align for classic funnel shape`,
    examples: [
      'E-commerce funnel: 10000 visits → 2000 products → 500 carts → 100 checkouts → 80 purchases',
      'Sales pipeline: 1000 leads → 300 qualified → 100 demos → 40 proposals → 15 closed deals',
      'User signup: 5000 landing → 1000 signup → 600 verify → 400 profile → 300 active users',
    ],
  },
};
