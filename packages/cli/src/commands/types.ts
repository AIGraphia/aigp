import { registry } from '@aigp/plugins';

export async function typesCommand() {
  const plugins = registry.list();

  console.log('Available diagram types:\n');

  plugins.forEach((plugin) => {
    console.log(`  ${plugin.type.padEnd(20)} - ${plugin.description}`);
  });

  console.log(`\nTotal: ${plugins.length} types`);
  console.log('\nUsage: aigp init <type> <name>');
}
