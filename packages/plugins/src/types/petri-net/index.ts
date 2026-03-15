/**
 * Petri net diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const petriNetPlugin: DiagramPlugin = {
  type: 'petri-net',
  name: 'Petri Net',
  description: 'Mathematical modeling of distributed systems with places, transitions, and tokens',

  nodeTypes: {
    place: {
      name: 'place',
      label: 'Place',
      description: 'State or condition that can hold tokens',
      defaultStyle: {
        shape: 'circle',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderWidth: 2,
        borderColor: '#000000',
      },
      requiredFields: ['tokens'],
    },
    transition: {
      name: 'transition',
      label: 'Transition',
      description: 'Action or event that changes marking',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#000000',
      },
    },
    timedTransition: {
      name: 'timedTransition',
      label: 'Timed Transition',
      description: 'Transition with temporal constraint',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#1565c0',
      },
      requiredFields: ['delay'],
    },
    immediateTransition: {
      name: 'immediateTransition',
      label: 'Immediate Transition',
      description: 'Transition that fires instantly when enabled',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#2e7d32',
      },
    },
  },

  edgeTypes: {
    arc: {
      name: 'arc',
      label: 'Arc',
      description: 'Connection from place to transition or vice versa',
      defaultStyle: {
        strokeColor: '#000000',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    weightedArc: {
      name: 'weightedArc',
      label: 'Weighted Arc',
      description: 'Arc with multiplicity greater than 1',
      defaultStyle: {
        strokeColor: '#000000',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
      requiredFields: ['weight'],
    },
    inhibitorArc: {
      name: 'inhibitorArc',
      label: 'Inhibitor Arc',
      description: 'Prevents transition when place has tokens',
      defaultStyle: {
        strokeColor: '#f44336',
        strokeWidth: 2,
        arrowEnd: 'circle',
      },
    },
    resetArc: {
      name: 'resetArc',
      label: 'Reset Arc',
      description: 'Removes all tokens from place',
      defaultStyle: {
        strokeColor: '#ff9800',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
  },

  groupTypes: {
    subnet: {
      name: 'subnet',
      label: 'Subnet',
      description: 'Hierarchical grouping of places and transitions',
      defaultStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#666666',
        borderWidth: 2,
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    const result = validateFull(diagram);
    if (!result.valid) return result;

    const errors: any[] = [];

    // Validate that all places have token count
    for (const node of diagram.graph.nodes) {
      if (node.type === 'place') {
        const tokens = node.data.custom?.tokens;
        if (typeof tokens !== 'number' || tokens < 0) {
          errors.push({
            path: `graph.nodes.${node.id}.data.tokens`,
            message: 'Places must have non-negative token count',
          });
        }
      }
      if (node.type === 'timedTransition' && !node.data.custom?.delay) {
        errors.push({
          path: `graph.nodes.${node.id}.data.delay`,
          message: 'Timed transitions must specify delay',
        });
      }
    }

    // Validate weighted arcs have positive weights
    for (const edge of diagram.graph.edges) {
      if (edge.type === 'weightedArc') {
        const weight = edge.data.custom?.weight;
        if (typeof weight !== 'number' || weight <= 0) {
          errors.push({
            path: `graph.edges.${edge.id}.data.weight`,
            message: 'Weighted arcs must have positive weight',
          });
        }
      }
    }

    // Validate bipartite structure (places connect to transitions, not to places)
    for (const edge of diagram.graph.edges) {
      const sourceNode = diagram.graph.nodes.find(n => n.id === edge.source);
      const targetNode = diagram.graph.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceIsPlace = sourceNode.type === 'place';
        const targetIsPlace = targetNode.type === 'place';
        const sourceIsTransition = ['transition', 'timedTransition', 'immediateTransition'].includes(sourceNode.type);
        const targetIsTransition = ['transition', 'timedTransition', 'immediateTransition'].includes(targetNode.type);

        if ((sourceIsPlace && targetIsPlace) || (sourceIsTransition && targetIsTransition)) {
          errors.push({
            path: `graph.edges.${edge.id}`,
            message: 'Petri nets must be bipartite: places connect to transitions and vice versa',
          });
        }
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
      borderColor: '#000000',
      padding: 8,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
      strokeColor: '#000000',
    },
    defaultGroupStyle: {
      backgroundColor: '#f5f5f5',
      borderWidth: 2,
      borderColor: '#666666',
      borderStyle: 'dashed',
    },
  },

  aiPrompts: {
    systemPrompt: `Petri nets are mathematical models for distributed systems with precise execution semantics.

Node Types:
- place: Passive element holding tokens (circle, must have tokens count ≥ 0)
  - tokens: Current number of tokens (REQUIRED, represents state)
  - capacity: Optional maximum tokens allowed
- transition: Active element representing actions (black rectangle)
- timedTransition: Transition with time delay (blue rectangle, must have delay)
- immediateTransition: Instantaneous transition (green rectangle)

Edge Types:
- arc: Basic connection (weight = 1 by default)
  - From place to transition: input arc (precondition)
  - From transition to place: output arc (postcondition)
- weightedArc: Arc with weight > 1 (must have positive weight)
- inhibitorArc: Blocks transition if place has tokens (red, circle head)
- resetArc: Removes all tokens from place when transition fires (orange, dashed)

Execution Semantics:
- Transition is ENABLED when all input places have enough tokens
- Firing a transition:
  1. Remove tokens from input places (by arc weight)
  2. Add tokens to output places (by arc weight)
- Marking: Distribution of tokens across places (system state)

Bipartite Structure:
- Places ONLY connect to transitions
- Transitions ONLY connect to places
- No place-to-place or transition-to-transition arcs

Common Use Cases:
- Concurrent process modeling
- Workflow management systems
- Communication protocols
- Manufacturing systems
- Chemical reaction networks
- Business process analysis
- Distributed algorithm verification
- Deadlock detection

Properties to Analyze:
- Liveness: Can all transitions fire?
- Boundedness: Limited tokens per place?
- Reachability: Can we reach a target marking?
- Deadlock: Can system get stuck?
- Fairness: Do transitions fire equitably?

Best Practices:
- Use clear naming for places (nouns) and transitions (verbs)
- Show token count inside places (dots for 1-5, number for more)
- Label weighted arcs with their weights
- Use hierarchical subnets for complexity
- Verify bipartite structure (P-T-P-T alternation)
- Model invariants explicitly
- Test for deadlocks and livelocks
- Document initial marking clearly`,
    examples: [
      'Producer-Consumer: Buffer (3 tokens) ← Produce → Buffer → Consume → Empty',
      'Mutual exclusion: Available (1 token) → Enter_CS → Critical_Section → Exit_CS → Available',
      'Dining philosophers: Fork1, Fork2, ..., Fork5 with Think/Eat transitions',
    ],
  },
};
