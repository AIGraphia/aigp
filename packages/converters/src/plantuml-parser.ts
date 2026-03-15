/**
 * PlantUML to AIGP converter
 * Supports: sequence diagrams, class diagrams, use case diagrams, activity diagrams
 */

import type { AIGraphDocument } from '@aigraphia/protocol';

export interface ConversionResult {
  success: boolean;
  document?: AIGraphDocument;
  errors?: string[];
}

/**
 * Convert PlantUML syntax to AIGP format
 */
export function fromPlantUML(plantuml: string): ConversionResult {
  const errors: string[] = [];

  try {
    // Remove @startuml/@enduml tags and trim
    const content = plantuml
      .replace(/@startuml.*?\n/g, '')
      .replace(/@enduml/g, '')
      .trim();

    // Detect diagram type
    const type = detectDiagramType(content);

    if (!type) {
      return {
        success: false,
        errors: ['Unable to detect PlantUML diagram type']
      };
    }

    // Parse based on type
    let document: AIGraphDocument;

    switch (type) {
      case 'sequence':
        document = parseSequenceDiagram(content);
        break;
      case 'class':
        document = parseClassDiagram(content);
        break;
      case 'usecase':
        document = parseUseCaseDiagram(content);
        break;
      case 'activity':
        document = parseActivityDiagram(content);
        break;
      default:
        return {
          success: false,
          errors: [`Unsupported diagram type: ${type}`]
        };
    }

    return {
      success: true,
      document
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}

function detectDiagramType(content: string): string | null {
  // Sequence diagram indicators
  if (content.match(/^\s*(participant|actor|boundary|control|entity|database|collections)/m)) {
    return 'sequence';
  }
  if (content.match(/->|<-|-->|<--|\.>|\.\.>/)) {
    return 'sequence';
  }

  // Activity diagram indicators (check before class — class regex can false-match activity syntax)
  if (content.match(/^\s*(start|stop|end|if|else|endif|while|endwhile)/m)) {
    return 'activity';
  }

  // Class diagram indicators
  if (content.match(/^\s*class\s+\w+/m) || content.match(/^\s*\w+\s*:\s*\w+/m) || content.match(/--|>|<\|--|\*--/)) {
    return 'class';
  }

  // Use case indicators
  if (content.match(/^\s*(usecase|actor|rectangle)/m) || content.match(/\.\.>|--|>/)) {
    return 'usecase';
  }

  return null;
}

function parseSequenceDiagram(content: string): AIGraphDocument {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith("'"));

  const participants = new Map<string, any>();
  const messages: any[] = [];
  let timestamp = 0;

  for (const line of lines) {
    // Participant declarations
    const participantMatch = line.match(/^(participant|actor|boundary|control|entity|database|collections)\s+(\w+)(?:\s+as\s+"([^"]+)")?/);
    if (participantMatch) {
      const [, type, id, label] = participantMatch;
      participants.set(id, {
        id,
        type: 'actor',
        label: label || id,
        data: { participantType: type }
      });
      continue;
    }

    // Messages: A -> B: message or A --> B: message
    const messageMatch = line.match(/^(\w+)\s*(->|-->|<-|<--|\.>|\.\.>)\s*(\w+)\s*:\s*(.+)$/);
    if (messageMatch) {
      const [, source, arrow, target, label] = messageMatch;

      // Ensure participants exist
      if (!participants.has(source)) {
        participants.set(source, { id: source, type: 'actor', label: source, data: {} });
      }
      if (!participants.has(target)) {
        participants.set(target, { id: target, type: 'actor', label: target, data: {} });
      }

      const messageType = (arrow === '->' || arrow === '<-') ? 'sync' : 'async';
      const actualSource = arrow.startsWith('<') ? target : source;
      const actualTarget = arrow.startsWith('<') ? source : target;

      messages.push({
        source: actualSource,
        target: actualTarget,
        label: label.trim(),
        type: 'message',
        data: { messageType, timestamp: timestamp++ }
      });
    }
  }

  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'sequence',
    metadata: {
      title: 'Sequence Diagram',
      description: 'Converted from PlantUML',
      author: 'PlantUML Converter',
      tags: ['sequence', 'plantuml', 'imported']
    },
    graph: {
      nodes: Array.from(participants.values()),
      edges: messages.map((m, i) => ({ ...m, id: `e${i}` }))
    },
    layout: {
      algorithm: 'timeline',
      direction: 'LR'
    }
  };
}

function parseClassDiagram(content: string): AIGraphDocument {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith("'"));

  const classes = new Map<string, any>();
  const relationships: any[] = [];
  let currentClass: string | null = null;
  let inClassBlock = false;

  for (const line of lines) {
    // End of class block
    if (inClassBlock && line === '}') {
      inClassBlock = false;
      currentClass = null;
      continue;
    }

    // Members inside class block
    if (inClassBlock && currentClass) {
      const cls = classes.get(currentClass)!;
      const memberLine = line.replace(/^\s*[+\-#~]\s*/, '');
      if (line.includes('(')) {
        cls.data.methods.push(memberLine);
      } else if (memberLine.length > 0) {
        cls.data.attributes.push(memberLine);
      }
      continue;
    }

    // Class declaration with opening brace: class ClassName {
    const classBlockMatch = line.match(/^(class|interface|enum|abstract)\s+(\w+)\s*\{$/);
    if (classBlockMatch) {
      const [, type, name] = classBlockMatch;
      if (!classes.has(name)) {
        classes.set(name, {
          id: name,
          type: 'class',
          label: name,
          data: {
            classType: type,
            attributes: [],
            methods: []
          }
        });
      }
      currentClass = name;
      inClassBlock = true;
      continue;
    }

    // Class declaration: class ClassName
    const classMatch = line.match(/^(class|interface|enum|abstract)\s+(\w+)/);
    if (classMatch) {
      const [, type, name] = classMatch;
      if (!classes.has(name)) {
        classes.set(name, {
          id: name,
          type: 'class',
          label: name,
          data: {
            classType: type,
            attributes: [],
            methods: []
          }
        });
      }
      continue;
    }

    // Class with members: ClassName : +attribute or ClassName : +method()
    const memberMatch = line.match(/^(\w+)\s*:\s*([+\-#~])?\s*(.+)$/);
    if (memberMatch) {
      const [, className, visibility, member] = memberMatch;
      if (!classes.has(className)) {
        classes.set(className, {
          id: className,
          type: 'class',
          label: className,
          data: { attributes: [], methods: [] }
        });
      }

      const cls = classes.get(className)!;
      if (member.includes('(')) {
        cls.data.methods.push(member);
      } else {
        cls.data.attributes.push(member);
      }
      continue;
    }

    // Relationships: ClassA --|> ClassB (inheritance)
    const relationMatch = line.match(/^(\w+)\s*(<\|--|-\-\|>|o--|-\-o|\*--|-\-\*|\.\.>|<\.\.|-\->|<-\-)\s*(\w+)/);
    if (relationMatch) {
      const [, source, arrow, target] = relationMatch;

      // Ensure classes exist
      if (!classes.has(source)) {
        classes.set(source, { id: source, type: 'class', label: source, data: {} });
      }
      if (!classes.has(target)) {
        classes.set(target, { id: target, type: 'class', label: target, data: {} });
      }

      let relType = 'association';
      if (arrow.includes('|>') || arrow.includes('<|')) relType = 'inheritance';
      else if (arrow.includes('*')) relType = 'composition';
      else if (arrow.includes('o')) relType = 'aggregation';

      relationships.push({
        source,
        target,
        type: relType,
        data: {}
      });
    }
  }

  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'uml-class',
    metadata: {
      title: 'Class Diagram',
      description: 'Converted from PlantUML',
      author: 'PlantUML Converter',
      tags: ['class', 'plantuml', 'imported']
    },
    graph: {
      nodes: Array.from(classes.values()),
      edges: relationships.map((r, i) => ({ ...r, id: `e${i}` }))
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB'
    }
  };
}

function parseUseCaseDiagram(content: string): AIGraphDocument {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith("'"));

  const actors = new Map<string, any>();
  const usecases = new Map<string, any>();
  const relationships: any[] = [];

  for (const line of lines) {
    // Actor: actor ActorName or :ActorName:
    const actorMatch = line.match(/^actor\s+(\w+)|^:(\w+):/);
    if (actorMatch) {
      const id = actorMatch[1] || actorMatch[2];
      actors.set(id, {
        id,
        type: 'actor',
        label: id,
        data: {}
      });
      continue;
    }

    // Use case: usecase UseCaseName or (UseCaseName)
    const usecaseMatch = line.match(/^usecase\s+(\w+)|^\(([^)]+)\)/);
    if (usecaseMatch) {
      const id = (usecaseMatch[1] || usecaseMatch[2]).replace(/\s+/g, '_');
      usecases.set(id, {
        id,
        type: 'usecase',
        label: usecaseMatch[1] || usecaseMatch[2],
        data: {}
      });
      continue;
    }

    // Relationships: Actor --> UseCase
    const relMatch = line.match(/^(\w+)\s*(-->|\.\.>)\s*(\w+)/);
    if (relMatch) {
      const [, source, arrow, target] = relMatch;
      relationships.push({
        source,
        target,
        type: arrow === '-->' ? 'association' : 'dependency',
        data: {}
      });
    }
  }

  const allNodes = [...Array.from(actors.values()), ...Array.from(usecases.values())];

  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart', // Map to flowchart as AIGP doesn't have usecase type
    metadata: {
      title: 'Use Case Diagram',
      description: 'Converted from PlantUML',
      author: 'PlantUML Converter',
      tags: ['usecase', 'plantuml', 'imported']
    },
    graph: {
      nodes: allNodes,
      edges: relationships.map((r, i) => ({ ...r, id: `e${i}` }))
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'LR'
    }
  };
}

function parseActivityDiagram(content: string): AIGraphDocument {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith("'"));

  const nodes: any[] = [];
  const edges: any[] = [];
  let nodeCounter = 0;
  const nodeMap = new Map<string, string>(); // label -> id
  let lastNodeId: string | null = null;

  for (const line of lines) {
    let currentNodeId: string | null = null;

    // Start
    if (line.match(/^start/i)) {
      currentNodeId = `node${nodeCounter++}`;
      nodes.push({
        id: currentNodeId,
        type: 'start',
        label: 'Start',
        data: {}
      });
      nodeMap.set('start', currentNodeId);
    }
    // End/Stop
    else if (line.match(/^(end|stop)/i)) {
      currentNodeId = `node${nodeCounter++}`;
      nodes.push({
        id: currentNodeId,
        type: 'end',
        label: 'End',
        data: {}
      });
      nodeMap.set('end', currentNodeId);
    }
    // Activity: :ActivityName;
    else if (line.match(/^:(.+);$/)) {
      const label = line.match(/^:(.+);$/)![1];
      currentNodeId = `node${nodeCounter++}`;
      nodes.push({
        id: currentNodeId,
        type: 'process',
        label,
        data: {}
      });
      nodeMap.set(label, currentNodeId);
    }
    // Decision: if (...) then
    else if (line.match(/^if\s*\((.+)\)\s*then/i)) {
      const condition = line.match(/^if\s*\((.+)\)\s*then/i)![1];
      currentNodeId = `node${nodeCounter++}`;
      nodes.push({
        id: currentNodeId,
        type: 'decision',
        label: condition,
        data: {}
      });
      nodeMap.set(`if_${condition}`, currentNodeId);
    }

    // Create edge from last node to current
    if (lastNodeId && currentNodeId) {
      edges.push({
        id: `e${edges.length}`,
        source: lastNodeId,
        target: currentNodeId,
        type: 'flow',
        data: {}
      });
    }

    if (currentNodeId) {
      lastNodeId = currentNodeId;
    }
  }

  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: {
      title: 'Activity Diagram',
      description: 'Converted from PlantUML',
      author: 'PlantUML Converter',
      tags: ['activity', 'plantuml', 'imported']
    },
    graph: {
      nodes,
      edges
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB'
    }
  };
}
