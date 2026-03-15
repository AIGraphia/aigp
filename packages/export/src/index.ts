/**
 * AIGP Export Package
 * SVG and PNG export functionality for AIGP diagrams
 */

export { SVGRenderer, renderToSVG } from './svg-renderer.js';
export type { SVGRenderOptions } from './svg-renderer.js';
export { PNGExporter, exportToPNG, exportToPNGFile } from './png-exporter.js';
export type { PNGExportOptions } from './png-exporter.js';

// Re-export types from protocol for convenience
export type { AIGraphDocument, Node, Edge, Group } from '@aigraphia/protocol';
