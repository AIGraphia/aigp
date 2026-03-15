import { writeFileSync } from 'fs';
import { AIGraphDocument, DiagramType } from '@aigraphia/protocol';

export async function initCommand(type?: string, name?: string) {
  const diagramType = (type || 'flowchart') as DiagramType;
  const diagramName = name || 'my-diagram';

  const document: AIGraphDocument = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: diagramType,
    metadata: {
      title: diagramName,
      description: `New ${diagramType} diagram`,
      author: 'aigp-cli',
      created: new Date().toISOString(),
    },
    graph: {
      nodes: [],
      edges: [],
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB',
    },
  };

  const filename = `${diagramName}.json`;
  writeFileSync(filename, JSON.stringify(document, null, 2));

  console.log(`✓ Created ${filename}`);
  console.log(`  Type: ${diagramType}`);
  console.log(`  Run: aigp validate ${filename}`);
}
