/**
 * Kanban board plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const kanbanPlugin: DiagramPlugin = {
  type: 'kanban',
  name: 'Kanban Board',
  description: 'Visual task management boards with columns and cards',

  nodeTypes: {
    card: {
      name: 'card',
      label: 'Card',
      description: 'Task or work item card',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderWidth: 1,
        borderColor: '#cccccc',
      },
      requiredFields: ['title'],
    },
    epicCard: {
      name: 'epicCard',
      label: 'Epic Card',
      description: 'Large work item spanning multiple stories',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#f3e5f5',
        textColor: '#4a148c',
        borderWidth: 2,
        borderColor: '#9c27b0',
      },
    },
    blockedCard: {
      name: 'blockedCard',
      label: 'Blocked Card',
      description: 'Card that is blocked by dependencies',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#ffebee',
        textColor: '#c62828',
        borderWidth: 2,
        borderColor: '#f44336',
      },
    },
    expediteCard: {
      name: 'expediteCard',
      label: 'Expedite Card',
      description: 'High priority urgent card',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#fff3e0',
        textColor: '#e65100',
        borderWidth: 2,
        borderColor: '#ff9800',
      },
    },
  },

  edgeTypes: {
    dependency: {
      name: 'dependency',
      label: 'Dependency',
      description: 'One card depends on another',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
    blocks: {
      name: 'blocks',
      label: 'Blocks',
      description: 'This card blocks another card',
      defaultStyle: {
        strokeColor: '#f44336',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
  },

  groupTypes: {
    column: {
      name: 'column',
      label: 'Column',
      description: 'Vertical column representing a workflow stage',
      defaultStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#cccccc',
        borderWidth: 1,
      },
    },
    swimlane: {
      name: 'swimlane',
      label: 'Swimlane',
      description: 'Horizontal swimlane for team or priority grouping',
      defaultStyle: {
        backgroundColor: '#fafafa',
        borderColor: '#e0e0e0',
        borderWidth: 1,
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all cards have titles
    for (const node of diagram.graph.nodes) {
      if (!node.data.custom?.title) {
        errors.push({
          path: `graph.nodes.${node.id}.data.title`,
          message: 'Kanban cards must have a title',
        });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'manual',
    spacing: {
      node: 20,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 1,
      borderColor: '#cccccc',
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      strokeColor: '#666666',
    },
    defaultGroupStyle: {
      borderWidth: 1,
      borderColor: '#cccccc',
    },
  },

  aiPrompts: {
    systemPrompt: `Kanban boards are visual task management systems with columns representing workflow stages.

Node Types:
- card: Standard task card (requires title)
- epicCard: Large work item spanning multiple cards
- blockedCard: Card that cannot progress due to blockers
- expediteCard: High priority urgent card

Edge Types:
- dependency: One card depends on another (dashed)
- blocks: One card prevents progress on another (red)

Group Types:
- column: Vertical workflow stage (To Do, In Progress, Done, etc.)
- swimlane: Horizontal grouping (by team, priority, project)

Card Properties:
- title: Brief task description (REQUIRED)
- description: Detailed information
- assignee: Person responsible
- points: Story points or effort estimate
- priority: High, Medium, Low
- tags: Labels or categories
- dueDate: Deadline

Common Column Flows:
- Basic: To Do → In Progress → Done
- Extended: Backlog → To Do → In Progress → Review → Testing → Done
- Development: Ideas → Backlog → Analysis → Development → Testing → Deployment → Done

Best Practices:
- Limit WIP (Work In Progress) per column
- Keep card titles short and clear
- Use swimlanes for team or priority separation
- Show dependencies and blockers clearly
- Move cards left to right as they progress
- Use colors for card types (epic, blocked, expedite)
- Include acceptance criteria in card details
- Keep columns aligned with actual workflow`,
    examples: [
      'Software development: Backlog → To Do → In Progress → Code Review → Testing → Done',
      'Support tickets: New → Triaged → In Progress → Waiting on Customer → Resolved',
      'Content creation: Ideas → Planning → Writing → Editing → Published',
    ],
  },
};
