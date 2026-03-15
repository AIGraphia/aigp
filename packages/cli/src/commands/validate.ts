import { readFileSync } from 'fs';
import { validateFull } from '@aigraphia/protocol';

export async function validateCommand(file: string) {
  try {
    const content = readFileSync(file, 'utf-8');
    const data = JSON.parse(content);

    const result = validateFull(data);

    if (result.valid) {
      console.log('✓ Diagram is valid');
      if (result.document) {
        console.log(`  Type: ${result.document.type}`);
        console.log(`  Nodes: ${result.document.graph.nodes.length}`);
        console.log(`  Edges: ${result.document.graph.edges.length}`);
      }
    } else {
      console.error('✗ Validation failed:');
      result.errors?.forEach((error) => {
        console.error(`  - ${error.path}: ${error.message}`);
      });
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error:', (error as Error).message);
    process.exit(1);
  }
}
