/**
 * SVG Renderer for AIGP diagrams
 * Converts AIGraphDocument to SVG format
 */

import { AIGraphDocument, Node, Edge, Group } from '@aigraphia/protocol';
import { applyLayout } from '@aigraphia/layout';

export interface SVGRenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  backgroundColor?: string;
  includeStyles?: boolean;
  viewBox?: boolean;
}

export class SVGRenderer {
  private options: Required<SVGRenderOptions>;

  constructor(options: SVGRenderOptions = {}) {
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      padding: options.padding || 20,
      backgroundColor: options.backgroundColor || '#ffffff',
      includeStyles: options.includeStyles !== false,
      viewBox: options.viewBox !== false,
    };
  }

  /**
   * Render an AIGP diagram to SVG string
   */
  async render(diagram: AIGraphDocument): Promise<string> {
    // Apply layout if nodes don't have positions
    const layoutDiagram = await this.ensureLayout(diagram);

    // Calculate bounds
    const bounds = this.calculateBounds(layoutDiagram);

    // Start SVG
    const svg: string[] = [];
    svg.push(this.renderSVGHeader(bounds));

    // Render defs (arrow markers, etc.)
    svg.push(this.renderDefs());

    // Render background
    if (this.options.backgroundColor !== 'transparent') {
      svg.push(this.renderBackground(bounds));
    }

    // Render groups (containers)
    if (layoutDiagram.graph.groups) {
      for (const group of layoutDiagram.graph.groups) {
        svg.push(this.renderGroup(group, layoutDiagram.graph.nodes));
      }
    }

    // Render edges
    for (const edge of layoutDiagram.graph.edges) {
      svg.push(this.renderEdge(edge, layoutDiagram.graph.nodes));
    }

    // Render nodes
    for (const node of layoutDiagram.graph.nodes) {
      svg.push(this.renderNode(node));
    }

    // Close SVG
    svg.push('</svg>');

    return svg.join('\n');
  }

  private async ensureLayout(diagram: AIGraphDocument): Promise<AIGraphDocument> {
    // Check if all nodes have positions
    const allHavePositions = diagram.graph.nodes.every(n => n.position);

    if (allHavePositions) {
      return diagram;
    }

    // Apply layout
    return applyLayout(diagram);
  }

  private calculateBounds(diagram: AIGraphDocument) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of diagram.graph.nodes) {
      if (node.position) {
        const x = node.position.x;
        const y = node.position.y;
        const width = node.size?.width || 100;
        const height = node.size?.height || 50;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      }
    }

    // Add padding
    const padding = this.options.padding;
    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  }

  private renderSVGHeader(bounds: any): string {
    const viewBox = this.options.viewBox
      ? `viewBox="${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}"`
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg"
      width="${this.options.width}"
      height="${this.options.height}"
      ${viewBox}>`;
  }

  private renderBackground(bounds: any): string {
    return `<rect x="${bounds.minX}" y="${bounds.minY}"
      width="${bounds.width}" height="${bounds.height}"
      fill="${this.options.backgroundColor}"/>`;
  }

  private renderGroup(group: Group, nodes: Node[]): string {
    // Find group bounds from contained nodes
    const groupNodes = nodes.filter(n => group.nodeIds.includes(n.id));
    if (groupNodes.length === 0) return '';

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of groupNodes) {
      if (node.position) {
        minX = Math.min(minX, node.position.x);
        minY = Math.min(minY, node.position.y);
        maxX = Math.max(maxX, node.position.x + (node.size?.width || 100));
        maxY = Math.max(maxY, node.position.y + (node.size?.height || 50));
      }
    }

    const padding = 10;
    const x = minX - padding;
    const y = minY - padding;
    const width = maxX - minX + 2 * padding;
    const height = maxY - minY + 2 * padding;

    const style = group.style || {};
    const bg = style.backgroundColor || '#f5f5f5';
    const borderColor = style.borderColor || '#cccccc';
    const borderWidth = style.borderWidth || 1;
    const borderStyle = style.borderStyle || 'solid';
    const opacity = style.opacity || 0.5;

    const strokeDasharray = borderStyle === 'dashed' ? 'stroke-dasharray="5,5"' : '';

    return `<g class="group" id="${group.id}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}"
        fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"
        opacity="${opacity}" ${strokeDasharray}/>
      <text x="${x + padding}" y="${y - 5}"
        font-size="12" fill="${style.textColor || '#333333'}">
        ${this.escapeXML(group.label)}
      </text>
    </g>`;
  }

  private renderNode(node: Node): string {
    if (!node.position) return '';

    const x = node.position.x;
    const y = node.position.y;
    const width = node.size?.width || 100;
    const height = node.size?.height || 50;

    const style = node.style || {};
    const shape = style.shape || 'rectangle';
    const bg = style.backgroundColor || '#ffffff';
    const borderColor = style.borderColor || '#333333';
    const borderWidth = style.borderWidth || 2;
    const textColor = style.textColor || '#000000';

    let shapeElement = '';

    switch (shape) {
      case 'circle':
      case 'ellipse':
        const cx = x + width / 2;
        const cy = y + height / 2;
        const ellipseRx = width / 2;
        const ellipseRy = height / 2;
        shapeElement = `<ellipse cx="${cx}" cy="${cy}" rx="${ellipseRx}" ry="${ellipseRy}"
          fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
        break;

      case 'diamond':
        const points = [
          `${x + width / 2},${y}`,
          `${x + width},${y + height / 2}`,
          `${x + width / 2},${y + height}`,
          `${x},${y + height / 2}`
        ].join(' ');
        shapeElement = `<polygon points="${points}"
          fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
        break;

      case 'hexagon':
        const hexPoints = [
          `${x + width * 0.25},${y}`,
          `${x + width * 0.75},${y}`,
          `${x + width},${y + height / 2}`,
          `${x + width * 0.75},${y + height}`,
          `${x + width * 0.25},${y + height}`,
          `${x},${y + height / 2}`
        ].join(' ');
        shapeElement = `<polygon points="${hexPoints}"
          fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
        break;

      default: // rectangle
        const rx = style.shape === 'rectangle' ? '5' : '0';
        shapeElement = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}"
          fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
    }

    // Text
    const textX = x + width / 2;
    const textY = y + height / 2 + 5; // Rough vertical centering
    const fontSize = style.fontSize || 14;

    return `<g class="node" id="${node.id}">
      ${shapeElement}
      <text x="${textX}" y="${textY}"
        text-anchor="middle"
        font-size="${fontSize}"
        fill="${textColor}">
        ${this.escapeXML(node.label)}
      </text>
    </g>`;
  }

  private renderEdge(edge: Edge, nodes: Node[]): string {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);

    if (!source?.position || !target?.position) return '';

    const sourceX = source.position.x + (source.size?.width || 100) / 2;
    const sourceY = source.position.y + (source.size?.height || 50) / 2;
    const targetX = target.position.x + (target.size?.width || 100) / 2;
    const targetY = target.position.y + (target.size?.height || 50) / 2;

    const style = edge.style || {};
    const strokeColor = style.strokeColor || '#333333';
    const strokeWidth = style.strokeWidth || 2;
    const strokeStyle = style.strokeStyle || 'solid';
    const curved = style.curved || false;

    const strokeDasharray = strokeStyle === 'dashed'
      ? 'stroke-dasharray="5,5"'
      : strokeStyle === 'dotted'
      ? 'stroke-dasharray="2,2"'
      : '';

    let path = '';
    if (curved) {
      // Simple curve using quadratic bezier
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      const offsetX = (targetY - sourceY) * 0.2;
      const offsetY = (sourceX - targetX) * 0.2;
      const ctrlX = midX + offsetX;
      const ctrlY = midY + offsetY;
      path = `M ${sourceX},${sourceY} Q ${ctrlX},${ctrlY} ${targetX},${targetY}`;
    } else {
      path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    }

    // Arrow marker
    const markerEnd = style.arrowEnd !== 'none' ? 'marker-end="url(#arrowhead)"' : '';

    const label = edge.label ? `<text x="${(sourceX + targetX) / 2}" y="${(sourceY + targetY) / 2 - 5}"
      text-anchor="middle" font-size="12" fill="${style.textColor || '#666666'}">
      ${this.escapeXML(edge.label)}
    </text>` : '';

    return `<g class="edge" id="${edge.id}">
      <path d="${path}"
        fill="none"
        stroke="${strokeColor}"
        stroke-width="${strokeWidth}"
        ${strokeDasharray}
        ${markerEnd}/>
      ${label}
    </g>`;
  }

  private renderDefs(): string {
    return `<defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10"
        refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#333333"/>
      </marker>
    </defs>`;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Convenience function to render diagram to SVG
 */
export async function renderToSVG(
  diagram: AIGraphDocument,
  options?: SVGRenderOptions
): Promise<string> {
  const renderer = new SVGRenderer(options);
  return renderer.render(diagram);
}
