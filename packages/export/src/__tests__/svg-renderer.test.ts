import { describe, it, expect } from 'vitest';
import { renderToSVG } from '../svg-renderer';
import { AIGraphDocument } from '@aigp/protocol';

describe('SVG Renderer', () => {
  const simpleDiagram: AIGraphDocument = {
    version: '1.0.0',
    type: 'flowchart',
    metadata: {
      title: 'Test Diagram',
    },
    graph: {
      nodes: [
        {
          id: 'node1',
          type: 'process',
          label: 'Start',
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
          data: {},
          style: {
            backgroundColor: '#4caf50',
            textColor: '#ffffff',
          },
        },
        {
          id: 'node2',
          type: 'process',
          label: 'End',
          position: { x: 200, y: 0 },
          size: { width: 100, height: 50 },
          data: {},
          style: {
            backgroundColor: '#f44336',
            textColor: '#ffffff',
          },
        },
      ],
      edges: [
        {
          id: 'edge1',
          type: 'flow',
          source: 'node1',
          target: 'node2',
          label: 'next',
          data: {},
          style: {
            strokeColor: '#333333',
            strokeWidth: 2,
          },
        },
      ],
    },
    layout: {
      algorithm: 'manual',
    },
  };

  it('should render a simple diagram to SVG', async () => {
    const svg = await renderToSVG(simpleDiagram);

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should include nodes in SVG', async () => {
    const svg = await renderToSVG(simpleDiagram);

    expect(svg).toContain('Start');
    expect(svg).toContain('End');
    expect(svg).toContain('class="node"');
  });

  it('should include edges in SVG', async () => {
    const svg = await renderToSVG(simpleDiagram);

    expect(svg).toContain('class="edge"');
    expect(svg).toContain('next');
  });

  it('should apply custom dimensions', async () => {
    const svg = await renderToSVG(simpleDiagram, {
      width: 1000,
      height: 800,
    });

    expect(svg).toContain('width="1000"');
    expect(svg).toContain('height="800"');
  });

  it('should handle different shapes', async () => {
    const diagram: AIGraphDocument = {
      ...simpleDiagram,
      graph: {
        ...simpleDiagram.graph,
        nodes: [
          {
            ...simpleDiagram.graph.nodes[0],
            style: { ...simpleDiagram.graph.nodes[0].style, shape: 'circle' },
          },
          {
            ...simpleDiagram.graph.nodes[1],
            style: { ...simpleDiagram.graph.nodes[1].style, shape: 'diamond' },
          },
        ],
      },
    };

    const svg = await renderToSVG(diagram);

    expect(svg).toContain('<ellipse');
    expect(svg).toContain('<polygon');
  });

  it('should escape XML special characters', async () => {
    const diagram: AIGraphDocument = {
      ...simpleDiagram,
      graph: {
        ...simpleDiagram.graph,
        nodes: [
          {
            ...simpleDiagram.graph.nodes[0],
            label: 'Test & <special> "characters"',
          },
        ],
        edges: [],
      },
    };

    const svg = await renderToSVG(diagram);

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
    expect(svg).toContain('&quot;');
  });

  it('should apply background color', async () => {
    const svg = await renderToSVG(simpleDiagram, {
      backgroundColor: '#f0f0f0',
    });

    expect(svg).toContain('fill="#f0f0f0"');
  });

  it('should handle transparent background', async () => {
    const svg = await renderToSVG(simpleDiagram, {
      backgroundColor: 'transparent',
    });

    // Should not have a background rect
    const rectCount = (svg.match(/<rect/g) || []).length;
    // Only node rects, no background rect
    expect(rectCount).toBe(2);
  });
});
