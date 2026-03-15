/**
 * Performance optimization utilities for large AIGP diagrams
 * Handles diagrams with 1000+ nodes efficiently
 */

import type { AIGraphDocument } from '@aigraphia/protocol';

export interface PerformanceMetrics {
  nodeCount: number;
  edgeCount: number;
  complexity: number;
  estimatedRenderTime: number;
  recommendations: string[];
}

export interface OptimizationOptions {
  maxNodes?: number;
  maxEdges?: number;
  simplifyLabels?: boolean;
  removeOrphans?: boolean;
  mergeParallelEdges?: boolean;
}

/**
 * Analyze diagram performance characteristics
 */
export function analyzePerformance(document: AIGraphDocument): PerformanceMetrics {
  const nodeCount = document.graph.nodes.length;
  const edgeCount = document.graph.edges.length;

  // Calculate complexity score (0-100)
  const nodeFactor = Math.min(nodeCount / 10, 50);
  const edgeFactor = Math.min(edgeCount / 20, 30);
  const densityFactor = edgeCount / Math.max(nodeCount, 1) * 20;
  const complexity = Math.min(nodeFactor + edgeFactor + densityFactor, 100);

  // Estimate render time in ms
  const estimatedRenderTime = Math.max(
    nodeCount * 0.5 + edgeCount * 0.3,
    100
  );

  // Generate recommendations
  const recommendations: string[] = [];

  if (nodeCount > 500) {
    recommendations.push('Consider splitting into multiple diagrams');
  }
  if (nodeCount > 1000) {
    recommendations.push('Use pagination or filtering for navigation');
  }
  if (edgeCount / nodeCount > 3) {
    recommendations.push('Graph is highly connected - consider simplification');
  }
  if (complexity > 70) {
    recommendations.push('Use hierarchical layout for better performance');
  }
  if (nodeCount > 200) {
    recommendations.push('Enable lazy rendering for nodes outside viewport');
  }

  return {
    nodeCount,
    edgeCount,
    complexity,
    estimatedRenderTime,
    recommendations
  };
}

/**
 * Optimize diagram for performance
 */
export function optimizeDiagram(
  document: AIGraphDocument,
  options: OptimizationOptions = {}
): AIGraphDocument {
  const {
    maxNodes = 500,
    maxEdges = 1000,
    simplifyLabels = false,
    removeOrphans = true,
    mergeParallelEdges = true
  } = options;

  let nodes = [...document.graph.nodes];
  let edges = [...document.graph.edges];

  // Remove orphan nodes (no connections)
  if (removeOrphans) {
    const connectedNodes = new Set<string>();
    edges.forEach(e => {
      connectedNodes.add(e.source);
      connectedNodes.add(e.target);
    });
    nodes = nodes.filter(n => connectedNodes.has(n.id));
  }

  // Merge parallel edges (multiple edges between same nodes)
  if (mergeParallelEdges) {
    const edgeMap = new Map<string, any>();
    edges.forEach(edge => {
      const key = `${edge.source}-${edge.target}`;
      if (!edgeMap.has(key)) {
        edgeMap.set(key, edge);
      } else {
        // Merge labels
        const existing = edgeMap.get(key);
        if (edge.label) {
          existing.label = existing.label
            ? `${existing.label}, ${edge.label}`
            : edge.label;
        }
      }
    });
    edges = Array.from(edgeMap.values());
  }

  // Simplify labels for large diagrams
  if (simplifyLabels && nodes.length > 200) {
    nodes = nodes.map(node => ({
      ...node,
      label: truncateLabel(node.label, 30)
    }));
    edges = edges.map(edge => ({
      ...edge,
      label: edge.label ? truncateLabel(edge.label, 20) : undefined
    }));
  }

  // Trim to max nodes/edges if needed
  if (nodes.length > maxNodes) {
    nodes = nodes.slice(0, maxNodes);
  }
  if (edges.length > maxEdges) {
    edges = edges.slice(0, maxEdges);
  }

  return {
    ...document,
    graph: {
      ...document.graph,
      nodes,
      edges
    }
  };
}

/**
 * Paginate large diagram into chunks
 */
export function paginateDiagram(
  document: AIGraphDocument,
  pageSize: number = 100
): AIGraphDocument[] {
  const pages: AIGraphDocument[] = [];
  const nodes = document.graph.nodes;
  const edges = document.graph.edges;

  const pageCount = Math.ceil(nodes.length / pageSize);

  for (let i = 0; i < pageCount; i++) {
    const startIdx = i * pageSize;
    const endIdx = Math.min((i + 1) * pageSize, nodes.length);
    const pageNodes = nodes.slice(startIdx, endIdx);
    const pageNodeIds = new Set(pageNodes.map(n => n.id));

    // Include edges where both endpoints are in this page
    const pageEdges = edges.filter(e =>
      pageNodeIds.has(e.source) && pageNodeIds.has(e.target)
    );

    pages.push({
      ...document,
      metadata: {
        ...document.metadata,
        title: `${document.metadata.title} (Page ${i + 1}/${pageCount})`
      },
      graph: {
        nodes: pageNodes,
        edges: pageEdges
      }
    });
  }

  return pages;
}

/**
 * Filter diagram by depth from root nodes
 */
export function filterByDepth(
  document: AIGraphDocument,
  maxDepth: number
): AIGraphDocument {
  const edges = document.graph.edges;
  const nodes = document.graph.nodes;

  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Map<string, number>();
  edges.forEach(e => {
    incomingEdges.set(e.target, (incomingEdges.get(e.target) || 0) + 1);
  });

  const roots = nodes.filter(n => !incomingEdges.has(n.id)).map(n => n.id);

  if (roots.length === 0 && nodes.length > 0) {
    // No clear roots, use first node
    roots.push(nodes[0].id);
  }

  // BFS to find nodes within maxDepth
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = roots.map(id => ({ id, depth: 0 }));
  const includedNodes = new Set<string>();

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (visited.has(id) || depth > maxDepth) continue;
    visited.add(id);
    includedNodes.add(id);

    // Add children
    edges
      .filter(e => e.source === id)
      .forEach(e => {
        if (!visited.has(e.target)) {
          queue.push({ id: e.target, depth: depth + 1 });
        }
      });
  }

  const filteredNodes = nodes.filter(n => includedNodes.has(n.id));
  const filteredEdges = edges.filter(e =>
    includedNodes.has(e.source) && includedNodes.has(e.target)
  );

  return {
    ...document,
    graph: {
      nodes: filteredNodes,
      edges: filteredEdges
    }
  };
}

/**
 * Compress diagram by removing redundant information
 */
export function compressDiagram(document: AIGraphDocument): AIGraphDocument {
  return {
    schema: document.schema,
    version: document.version,
    type: document.type,
    metadata: {
      title: document.metadata.title,
      description: document.metadata.description
    },
    graph: {
      nodes: document.graph.nodes.map(n => ({
        id: n.id,
        type: n.type,
        label: n.label,
        data: n.data || {}
      })),
      edges: document.graph.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type || 'flow',
        data: e.data || {}
      }))
    },
    layout: document.layout || { algorithm: 'hierarchical', direction: 'TB' }
  };
}

/**
 * Detect performance bottlenecks
 */
export function detectBottlenecks(document: AIGraphDocument): string[] {
  const issues: string[] = [];
  const nodes = document.graph.nodes;
  const edges = document.graph.edges;

  // Check for hot spots (nodes with many connections)
  const connectionCounts = new Map<string, number>();
  edges.forEach(e => {
    connectionCounts.set(e.source, (connectionCounts.get(e.source) || 0) + 1);
    connectionCounts.set(e.target, (connectionCounts.get(e.target) || 0) + 1);
  });

  const hotSpots = Array.from(connectionCounts.entries())
    .filter(([, count]) => count > 20)
    .map(([id]) => id);

  if (hotSpots.length > 0) {
    issues.push(`Hot spots detected: ${hotSpots.length} nodes with 20+ connections`);
  }

  // Check for long labels
  const longLabels = nodes.filter(n => n.label.length > 50).length;
  if (longLabels > nodes.length * 0.2) {
    issues.push(`${longLabels} nodes have labels > 50 characters`);
  }

  // Check for deep hierarchies
  const maxDepth = calculateMaxDepth(document);
  if (maxDepth > 10) {
    issues.push(`Deep hierarchy detected: ${maxDepth} levels`);
  }

  // Check for disconnected components
  const components = findConnectedComponents(document);
  if (components.length > 5) {
    issues.push(`${components.length} disconnected components - consider splitting diagrams`);
  }

  return issues;
}

// Helper functions

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + '...';
}

function calculateMaxDepth(document: AIGraphDocument): number {
  const edges = document.graph.edges;
  const nodes = document.graph.nodes;

  if (nodes.length === 0) return 0;

  const adjList = new Map<string, string[]>();
  edges.forEach(e => {
    if (!adjList.has(e.source)) adjList.set(e.source, []);
    adjList.get(e.source)!.push(e.target);
  });

  let maxDepth = 0;

  function dfs(nodeId: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    maxDepth = Math.max(maxDepth, depth);

    const children = adjList.get(nodeId) || [];
    children.forEach(child => dfs(child, depth + 1, visited));
  }

  nodes.forEach(n => dfs(n.id, 0, new Set()));

  return maxDepth;
}

function findConnectedComponents(document: AIGraphDocument): string[][] {
  const nodes = document.graph.nodes;
  const edges = document.graph.edges;

  const adjList = new Map<string, Set<string>>();
  nodes.forEach(n => adjList.set(n.id, new Set()));
  edges.forEach(e => {
    adjList.get(e.source)?.add(e.target);
    adjList.get(e.target)?.add(e.source);
  });

  const visited = new Set<string>();
  const components: string[][] = [];

  function dfs(nodeId: string, component: string[]) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    component.push(nodeId);

    const neighbors = adjList.get(nodeId) || new Set();
    neighbors.forEach(neighbor => dfs(neighbor, component));
  }

  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      const component: string[] = [];
      dfs(n.id, component);
      components.push(component);
    }
  });

  return components;
}
