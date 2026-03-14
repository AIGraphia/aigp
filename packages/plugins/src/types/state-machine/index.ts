/**
 * State Machine diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigp/protocol';

export const stateMachinePlugin: DiagramPlugin = {
  type: 'uml-state',
  name: 'State Machine',
  description: 'State machines and finite automata for modeling system behavior',

  nodeTypes: {
    initialState: {
      name: 'initialState',
      label: 'Initial State',
      description: 'Starting state of the system',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderWidth: 0,
      },
    },
    state: {
      name: 'state',
      label: 'State',
      description: 'A state the system can be in',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    compositeState: {
      name: 'compositeState',
      label: 'Composite State',
      description: 'State containing sub-states',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#3f51b5',
        textColor: '#ffffff',
        borderWidth: 3,
      },
    },
    finalState: {
      name: 'finalState',
      label: 'Final State',
      description: 'Terminal state',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderWidth: 3,
      },
    },
    choicePoint: {
      name: 'choicePoint',
      label: 'Choice Point',
      description: 'Conditional branching',
      defaultStyle: {
        shape: 'diamond',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
    historyState: {
      name: 'historyState',
      label: 'History State',
      description: 'Remembers last active sub-state',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#9c27b0',
        textColor: '#ffffff',
        borderWidth: 2,
      },
    },
  },

  edgeTypes: {
    transition: {
      name: 'transition',
      label: 'Transition',
      description: 'State transition triggered by event',
      defaultStyle: {
        strokeColor: '#333333',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
      requiredFields: ['event'],
    },
    selfTransition: {
      name: 'selfTransition',
      label: 'Self-Transition',
      description: 'Transition back to same state',
      defaultStyle: {
        strokeColor: '#666666',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        curved: true,
      },
    },
    internalTransition: {
      name: 'internalTransition',
      label: 'Internal Transition',
      description: 'Action within state without changing state',
      defaultStyle: {
        strokeColor: '#999999',
        strokeWidth: 1,
        arrowEnd: 'none',
        strokeStyle: 'dashed',
      },
    },
  },

  groupTypes: {
    region: {
      name: 'region',
      label: 'Region',
      description: 'Concurrent region within composite state',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Check for exactly one initial state
    const initialStates = diagram.graph.nodes.filter(n => n.type === 'initialState');
    if (initialStates.length === 0) {
      errors.push({
        path: 'graph.nodes',
        message: 'State machine must have at least one initial state',
      });
    }

    // Validate transitions have events
    for (const edge of diagram.graph.edges) {
      if (edge.type === 'transition' && !edge.data.custom?.event) {
        errors.push({
          path: `graph.edges.${edge.id}.data.event`,
          message: 'Transitions must specify triggering event',
        });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, document: diagram };
  },

  defaultLayout: {
    algorithm: 'force-directed',
    spacing: {
      node: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      borderColor: '#2196f3',
      padding: 15,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      strokeColor: '#333333',
    },
  },

  aiPrompts: {
    systemPrompt: `State Machine diagrams model system behavior through states and transitions.

State Types:
- initialState: Black filled circle - starting point (required, at least one)
- state: Basic state the system can be in
- compositeState: State containing nested sub-states
- finalState: Black filled circle with ring - terminal state
- choicePoint: Diamond - conditional branching
- historyState: Remembers last active sub-state

Transition Types:
- transition: Event-triggered state change (MUST specify event name)
- selfTransition: Loops back to same state
- internalTransition: Action within state without state change

Transition Format:
- event[guard]/action
  - event: What triggers the transition (REQUIRED)
  - guard: Optional condition in square brackets
  - action: Optional action after slash

State Content:
- entry/ action on entering state
- exit/ action on leaving state
- do/ activity while in state

Use Cases:
- Protocol state machines (TCP, HTTP)
- UI component states (loading, idle, error)
- Order states (pending, processing, shipped, delivered)
- User session states (logged out, authenticated, expired)
- Game states (menu, playing, paused, game over)

Best Practices:
- Start with one initial state
- Label all transitions with events
- Use guard conditions for complex logic
- Group related states in composite states
- Consider all possible events from each state
- End with final state when appropriate
- Keep state names as adjectives or nouns (not verbs)`,
    examples: [
      'TCP connection: Closed → Listen → SynReceived → Established → CloseWait → Closed',
      'Order lifecycle: Created → Pending → Processing → Shipped → Delivered',
      'Door: Closed -[open]→ Opening -[opened]→ Open -[close]→ Closing -[closed]→ Closed',
    ],
  },
};
