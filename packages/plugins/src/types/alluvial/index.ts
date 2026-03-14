/**
 * Alluvial diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const alluvialPlugin: DiagramPlugin = {
  type: 'alluvial',
  name: 'Alluvial Diagram',
  description: 'Flow diagram showing changes in categorical composition over time or stages',

  nodeTypes: {
    category: {
      name: 'category',
      label: 'Category',
      description: 'Category at a particular stage or time point',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#66bb6a',
        textColor: '#ffffff',
        borderWidth: 0,
      },
      requiredFields: ['stage', 'value'],
    },
  },

  edgeTypes: {
    stream: {
      name: 'stream',
      label: 'Stream',
      description: 'Flow from one category to another',
      defaultStyle: {
        strokeColor: '#81c784',
        strokeWidth: 10,
        arrowEnd: 'none',
        opacity: 0.5,
        curved: true,
      },
      requiredFields: ['value'],
    },
  },

  groupTypes: {
    stage: {
      name: 'stage',
      label: 'Stage',
      description: 'Vertical grouping for a time point or stage',
      defaultStyle: {
        backgroundColor: 'transparent',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all categories have stage and value
    for (const node of diagram.graph.nodes) {
      if (!node.data.custom?.stage) {
        errors.push({
          path: `graph.nodes.${node.id}.data.stage`,
          message: 'Alluvial categories must specify a stage',
        });
      }
      if (typeof node.data.value !== 'number' || node.data.value <= 0) {
        errors.push({
          path: `graph.nodes.${node.id}.data.value`,
          message: 'Alluvial categories must have positive numeric values',
        });
      }
    }

    // Validate that all streams have values
    for (const edge of diagram.graph.edges) {
      if (typeof edge.data.custom?.value !== 'number' || edge.data.custom.value <= 0) {
        errors.push({
          path: `graph.edges.${edge.id}.data.value`,
          message: 'Alluvial streams must have positive numeric values',
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
      node: 20,
      rank: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 0,
      padding: 10,
    },
    defaultEdgeStyle: {
      strokeWidth: 10,
      opacity: 0.5,
    },
    defaultGroupStyle: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#cccccc',
      borderStyle: 'dashed',
    },
  },

  aiPrompts: {
    systemPrompt: `Alluvial diagrams show how categorical composition changes across stages or time.

Node Type:
- category: A category at a specific stage (must have stage and value)
  - stage: Which time point or stage (1, 2, 3, ...)
  - value: Size of this category at this stage
  - Categories with same name can appear at different stages

Edge Type:
- stream: Flow connecting same or different categories between adjacent stages
  - value: How much flows from source to target (REQUIRED)
  - Width proportional to flow value
  - Can split (one category → multiple) or merge (multiple → one)

Layout Structure:
- Stages arranged left to right (or top to bottom)
- Categories stacked vertically within each stage
- Streams connect categories between adjacent stages
- Stream width = flow value
- Colors consistent for same category across stages

Flow Conservation:
- Sum of outgoing streams = category value (or less if some drop off)
- Sum of incoming streams = category value (or less if some join in)
- Total flow can change between stages

Common Use Cases:
- Customer journey: Awareness → Consideration → Purchase → Loyalty
- Student pathways: Major changes across academic years
- Traffic sources: Source → Landing Page → Conversion
- Political voting: Party support across elections
- Population migration: Region to region over time
- Product usage: Feature adoption over user lifecycle
- Market evolution: Technology adoption across time periods
- Career progression: Role changes over years

Visual Properties:
- Stream width encodes flow magnitude
- Color continuity shows category persistence
- Splitting streams show diversification
- Merging streams show consolidation
- Height of category block = total value at stage

Best Practices:
- Arrange stages chronologically (left to right)
- Use consistent colors for categories across stages
- Label all stages clearly
- Show values on hover
- Align category blocks vertically for comparison
- Use gradients in streams for visual appeal
- Limit to 4-6 stages for clarity
- Group related categories by color
- Highlight major flows
- Consider logarithmic scale for wide value ranges`,
    examples: [
      'Customer journey: 1000 visitors → 300 signups → 100 purchases → 80 repeat customers',
      'Student majors: Year 1 (Undecided:500, Engineering:300) → Year 2 (CS:400, ME:200, Bio:200)',
      'Traffic: Organic:1000 → Homepage:600, Product:400 → Signup:200, Cart:150',
    ],
  },
};
