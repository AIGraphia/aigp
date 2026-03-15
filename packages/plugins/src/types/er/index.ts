/**
 * ER Diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const erPlugin: DiagramPlugin = {
  type: 'er',
  name: 'Entity-Relationship Diagram',
  description: 'Database schema, entity relationships',

  nodeTypes: {
    entity: {
      name: 'entity',
      label: 'Entity',
      description: 'Database entity/table',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
    },
  },

  edgeTypes: {
    relationship: {
      name: 'relationship',
      label: 'Relationship',
      description: 'Entity relationship',
      defaultStyle: {
        strokeColor: '#333333',
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
      node: 80,
      rank: 120,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      padding: 12,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
    },
  },

  aiPrompts: {
    systemPrompt: `ER diagrams show database entities and relationships.

Node type: entity (database tables)
- Use data.attributes for table columns: [{name: "id", type: "integer", visibility: "public"}]

Edge type: relationship
- Use data.relationship for type: association, aggregation, composition
- Use data.multiplicity for cardinality: {source: "1", target: "*"}

Example:
User entity has attributes: id, name, email
Order entity has attributes: id, user_id, total
Relationship: User (1) -> (*) Order`,
    examples: [],
  },
};
