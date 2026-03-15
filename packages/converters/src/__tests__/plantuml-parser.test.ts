import { describe, it, expect } from 'vitest';
import { fromPlantUML } from '../plantuml-parser';

describe('PlantUML Parser', () => {
  describe('Sequence Diagrams', () => {
    it('should parse basic sequence diagram', () => {
      const plantuml = `
@startuml
participant Alice
participant Bob
Alice -> Bob: Hello
Bob --> Alice: Hi there
@enduml
      `.trim();

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('sequence');
      expect(result.document?.graph.nodes).toHaveLength(2);
      expect(result.document?.graph.edges).toHaveLength(2);
    });

    it('should handle actor types', () => {
      const plantuml = `
@startuml
actor User
database DB
User -> DB: Query
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.graph.nodes[0].data.participantType).toBe('actor');
      expect(result.document?.graph.nodes[1].data.participantType).toBe('database');
    });

    it('should parse sync and async messages', () => {
      const plantuml = `
@startuml
A -> B: Sync
A --> B: Async
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.graph.edges[0].data.messageType).toBe('sync');
      expect(result.document?.graph.edges[1].data.messageType).toBe('async');
    });
  });

  describe('Class Diagrams', () => {
    it('should parse basic class diagram', () => {
      const plantuml = `
@startuml
class Animal
class Dog
Animal <|-- Dog
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('uml-class');
      expect(result.document?.graph.nodes).toHaveLength(2);
      expect(result.document?.graph.edges[0].type).toBe('inheritance');
    });

    it('should parse class members', () => {
      const plantuml = `
@startuml
class User {
  +name: string
  +email: string
  +login()
  +logout()
}
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      const userClass = result.document?.graph.nodes[0];
      expect(userClass?.data.attributes).toHaveLength(2);
      expect(userClass?.data.methods).toHaveLength(2);
    });

    it('should handle different relationship types', () => {
      const plantuml = `
@startuml
A --|> B
C --* D
E --o F
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.graph.edges[0].type).toBe('inheritance');
      expect(result.document?.graph.edges[1].type).toBe('composition');
      expect(result.document?.graph.edges[2].type).toBe('aggregation');
    });
  });

  describe('Activity Diagrams', () => {
    it('should parse basic activity diagram', () => {
      const plantuml = `
@startuml
start
:Process Order;
:Send Confirmation;
stop
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      expect(result.document?.type).toBe('flowchart');
      expect(result.document?.graph.nodes[0].type).toBe('start');
      expect(result.document?.graph.nodes[3].type).toBe('end');
    });

    it('should handle decision points', () => {
      const plantuml = `
@startuml
start
if (Valid?) then
  :Process;
endif
stop
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(true);
      const decisionNode = result.document?.graph.nodes.find(n => n.type === 'decision');
      expect(decisionNode).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid PlantUML syntax', () => {
      const result = fromPlantUML('invalid syntax');
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle empty input', () => {
      const result = fromPlantUML('');
      expect(result.success).toBe(false);
    });

    it('should handle unsupported diagram types', () => {
      const plantuml = `
@startuml
@startmindmap
+ Root
++ Branch
@endmindmap
@enduml
      `;

      const result = fromPlantUML(plantuml);
      expect(result.success).toBe(false);
    });
  });
});
