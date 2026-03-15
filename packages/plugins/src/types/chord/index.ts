/**
 * Chord diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const chordPlugin: DiagramPlugin = {
  type: 'chord',
  name: 'Chord Diagram',
  description: 'Circular relationship diagram showing flows between entities',

  nodeTypes: {
    segment: {
      name: 'segment',
      label: 'Segment',
      description: 'Arc segment on the circle representing an entity',
      defaultStyle: {
        shape: 'arc',
        backgroundColor: '#42a5f5',
        textColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#1976d2',
      },
      requiredFields: ['label'],
    },
  },

  edgeTypes: {
    flow: {
      name: 'flow',
      label: 'Flow',
      description: 'Flow between segments shown as ribbon',
      defaultStyle: {
        strokeColor: '#90caf9',
        strokeWidth: 8,
        arrowEnd: 'none',
        opacity: 0.6,
        curved: true,
      },
      requiredFields: ['value'],
    },
    bidirectional: {
      name: 'bidirectional',
      label: 'Bidirectional Flow',
      description: 'Two-way flow between segments',
      defaultStyle: {
        strokeColor: '#ba68c8',
        strokeWidth: 8,
        arrowEnd: 'both',
        opacity: 0.6,
        curved: true,
      },
      requiredFields: ['value'],
    },
  },

  groupTypes: {},

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all segments have labels
    for (const node of diagram.graph.nodes) {
      if (!node.data.custom?.label) {
        errors.push({
          path: `graph.nodes.${node.id}.data.label`,
          message: 'Chord segments must have a label',
        });
      }
    }

    // Validate that all flows have positive values
    for (const edge of diagram.graph.edges) {
      if (typeof edge.data.custom?.value !== 'number' || edge.data.custom.value <= 0) {
        errors.push({
          path: `graph.edges.${edge.id}.data.value`,
          message: 'Chord flows must have positive numeric values',
        });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'circular',
    spacing: {
      node: 10,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      borderColor: '#1976d2',
      padding: 0,
    },
    defaultEdgeStyle: {
      strokeWidth: 8,
      opacity: 0.6,
    },
  },

  aiPrompts: {
    systemPrompt: `Chord diagrams show relationships and flows between entities arranged in a circle.

Node Type:
- segment: Arc on the circle perimeter representing an entity (must have label)
  - Position on circle determined by order
  - Size can represent total connections or entity magnitude

Edge Types:
- flow: One-directional flow (must have positive value)
  - Ribbon width proportional to flow magnitude
  - Curves from source to target inside circle
- bidirectional: Two-way flow (must have positive value)

Layout Structure:
- All segments arranged on circle perimeter
- Segments ordered logically (grouped by type)
- Ribbons connect segments through circle interior
- Ribbon width = flow value
- Ribbon color can encode source, target, or category

Value Encoding:
- Segment size: Sum of incoming + outgoing flows
- Ribbon width: Flow magnitude
- Ribbon color: Category, direction, or gradient
- Opacity: Can show confidence or importance

Common Use Cases:
- Migration patterns (countries to countries)
- Trade flows (imports/exports between nations)
- Communication patterns (who talks to whom)
- Money flows (departments to vendors)
- Website navigation (page to page transitions)
- Gene regulation networks
- Social network interactions
- Supply chain relationships

Best Practices:
- Group related segments together on circle
- Use color to distinguish categories
- Maintain readable segment spacing
- Show values on hover/interaction
- Consider asymmetric flows (A→B ≠ B→A)
- Use gradient ribbons (source color → target color)
- Limit to ~20 segments for readability
- Highlight largest flows
- Provide filtering options for complex diagrams
- Label segments clearly outside the circle`,
    examples: [
      'Migration: USA ↔ Mexico (5M), India → USA (2M), China → USA (1.5M)',
      'Trade: China → USA (500B), USA → China (150B), EU ↔ China (400B)',
      'Website: Home → Products (1000), Products → Cart (300), Cart → Checkout (100)',
    ],
  },
};
