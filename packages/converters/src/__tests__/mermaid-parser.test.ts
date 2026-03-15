import { describe, it, expect } from 'vitest';
import { fromMermaid } from '../mermaid-parser';

describe('Mermaid Parser', () => {
  describe('Flowchart parsing', () => {
    it('should parse simple flowchart', () => {
      const mermaid = `
flowchart TD
    A[Start] --> B[Process]
    B --> C[End]
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.document?.type).toBe('flowchart');
      expect(result.document?.graph.nodes).toHaveLength(3);
      expect(result.document?.graph.edges).toHaveLength(2);
    });

    it('should parse flowchart with different shapes', () => {
      const mermaid = `
flowchart TD
    A[Rectangle]
    B(Rounded)
    C{Diamond}
    D((Circle))
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const nodes = result.document?.graph.nodes || [];
      expect(nodes.find(n => n.id === 'A')?.style?.shape).toBe('rectangle');
      expect(nodes.find(n => n.id === 'B')?.style?.shape).toBe('ellipse');
      expect(nodes.find(n => n.id === 'C')?.style?.shape).toBe('diamond');
      expect(nodes.find(n => n.id === 'D')?.style?.shape).toBe('circle');
    });

    it('should parse flowchart with edge labels', () => {
      const mermaid = `
flowchart LR
    A -->|Yes| B
    A -->|No| C
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges).toHaveLength(2);
      expect(edges[0].label).toBe('Yes');
      expect(edges[1].label).toBe('No');
    });

    it('should parse flowchart with different edge styles', () => {
      const mermaid = `
flowchart TD
    A --> B
    C -.-> D
    E ==> F
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges).toHaveLength(3);
      expect(edges[1].style?.strokeStyle).toBe('dotted');
      expect(edges[2].style?.strokeStyle).toBe('solid');
    });

    it('should auto-create nodes from edges', () => {
      const mermaid = `
flowchart TD
    A --> B
    B --> C
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.graph.nodes).toHaveLength(3);
      expect(result.document?.graph.nodes.map(n => n.id)).toEqual(['A', 'B', 'C']);
    });
  });

  describe('Sequence diagram parsing', () => {
    it('should parse simple sequence diagram', () => {
      const mermaid = `
sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi there!
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('sequence');
      expect(result.document?.graph.nodes).toHaveLength(2);
      expect(result.document?.graph.edges).toHaveLength(2);
    });

    it('should parse sequence with explicit participants', () => {
      const mermaid = `
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Message
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const nodes = result.document?.graph.nodes || [];
      expect(nodes.find(n => n.id === 'A')?.label).toBe('Alice');
      expect(nodes.find(n => n.id === 'B')?.label).toBe('Bob');
    });

    it('should distinguish sync and async messages', () => {
      const mermaid = `
sequenceDiagram
    A->>B: Sync
    A-->>C: Async
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].data.messageType).toBe('sync');
      expect(edges[1].data.messageType).toBe('async');
    });

    it('should preserve message order', () => {
      const mermaid = `
sequenceDiagram
    A->>B: First
    B->>C: Second
    C->>A: Third
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].data.timestamp).toBe(0);
      expect(edges[1].data.timestamp).toBe(1);
      expect(edges[2].data.timestamp).toBe(2);
    });
  });

  describe('Class diagram parsing', () => {
    it('should parse simple class diagram', () => {
      const mermaid = `
classDiagram
    class Animal
    class Dog
    Animal --|> Dog
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('uml-class');
      expect(result.document?.graph.nodes).toHaveLength(2);
      expect(result.document?.graph.edges).toHaveLength(1);
    });

    it('should parse inheritance relationships', () => {
      const mermaid = `
classDiagram
    Vehicle --|> Car
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].data.relationship).toBe('inheritance');
    });

    it('should parse composition and aggregation', () => {
      const mermaid = `
classDiagram
    House --* Room
    University --o Department
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].data.relationship).toBe('composition');
      expect(edges[1].data.relationship).toBe('aggregation');
    });

    it('should handle dotted lines for dependencies', () => {
      const mermaid = `
classDiagram
    ClassA ..> ClassB
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].style?.strokeStyle).toBe('dotted');
    });
  });

  describe('ER diagram parsing', () => {
    it('should parse simple ER diagram', () => {
      const mermaid = `
erDiagram
    CUSTOMER ||--o{ ORDER : places
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('er');
      expect(result.document?.graph.nodes).toHaveLength(2);
      expect(result.document?.graph.edges).toHaveLength(1);
    });

    it('should parse cardinality', () => {
      const mermaid = `
erDiagram
    CUSTOMER ||--o{ ORDER : places
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].data.multiplicity).toBeDefined();
      expect(edges[0].label).toBe('places');
    });
  });

  describe('State diagram parsing', () => {
    it('should parse simple state diagram', () => {
      const mermaid = `
stateDiagram-v2
    [*] --> State1
    State1 --> State2
    State2 --> [*]
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('uml-state');
      expect(result.document?.graph.edges).toHaveLength(3);
    });

    it('should parse state transitions with events', () => {
      const mermaid = `
stateDiagram-v2
    Idle --> Running : start
    Running --> Idle : stop
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      const edges = result.document?.graph.edges || [];
      expect(edges[0].label).toBe('start');
      expect(edges[1].label).toBe('stop');
    });
  });

  describe('Error handling', () => {
    it('should handle empty input', () => {
      const result = fromMermaid('');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Empty input');
    });

    it('should handle unknown diagram type', () => {
      const result = fromMermaid('unknownDiagram\nA --> B');

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toContain('Unknown diagram type');
    });

    it('should handle unimplemented parsers gracefully', () => {
      const result = fromMermaid('timeline\n    2020: Event');

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toContain('not yet supported');
    });
  });

  describe('Comments and whitespace', () => {
    it('should skip comments', () => {
      const mermaid = `
flowchart TD
    %% This is a comment
    A --> B
    %% Another comment
    B --> C
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.graph.edges).toHaveLength(2);
    });

    it('should handle extra whitespace', () => {
      const mermaid = `
flowchart TD
    A   -->   B

    B   -->   C
      `.trim();

      const result = fromMermaid(mermaid);

      expect(result.success).toBe(true);
      expect(result.document?.graph.edges).toHaveLength(2);
    });
  });
});
