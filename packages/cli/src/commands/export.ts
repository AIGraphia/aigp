/**
 * Export command - export AIGP diagrams to various formats
 */

import { Command } from 'commander';
import { readFile, writeFile } from 'fs/promises';
import { resolve, extname } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { renderToSVG, exportToPNGFile } from '@aigp/export';
import type { AIGraphDocument } from '@aigp/protocol';

export function createExportCommand(): Command {
  const exportCmd = new Command('export')
    .description('Export AIGP diagrams to various formats');

  // SVG export command
  exportCmd
    .command('svg')
    .description('Export diagram to SVG format')
    .argument('<input>', 'Input AIGP diagram file (.json)')
    .option('-o, --output <file>', 'Output SVG file (default: input.svg)')
    .option('-w, --width <pixels>', 'SVG width', '800')
    .option('-h, --height <pixels>', 'SVG height', '600')
    .option('-p, --padding <pixels>', 'Padding around diagram', '20')
    .option('-b, --background <color>', 'Background color', '#ffffff')
    .option('--no-viewbox', 'Disable viewBox attribute')
    .action(async (input: string, options: any) => {
      const spinner = ora('Exporting to SVG...').start();

      try {
        // Read input file
        const inputPath = resolve(process.cwd(), input);
        const fileContent = await readFile(inputPath, 'utf-8');
        const diagram: AIGraphDocument = JSON.parse(fileContent);

        // Determine output path
        const outputPath = options.output
          ? resolve(process.cwd(), options.output)
          : inputPath.replace(/\.json$/, '.svg');

        // Render to SVG
        const svg = await renderToSVG(diagram, {
          width: parseInt(options.width, 10),
          height: parseInt(options.height, 10),
          padding: parseInt(options.padding, 10),
          backgroundColor: options.background,
          viewBox: options.viewbox !== false,
        });

        // Write output file
        await writeFile(outputPath, svg, 'utf-8');

        spinner.succeed(chalk.green(`✓ Exported to ${chalk.bold(outputPath)}`));
      } catch (error) {
        spinner.fail(chalk.red('✗ Export failed'));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });

  // PNG export command
  exportCmd
    .command('png')
    .description('Export diagram to PNG format')
    .argument('<input>', 'Input AIGP diagram file (.json)')
    .option('-o, --output <file>', 'Output PNG file (default: input.png)')
    .option('-w, --width <pixels>', 'Image width', '800')
    .option('-h, --height <pixels>', 'Image height', '600')
    .option('-p, --padding <pixels>', 'Padding around diagram', '20')
    .option('-b, --background <color>', 'Background color', '#ffffff')
    .option('-s, --scale <factor>', 'Scale factor (2 = retina)', '2')
    .option('-q, --quality <percent>', 'Image quality (1-100)', '90')
    .option('-f, --format <type>', 'Output format: png, jpeg, webp', 'png')
    .action(async (input: string, options: any) => {
      const spinner = ora('Exporting to PNG...').start();

      try {
        // Read input file
        const inputPath = resolve(process.cwd(), input);
        const fileContent = await readFile(inputPath, 'utf-8');
        const diagram: AIGraphDocument = JSON.parse(fileContent);

        // Determine output path
        let outputPath: string;
        if (options.output) {
          outputPath = resolve(process.cwd(), options.output);
        } else {
          const ext = options.format === 'jpeg' ? '.jpg' : `.${options.format}`;
          outputPath = inputPath.replace(/\.json$/, ext);
        }

        // Export to PNG/JPEG/WebP
        await exportToPNGFile(diagram, outputPath, {
          width: parseInt(options.width, 10),
          height: parseInt(options.height, 10),
          padding: parseInt(options.padding, 10),
          backgroundColor: options.background,
          scale: parseFloat(options.scale),
          quality: parseInt(options.quality, 10),
          format: options.format,
        });

        spinner.succeed(chalk.green(`✓ Exported to ${chalk.bold(outputPath)}`));
      } catch (error) {
        spinner.fail(chalk.red('✗ Export failed'));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });

  return exportCmd;
}
