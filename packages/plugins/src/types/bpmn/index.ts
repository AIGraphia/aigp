/**
 * BPMN (Business Process Model and Notation) plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const bpmnPlugin: DiagramPlugin = {
  type: 'bpmn',
  name: 'BPMN',
  description: 'Business Process Model and Notation - Standard for business process modeling',

  nodeTypes: {
    // Events
    startEvent: {
      name: 'startEvent',
      label: 'Start Event',
      description: 'Triggers the start of a process',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    endEvent: {
      name: 'endEvent',
      label: 'End Event',
      description: 'Marks the end of a process',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#f44336',
        textColor: '#ffffff',
        borderWidth: 3,
      },
    },
    intermediateEvent: {
      name: 'intermediateEvent',
      label: 'Intermediate Event',
      description: 'Event that occurs during a process',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
        borderWidth: 2,
        borderStyle: 'dashed',
      },
    },

    // Activities
    task: {
      name: 'task',
      label: 'Task',
      description: 'Generic task or activity',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    userTask: {
      name: 'userTask',
      label: 'User Task',
      description: 'Task performed by a human user',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 2,
      },
      requiredFields: ['assignee'],
    },
    serviceTask: {
      name: 'serviceTask',
      label: 'Service Task',
      description: 'Automated task performed by a service',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#03a9f4',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    scriptTask: {
      name: 'scriptTask',
      label: 'Script Task',
      description: 'Task that executes a script',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#00bcd4',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    manualTask: {
      name: 'manualTask',
      label: 'Manual Task',
      description: 'Task performed manually without system support',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#009688',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    subprocess: {
      name: 'subprocess',
      label: 'Subprocess',
      description: 'Collapsed subprocess',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#3f51b5',
        textColor: '#ffffff',
        borderWidth: 3,
      },
    },

    // Gateways
    exclusiveGateway: {
      name: 'exclusiveGateway',
      label: 'Exclusive Gateway (XOR)',
      description: 'Only one path can be taken',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ffeb3b',
        textColor: '#000000',
        borderWidth: 2,
      },
    },
    parallelGateway: {
      name: 'parallelGateway',
      label: 'Parallel Gateway (AND)',
      description: 'All paths are taken in parallel',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ffc107',
        textColor: '#000000',
        borderWidth: 2,
      },
    },
    inclusiveGateway: {
      name: 'inclusiveGateway',
      label: 'Inclusive Gateway (OR)',
      description: 'One or more paths can be taken',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ff9800',
        textColor: '#000000',
        borderWidth: 2,
      },
    },
    eventBasedGateway: {
      name: 'eventBasedGateway',
      label: 'Event-Based Gateway',
      description: 'Path determined by events',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ff5722',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },

    // Data
    dataObject: {
      name: 'dataObject',
      label: 'Data Object',
      description: 'Information used in the process',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#e0e0e0',
        textColor: '#000000',
        borderWidth: 1,
        borderStyle: 'dashed',
      },
    },
  },

  edgeTypes: {
    sequenceFlow: {
      name: 'sequenceFlow',
      label: 'Sequence Flow',
      description: 'Normal flow between activities',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    conditionalFlow: {
      name: 'conditionalFlow',
      label: 'Conditional Flow',
      description: 'Flow with a condition',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
      requiredFields: ['condition'],
    },
    defaultFlow: {
      name: 'defaultFlow',
      label: 'Default Flow',
      description: 'Default path from a gateway',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
    messageFlow: {
      name: 'messageFlow',
      label: 'Message Flow',
      description: 'Message between participants',
      defaultStyle: {
        strokeColor: '#2196f3',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
    association: {
      name: 'association',
      label: 'Association',
      description: 'Associate data or artifacts',
      defaultStyle: {
        strokeColor: '#999999',
        strokeWidth: 1,
        arrowEnd: 'none',
        strokeStyle: 'dotted',
      },
    },
  },

  groupTypes: {
    pool: {
      name: 'pool',
      label: 'Pool',
      description: 'Represents a participant in the process',
      defaultStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#333333',
        borderWidth: 2,
      },
    },
    lane: {
      name: 'lane',
      label: 'Lane (Swimlane)',
      description: 'Sub-partition within a pool',
      defaultStyle: {
        backgroundColor: '#fafafa',
        borderColor: '#666666',
        borderWidth: 1,
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'layered',
    direction: 'LR',
    spacing: {
      node: 80,
      rank: 150,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      borderColor: '#333333',
      padding: 12,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      strokeColor: '#333333',
    },
    defaultGroupStyle: {
      backgroundColor: '#f5f5f5',
      borderWidth: 2,
      borderColor: '#333333',
    },
  },

  aiPrompts: {
    systemPrompt: `BPMN (Business Process Model and Notation) diagrams model business processes with standard notation.

Event Types:
- startEvent: Green circle - begins the process
- intermediateEvent: Orange circle with dashed border - occurs during process
- endEvent: Red circle with thick border - terminates the process

Activity Types:
- task: Generic activity
- userTask: Performed by human (requires assignee)
- serviceTask: Automated by system/service
- scriptTask: Executes a script
- manualTask: Manual work without system
- subprocess: Contains sub-process (can be expanded)

Gateway Types (Decision Points):
- exclusiveGateway: XOR - only one path (yellow diamond)
- parallelGateway: AND - all paths in parallel (orange diamond)
- inclusiveGateway: OR - one or more paths (amber diamond)
- eventBasedGateway: Waits for events (red diamond)

Flow Types:
- sequenceFlow: Normal flow between activities
- conditionalFlow: Flow with condition (requires condition expression)
- defaultFlow: Default path from gateway (dashed)
- messageFlow: Between different pools/participants (dashed blue)
- association: Links data objects (dotted)

Pools and Lanes:
- pool: Represents a participant/organization
- lane: Subdivision within a pool (e.g., department, role)

Best Practices:
- Start with a startEvent
- End with an endEvent
- Use gateways for decisions and parallel flows
- Group activities into pools/lanes by participant
- Label all flows clearly, especially conditional ones
- Keep processes readable (avoid crossing lines when possible)`,
    examples: [
      'Order fulfillment process with customer, warehouse, and shipping pools',
      'Loan approval with decision gateways and parallel credit checks',
      'Customer support ticket handling with escalation paths',
    ],
  },
};
