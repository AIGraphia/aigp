#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { validateCommand } from './commands/validate.js';
import { typesCommand } from './commands/types.js';
import { createExportCommand } from './commands/export.js';

const program = new Command();

program
  .name('aigp')
  .description('Universal AI-Native Diagram System CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new diagram')
  .argument('[type]', 'Diagram type (flowchart, sequence, etc.)')
  .argument('[name]', 'Diagram name')
  .action(initCommand);

program
  .command('validate')
  .description('Validate a diagram file')
  .argument('<file>', 'Path to .json file')
  .action(validateCommand);

program
  .command('types')
  .description('List available diagram types')
  .action(typesCommand);

program.addCommand(createExportCommand());

program.parse();
