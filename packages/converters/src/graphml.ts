/**
 * GraphML importer and exporter for AIGP diagrams
 * GraphML is an XML-based format for graphs used by yEd, Gephi, etc.
 */

import type { AIGraphDocument, Node, Edge } from '@aigp/protocol';

export interface GraphMLImportResult {
  success: boolean;
  document?: AIGraphDocument;
  errors?: string[];
}

/**
 * Import GraphML to AIGP format
 */
export function fromGraphML(graphml: string): GraphMLImportResult {
  try {
    // Parse XML (simplified - would use proper XML parser in production)
    const parser = new DOMParser();
    const doc = parser.parseFromString(graphml, 'text/xml');

    const graphElement = doc.querySelector('graph');
    if (!graphElement) {
      return {
        success: false,
        errors: ['No <graph> element found in GraphML']
      };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Parse nodes
    const nodeElements = doc.querySelectorAll('node');
    nodeElements.forEach((nodeEl: any) => {
      const id = nodeEl.getAttribute('id') || '';
      const labelEl = nodeEl.querySelector('data[key="label"]');
      const label = labelEl?.textContent || id;

      // Extract position if available
      const geometryEl = nodeEl.querySelector('ShapeNode > Geometry');
      let position;
      if (geometryEl) {
        position = {
          x: parseFloat(geometryEl.getAttribute('x') || '0'),
          y: parseFloat(geometryEl.getAttribute('y') || '0')
        };
      }

      nodes.push({
        id,
        type: 'process',
        label,
        data: position ? { custom: { position } } : {}
      });
    });

    // Parse edges
    const edgeElements = doc.querySelectorAll('edge');
    edgeElements.forEach((edgeEl: any, i: number) => {
      const source = edgeEl.getAttribute('source') || '';
      const target = edgeEl.getAttribute('target') || '';
      const labelEl = edgeEl.querySelector('data[key="label"]');
      const label = labelEl?.textContent || undefined;

      edges.push({
        id: `e${i}`,
        source,
        target,
        type: 'flow',
        label,
        data: {}
      });
    });

    const aigpDoc: AIGraphDocument = {
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: 'flowchart',
      metadata: {
        title: 'Imported from GraphML',
        description: 'Converted from GraphML format',
        author: 'GraphML Importer',
        tags: ['graphml', 'imported']
      },
      graph: {
        nodes,
        edges
      },
      layout: {
        algorithm: 'manual',
        direction: 'TB'
      }
    };

    return {
      success: true,
      document: aigpDoc
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}

/**
 * Export AIGP to GraphML format
 */
export function toGraphML(document: AIGraphDocument): string {
  let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
           http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">

  <!-- Keys for attributes -->
  <key id="label" for="all" attr.name="label" attr.type="string"/>
  <key id="type" for="node" attr.name="type" attr.type="string"/>
  <key id="description" for="node" attr.name="description" attr.type="string"/>

  <graph id="G" edgedefault="${document.type === 'network' ? 'undirected' : 'directed'}">
`;

  // Export nodes
  for (const node of document.graph.nodes) {
    graphml += `    <node id="${escapeXML(node.id)}">
      <data key="label">${escapeXML(node.label)}</data>
      <data key="type">${escapeXML(node.type)}</data>
`;

    // Add position data if available
    if (node.data?.custom?.position) {
      graphml += `      <data key="x">${(node.data.custom.position as any).x}</data>
      <data key="y">${(node.data.custom.position as any).y}</data>
`;
    }

    graphml += `    </node>
`;
  }

  // Export edges
  for (const edge of document.graph.edges) {
    graphml += `    <edge id="${escapeXML(edge.id)}" source="${escapeXML(edge.source)}" target="${escapeXML(edge.target)}">
`;

    if (edge.label) {
      graphml += `      <data key="label">${escapeXML(edge.label)}</data>
`;
    }

    graphml += `    </edge>
`;
  }

  graphml += `  </graph>
</graphml>`;

  return graphml;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Browser-compatible DOMParser fallback
const DOMParser = typeof globalThis !== 'undefined' && (globalThis as any).window?.DOMParser
  ? (globalThis as any).window.DOMParser
  : class {
      parseFromString(str: string, type: string) {
        // Node.js fallback - would use xml2js or similar
        throw new Error('XML parsing requires browser environment or xml2js library');
      }
    };
