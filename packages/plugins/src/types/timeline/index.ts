/**
 * Timeline diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const timelinePlugin: DiagramPlugin = {
  type: 'timeline',
  name: 'Timeline',
  description: 'Project planning, history, roadmaps',

  nodeTypes: {
    event: {
      name: 'event',
      label: 'Event',
      description: 'Point in time event',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
      requiredFields: ['startDate'],
    },
    milestone: {
      name: 'milestone',
      label: 'Milestone',
      description: 'Important milestone',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
      },
      requiredFields: ['startDate'],
    },
    period: {
      name: 'period',
      label: 'Period',
      description: 'Time period or phase',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
      },
      requiredFields: ['startDate', 'endDate'],
    },
  },

  edgeTypes: {
    dependency: {
      name: 'dependency',
      label: 'Dependency',
      description: 'Event dependency',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
  },

  groupTypes: {
    phase: {
      name: 'phase',
      label: 'Phase',
      description: 'Project phase or era',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'timeline',
    direction: 'LR',
    spacing: {
      node: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      padding: 8,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
    },
  },

  aiPrompts: {
    systemPrompt: `Timeline diagrams show events chronologically.

Node types:
- event: Point in time (use data.startDate)
- milestone: Important milestone (use data.startDate)
- period: Time span (use data.startDate and data.endDate)

All nodes require data.startDate in ISO format: "2026-03-09T00:00:00Z"
Periods also need data.endDate

Layout: Horizontal (LR) by default, sorted by date`,
    examples: [],
  },
};
