/**
 * Mermaid to AIGP Converter
 * Parses Mermaid diagrams and converts them to AIGraphDocument format
 */

import type { AIGraphDocument, Node, Edge, DiagramType } from '@aigp/protocol';

export interface MermaidParseOptions {
  defaultNodeType?: string;
  defaultEdgeType?: string;
  preserveLabels?: boolean;
}

export interface MermaidParseResult {
  success: boolean;
  document?: AIGraphDocument;
  errors?: string[];
  warnings?: string[];
}

/**
 * Parse Mermaid diagram syntax and convert to AIGP format
 */
export function fromMermaid(
  mermaidCode: string,
  options: MermaidParseOptions = {}
): MermaidParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Trim and normalize input
    const code = mermaidCode.trim();

    if (!code) {
      return {
        success: false,
        errors: ['Empty input'],
      };
    }

    // Detect diagram type from first line
    const firstLine = code.split('\n')[0].trim();
    const diagramType = detectDiagramType(firstLine);

    if (!diagramType) {
      return {
        success: false,
        errors: [`Unknown diagram type: ${firstLine}`],
      };
    }

    // Parse based on diagram type
    let document: AIGraphDocument;

    switch (diagramType) {
      case 'flowchart':
        document = parseFlowchart(code, options);
        break;
      case 'sequence':
        document = parseSequenceDiagram(code, options);
        break;
      case 'uml-class':
        document = parseClassDiagram(code, options);
        break;
      case 'er':
        document = parseERDiagram(code, options);
        break;
      case 'uml-state':
        document = parseStateDiagram(code, options);
        break;
      case 'timeline':
        document = parseTimeline(code, options);
        break;
      case 'mind-map':
        document = parseMindmap(code, options);
        break;
      case 'sankey':
        document = parseSankey(code, options);
        break;
      default:
        return {
          success: false,
          errors: [`Parser not implemented for type: ${diagramType}`],
        };
    }

    return {
      success: true,
      document,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Detect diagram type from Mermaid syntax
 */
function detectDiagramType(firstLine: string): DiagramType | null {
  const line = firstLine.toLowerCase();

  if (line.startsWith('flowchart') || line.startsWith('graph')) {
    return 'flowchart';
  }
  if (line.startsWith('sequencediagram')) {
    return 'sequence';
  }
  if (line.startsWith('classdiagram')) {
    return 'uml-class';
  }
  if (line.startsWith('erdiagram')) {
    return 'er';
  }
  if (line.startsWith('statediagram')) {
    return 'uml-state';
  }
  if (line.startsWith('timeline')) {
    return 'timeline';
  }
  if (line.startsWith('mindmap')) {
    return 'mind-map';
  }
  if (line.startsWith('sankey-beta')) {
    return 'sankey';
  }

  return null;
}

/**
 * Parse Mermaid flowchart
 */
function parseFlowchart(code: string, options: MermaidParseOptions): AIGraphDocument {
  const lines = code.split('\n').slice(1); // Skip first line (diagram type)
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeMap = new Map<string, Node>();
  let edgeCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue; // Skip comments

    // Parse combined node+edge: A[Label] --> B[Label]
    const combinedMatch = trimmed.match(/^(\w+)(\[|\(\[|\(|\{|\(\()(.*?)(\]|\]\)|\)|\}|\)\))\s*(-->|---|-.->|--..|==>|\.\.>)\s*(\w+)(\[|\(\[|\(|\{|\(\()(.*?)(\]|\]\)|\)|\}|\)\))/);
    if (combinedMatch) {
      const [, sourceId, sourceStart, sourceLabel, sourceEnd, arrow, targetId, targetStart, targetLabel, targetEnd] = combinedMatch;

      // Create source node
      if (!nodeMap.has(sourceId)) {
        const shape = determineNodeShape(sourceStart, sourceEnd);
        const node: Node = {
          id: sourceId,
          type: options.defaultNodeType || 'process',
          label: sourceLabel || sourceId,
          data: {},
          style: shape ? { shape } : undefined,
        };
        nodes.push(node);
        nodeMap.set(sourceId, node);
      }

      // Create target node
      if (!nodeMap.has(targetId)) {
        const shape = determineNodeShape(targetStart, targetEnd);
        const node: Node = {
          id: targetId,
          type: options.defaultNodeType || 'process',
          label: targetLabel || targetId,
          data: {},
          style: shape ? { shape } : undefined,
        };
        nodes.push(node);
        nodeMap.set(targetId, node);
      }

      // Create edge
      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: options.defaultEdgeType || 'flow',
        source: sourceId,
        target: targetId,
        data: {},
        style: determineEdgeStyle(arrow),
      };
      edges.push(edge);
      continue;
    }

    // Parse standalone node definitions: A[Label] or A([Label]) or A{Label}
    const nodeMatch = trimmed.match(/^(\w+)(\[|\(\[|\(|\{|\(\()(.*?)(\]|\]\)|\)|\}|\)\))\s*$/);
    if (nodeMatch) {
    // Parse standalone node definitions with specific shape patterns
    // Try most specific patterns first to avoid false matches
    let nodeMatched = false;
    
    // Circle: ((...))
    let nodeMatch = trimmed.match(/^(\w+)\(\((.*?)\)\)\s*$/);
    if (nodeMatch && !nodeMatched) {
      const [, id, label] = nodeMatch;
      if (!nodeMap.has(id)) {
        nodes.push({
          id,
          type: options.defaultNodeType || 'process',
          label: label || id,
          data: {},
          style: { shape: 'circle' },
        });
        nodeMap.set(id, nodes[nodes.length - 1]);
      }
      nodeMatched = true;
    }
    
    // Stadium: ([...])
    if (!nodeMatched) {
      nodeMatch = trimmed.match(/^(\w+)\(\[(.*?)\]\)\s*$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodeMap.has(id)) {
          nodes.push({
            id,
            type: options.defaultNodeType || 'process',
            label: label || id,
            data: {},
            style: { shape: 'ellipse' },
          });
          nodeMap.set(id, nodes[nodes.length - 1]);
        }
        nodeMatched = true;
      }
    }
    
    // Diamond: {...}
    if (!nodeMatched) {
      nodeMatch = trimmed.match(/^(\w+)\{(.*?)\}\s*$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodeMap.has(id)) {
          nodes.push({
            id,
            type: options.defaultNodeType || 'process',
            label: label || id,
            data: {},
            style: { shape: 'diamond' },
          });
          nodeMap.set(id, nodes[nodes.length - 1]);
        }
        nodeMatched = true;
      }
    }
    
    // Rectangle: [...]
    if (!nodeMatched) {
      nodeMatch = trimmed.match(/^(\w+)\[(.*?)\]\s*$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodeMap.has(id)) {
          nodes.push({
            id,
            type: options.defaultNodeType || 'process',
            label: label || id,
            data: {},
            style: { shape: 'rectangle' },
          });
          nodeMap.set(id, nodes[nodes.length - 1]);
        }
        nodeMatched = true;
      }
    }
    
    // Rounded: (...) - Must be last
    if (!nodeMatched) {
      nodeMatch = trimmed.match(/^(\w+)\((.*?)\)\s*$/);
      if (nodeMatch) {
        const [, id, label] = nodeMatch;
        if (!nodeMap.has(id)) {
          nodes.push({
            id,
            type: options.defaultNodeType || 'process',
            label: label || id,
            data: {},
            style: { shape: 'ellipse' },
          });
          nodeMap.set(id, nodes[nodes.length - 1]);
        }
        nodeMatched = true;
      }
    }
    
    if (nodeMatched) continue;
    }


    // Parse edge with target node shape: B --> C[End]
    const edgeWithTargetShape = trimmed.match(/^(\w+)\s*(-->|---|-.->|--\.\.|==>|\.\.>)\s*(\w+)((\(\()|(\(\[)|(\{)|(\()|(\[))(.*?)(((\)\))|(\]\))|(\})|(\))|(\])))/);
    if (edgeWithTargetShape) {
      const [, source, arrow, targetId, , , , , , , targetLabel, targetEnd] = edgeWithTargetShape;
      
      // Ensure source node exists
      if (!nodeMap.has(source)) {
        const node: Node = { id: source, type: 'process', label: source, data: {} };
        nodes.push(node);
        nodeMap.set(source, node);
      }
      
      // Create target node with shape
      if (!nodeMap.has(targetId)) {
        const shape = determineNodeShape(
          targetEnd === '))' ? '((' :
          targetEnd === '])' ? '([' :
          targetEnd === '}' ? '{' :
          targetEnd === ')' ? '(' : '[',
          targetEnd
        );
        const node: Node = {
          id: targetId,
          type: options.defaultNodeType || 'process',
          label: targetLabel || targetId,
          data: {},
          style: shape ? { shape } : undefined,
        };
        nodes.push(node);
        nodeMap.set(targetId, node);
      }
      
      // Create edge
      edges.push({
        id: `e${edgeCounter++}`,
        type: options.defaultEdgeType || 'flow',
        source,
        target: targetId,
        data: {},
        style: determineEdgeStyle(arrow),
      });
      continue;
    }

    // Parse edges with labels: A -->|Label| B
    const edgeLabelMatch = trimmed.match(/^(\w+)\s*(-->|---|-.->|--..|==>|\.\.>)\|([^\|]+)\|\s*(\w+)/);
    if (edgeLabelMatch) {
      const [, source, arrow, label, target] = edgeLabelMatch;

      if (!nodeMap.has(source)) {
        const node: Node = { id: source, type: 'process', label: source, data: {} };
        nodes.push(node);
        nodeMap.set(source, node);
      }
      if (!nodeMap.has(target)) {
        const node: Node = { id: target, type: 'process', label: target, data: {} };
        nodes.push(node);
        nodeMap.set(target, node);
      }

      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: options.defaultEdgeType || 'flow',
        source,
        target,
        label: label.trim(),
        data: {},
        style: determineEdgeStyle(arrow),
      };
      edges.push(edge);
      continue;
    }

    // Parse simple edges: A --> B (without node definitions)
    const edgeMatch = trimmed.match(/^(\w+)\s*(-->|---|-.->|--..|==>|\.\.>)\s*(\w+)(?:\s*\|([^\|]+)\|)?$/);
    if (edgeMatch) {
      const [, source, arrow, target, label] = edgeMatch;

      // Ensure nodes exist
      if (!nodeMap.has(source)) {
        const node: Node = { id: source, type: 'process', label: source, data: {} };
        nodes.push(node);
        nodeMap.set(source, node);
      }
      if (!nodeMap.has(target)) {
        const node: Node = { id: target, type: 'process', label: target, data: {} };
        nodes.push(node);
        nodeMap.set(target, node);
      }

      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: options.defaultEdgeType || 'flow',
        source,
        target,
        label: label?.trim(),
        data: {},
        style: determineEdgeStyle(arrow),
      };
      edges.push(edge);
    }
  }

  return {
    schema: "https://aigraphia.com/schema/v1",
    version: '1.0.0',
    type: 'flowchart',
    metadata: {
      title: 'Imported from Mermaid',
      description: 'Flowchart imported from Mermaid syntax',
    },
    graph: {
      nodes,
      edges,
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB',
    },
  };
}

/**
 * Determine node shape from Mermaid syntax
 */
/**
 * Determine node shape from Mermaid syntax
 */
function determineNodeShape(start: string, end: string): 'rectangle' | 'ellipse' | 'diamond' | 'circle' | undefined {
  // Check for diamond shape
  if (start.includes('{') && end.includes('}')) return 'diamond';
  // Check for circle (double parentheses)
  if (start === '((' && end === '))') return 'circle';
  // Check for stadium/ellipse with square brackets  
  if (start === '([' && end === '])') return 'ellipse';
  // Check for regular rounded rectangle/ellipse
  if (start === '(' && end === ')') return 'ellipse';
  // Check for rectangle
  if (start === '[' && end === ']') return 'rectangle';
  return undefined;
}

/**
 * Determine edge style from Mermaid arrow syntax
 */
function determineEdgeStyle(arrow: string): { strokeStyle?: 'solid' | 'dashed' | 'dotted' } | undefined {
  if (arrow.includes('-.') || arrow.includes('.')) {
    return { strokeStyle: 'dotted' };
  }
  if (arrow.includes('==')) {
    return { strokeStyle: 'solid' }; // Thick line
  }
  return undefined;
}

/**
 * Parse Mermaid sequence diagram
 */
function parseSequenceDiagram(code: string, options: MermaidParseOptions): AIGraphDocument {
  const lines = code.split('\n').slice(1);
  const participants = new Map<string, Node>();
  const edges: Edge[] = [];
  let edgeCounter = 0;
  let order = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;

    // Parse participant: participant A
    const participantMatch = trimmed.match(/^participant\s+(\w+)(?:\s+as\s+(.+))?/);
    if (participantMatch) {
      const [, id, label] = participantMatch;
      const node: Node = {
        id,
        type: 'actor',
        label: label || id,
        data: { lifeline: true },
      };
      participants.set(id, node);
      continue;
    }

    // Parse message: A->>B: Message or A-->>B: Message
    const messageMatch = trimmed.match(/^(\w+)(->|-->|->>|-->>)\+?(\w+):\s*(.+)/);
    if (messageMatch) {
      const [, source, arrow, target, label] = messageMatch;

      // Auto-create participants if not defined
      if (!participants.has(source)) {
        participants.set(source, {
          id: source,
          type: 'actor',
          label: source,
          data: { lifeline: true },
        });
      }
      if (!participants.has(target)) {
        participants.set(target, {
          id: target,
          type: 'actor',
          label: target,
          data: { lifeline: true },
        });
      }

      const messageType = arrow.includes('--') ? 'async' : 'sync';
      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: 'message',
        source,
        target,
        label: label.trim(),
        data: {
          messageType,
          timestamp: order++,
        },
      };
      edges.push(edge);
    }
  }

  return {
    schema: "https://aigraphia.com/schema/v1",
    version: '1.0.0',
    type: 'sequence',
    metadata: {
      title: 'Imported from Mermaid',
      description: 'Sequence diagram imported from Mermaid syntax',
    },
    graph: {
      nodes: Array.from(participants.values()),
      edges,
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'LR',
    },
  };
}

/**
 * Parse Mermaid class diagram
 */
function parseClassDiagram(code: string, options: MermaidParseOptions): AIGraphDocument {
  const lines = code.split('\n').slice(1);
  const classes = new Map<string, Node>();
  const edges: Edge[] = [];
  let edgeCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;

    // Parse class definition: class ClassName
    const classMatch = trimmed.match(/^class\s+(\w+)/);
    if (classMatch) {
      const [, id] = classMatch;
      if (!classes.has(id)) {
        classes.set(id, {
          id,
          type: 'class',
          label: id,
          data: {
            attributes: [],
            methods: [],
          },
        });
      }
      continue;
    }

    // Parse relationships: ClassA --|> ClassB (inheritance), ClassA --* ClassB (composition)
    const relationMatch = trimmed.match(/^(\w+)\s*(--|\.\.)(\|>|\*|o|>)\s*(\w+)(?:\s*:\s*(.+))?/);
    if (relationMatch) {
      const [, source, lineType, arrowType, target, label] = relationMatch;

      // Ensure classes exist
      if (!classes.has(source)) {
        classes.set(source, {
          id: source,
          type: 'class',
          label: source,
          data: { attributes: [], methods: [] },
        });
      }
      if (!classes.has(target)) {
        classes.set(target, {
          id: target,
          type: 'class',
          label: target,
          data: { attributes: [], methods: [] },
        });
      }

      let relationship: "association" | "aggregation" | "composition" | "inheritance" | "dependency" = 'association';
      if (arrowType === '|>' || arrowType === '>') relationship = 'inheritance';
      if (arrowType === '*') relationship = 'composition';
      if (arrowType === 'o') relationship = 'aggregation';
      if (arrowType === '*') relationship = 'composition';
      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: 'relationship',
        source,
        target,
        label: label?.trim(),
        data: { relationship },
        style: lineType === '..' ? { strokeStyle: 'dotted' } : undefined,
      };
      edges.push(edge);
    }
  }

  return {
    schema: "https://aigraphia.com/schema/v1",
    version: '1.0.0',
    type: 'uml-class',
    metadata: {
      title: 'Imported from Mermaid',
      description: 'Class diagram imported from Mermaid syntax',
    },
    graph: {
      nodes: Array.from(classes.values()),
      edges,
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB',
    },
  };
}

/**
 * Parse Mermaid ER diagram
 */
function parseERDiagram(code: string, options: MermaidParseOptions): AIGraphDocument {
  const lines = code.split('\n').slice(1);
  const entities = new Map<string, Node>();
  const edges: Edge[] = [];
  let edgeCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;

    // Parse relationship: CUSTOMER ||--o{ ORDER : places
    const relationMatch = trimmed.match(/^(\w+)\s*(\|\||o\||}\|)--(\|\||o\||o\{|\{\|)\s*(\w+)\s*:\s*(.+)/);
    if (relationMatch) {
      const [, source, sourceCard, targetCard, target, label] = relationMatch;

      // Create entities if they don't exist
      if (!entities.has(source)) {
        entities.set(source, {
          id: source,
          type: 'entity',
          label: source,
          data: {},
        });
      }
      if (!entities.has(target)) {
        entities.set(target, {
          id: target,
          type: 'entity',
          label: target,
          data: {},
        });
      }

      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: 'relationship',
        source,
        target,
        label: label.trim(),
        data: {
          relationship: 'association',
          multiplicity: {
            source: sourceCard.replace(/[{}|]/g, ''),
            target: targetCard.replace(/[{}|]/g, ''),
          },
        },
      };
      edges.push(edge);
    }
  }

  return {
    schema: "https://aigraphia.com/schema/v1",
    version: '1.0.0',
    type: 'er',
    metadata: {
      title: 'Imported from Mermaid',
      description: 'ER diagram imported from Mermaid syntax',
    },
    graph: {
      nodes: Array.from(entities.values()),
      edges,
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'LR',
    },
  };
}

/**
 * Parse Mermaid state diagram
 */
function parseStateDiagram(code: string, options: MermaidParseOptions): AIGraphDocument {
  const lines = code.split('\n').slice(1);
  const states = new Map<string, Node>();
  const edges: Edge[] = [];
  let edgeCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;

    // Parse state: state "State Name" as id
    const stateMatch = trimmed.match(/^state\s+"([^"]+)"\s+as\s+(\w+)/);
    if (stateMatch) {
      const [, label, id] = stateMatch;
      states.set(id, {
        id,
        type: 'state',
        label,
        data: {},
      });
      continue;
    }

    // Parse transition: StateA --> StateB : event
    const transitionMatch = trimmed.match(/^(\w+|\[[\*]\])\s*-->\s*(\w+|\[[\*]\])(?:\s*:\s*(.+))?/);
    if (transitionMatch) {
      const [, source, target, label] = transitionMatch;
      const sourceId = source.replace(/[\[\]]/g, '') || 'start';
      const targetId = target.replace(/[\[\]]/g, '') || 'end';

      // Create states if they don't exist
      if (!states.has(sourceId) && sourceId !== '*') {
        states.set(sourceId, {
          id: sourceId,
          type: sourceId === 'start' ? 'initial' : 'state',
          label: sourceId,
          data: {},
        });
      }
      if (!states.has(targetId) && targetId !== '*') {
        states.set(targetId, {
          id: targetId,
          type: targetId === 'end' ? 'final' : 'state',
          label: targetId,
          data: {},
        });
      }

      const edge: Edge = {
        id: `e${edgeCounter++}`,
        type: 'transition',
        source: sourceId,
        target: targetId,
        label: label?.trim(),
        data: {},
      };
      edges.push(edge);
    }
  }

  return {
    schema: "https://aigraphia.com/schema/v1",
    version: '1.0.0',
    type: 'uml-state',
    metadata: {
      title: 'Imported from Mermaid',
      description: 'State diagram imported from Mermaid syntax',
    },
    graph: {
      nodes: Array.from(states.values()),
      edges,
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'LR',
    },
  };
}

/**
 * Stub parsers for other diagram types
 */
function parseTimeline(code: string, options: MermaidParseOptions): AIGraphDocument {
  throw new Error('Timeline diagram parsing is not yet supported. Contributions welcome!');
}

function parseMindmap(code: string, options: MermaidParseOptions): AIGraphDocument {
  throw new Error('Mindmap diagram parsing is not yet supported. Contributions welcome!');
}

function parseSankey(code: string, options: MermaidParseOptions): AIGraphDocument {
  throw new Error('Sankey diagram parsing is not yet supported. Contributions welcome!');
}
