/**
 * PNG Exporter for AIGP diagrams
 * Converts SVG to PNG using Sharp
 */

import { AIGraphDocument } from '@aigraphia/protocol';
import { renderToSVG, SVGRenderOptions } from './svg-renderer.js';
import sharp from 'sharp';

export interface PNGExportOptions extends SVGRenderOptions {
  scale?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

export class PNGExporter {
  private options: PNGExportOptions;

  constructor(options: PNGExportOptions = {}) {
    this.options = {
      scale: options.scale || 2, // 2x for retina
      quality: options.quality || 90,
      format: options.format || 'png',
      ...options,
    };
  }

  /**
   * Export diagram to PNG buffer
   */
  async export(diagram: AIGraphDocument): Promise<Buffer> {
    // First render to SVG
    const svg = await renderToSVG(diagram, this.options);

    // Convert SVG to PNG using Sharp
    const width = (this.options.width || 800) * this.options.scale!;
    const height = (this.options.height || 600) * this.options.scale!;

    const buffer = await sharp(Buffer.from(svg))
      .resize(width, height)
      .toFormat(this.options.format as any, { quality: this.options.quality })
      .toBuffer();

    return buffer;
  }

  /**
   * Export diagram to PNG file
   */
  async exportToFile(diagram: AIGraphDocument, filePath: string): Promise<void> {
    const buffer = await this.export(diagram);
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, buffer);
  }
}

/**
 * Convenience function to export diagram to PNG
 */
export async function exportToPNG(
  diagram: AIGraphDocument,
  options?: PNGExportOptions
): Promise<Buffer> {
  const exporter = new PNGExporter(options);
  return exporter.export(diagram);
}

/**
 * Convenience function to export diagram to PNG file
 */
export async function exportToPNGFile(
  diagram: AIGraphDocument,
  filePath: string,
  options?: PNGExportOptions
): Promise<void> {
  const exporter = new PNGExporter(options);
  await exporter.exportToFile(diagram, filePath);
}
