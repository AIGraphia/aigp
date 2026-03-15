# AIGP Layout Engine Contribution Guide

## Overview

Complete guide for contributing custom layout algorithms to AIGP. This guide covers layout engine architecture, algorithm implementation, optimization techniques, and contribution process.

---

## Layout Engine Architecture

### Core Interface

```typescript
interface LayoutEngine {
  name: string;                                     // Unique identifier
  type: LayoutType;                                 // Category of layout
  apply(graph: Graph, options?: LayoutOptions): LayoutResult;
  validate(graph: Graph): boolean;                  // Check if applicable
  getDefaultOptions(): LayoutOptions;               // Default configuration
  estimatePerformance(nodeCount: number): PerformanceEstimate;
}

type LayoutType =
  | 'hierarchical'
  | 'force-directed'
  | 'circular'
  | 'tree'
  | 'grid'
  | 'custom';

interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'BT' | 'RL';           // Top-Bottom, Left-Right, etc.
  spacing?: number;                                 // General spacing
  nodeSpacing?: number;                             // Space between nodes
  rankSpacing?: number;                             // Space between ranks/levels
  iterations?: number;                              // For iterative algorithms
  padding?: number;                                 // Container padding
  centerGraph?: boolean;                            // Center in viewport
  animation?: AnimationConfig;                      // Animation settings
}

interface LayoutResult {
  positions: Record<string, Position>;              // Node positions
  edgePaths?: Record<string, PathData>;             // Optional edge routing
  bounds: BoundingBox;                              // Overall bounds
  metadata?: {
    iterations?: number;
    convergenceScore?: number;
    computeTime?: number;
  };
}

interface Position {
  x: number;
  y: number;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
```

---

## Creating a Layout Engine

### Example: Radial Layout

**radial-layout.ts:**

```typescript
import type { Graph, LayoutEngine, LayoutOptions, LayoutResult } from '@aigraphia/protocol';

export class RadialLayoutEngine implements LayoutEngine {
  name = 'radial';
  type = 'circular';

  apply(graph: Graph, options: LayoutOptions = {}): LayoutResult {
    const {
      spacing = 100,
      centerGraph = true,
      padding = 50
    } = options;

    // Find root node (or use first node)
    const rootNode = this.findRootNode(graph);
    if (!rootNode) {
      throw new Error('Cannot apply radial layout: no root node found');
    }

    // Build hierarchy from root
    const hierarchy = this.buildHierarchy(graph, rootNode.id);

    // Calculate positions for each level
    const positions: Record<string, Position> = {};
    const centerX = 500; // Will be adjusted if centerGraph is false
    const centerY = 500;

    this.layoutLevel(hierarchy, positions, centerX, centerY, spacing);

    // Calculate bounds
    const bounds = this.calculateBounds(positions, padding);

    // Center if requested
    if (centerGraph) {
      this.centerPositions(positions, bounds);
    }

    return {
      positions,
      bounds,
      metadata: {
        computeTime: Date.now() - startTime
      }
    };
  }

  validate(graph: Graph): boolean {
    // Radial layout works best for tree-like structures
    // Check for cycles (radial layout assumes DAG)
    return !this.hasCycles(graph);
  }

  getDefaultOptions(): LayoutOptions {
    return {
      spacing: 100,
      padding: 50,
      centerGraph: true
    };
  }

  estimatePerformance(nodeCount: number): PerformanceEstimate {
    // Radial layout is O(n) where n is number of nodes
    const timeMs = nodeCount * 0.5; // ~0.5ms per node
    const memoryMB = nodeCount * 0.001; // ~1KB per node

    return {
      estimatedTimeMs: timeMs,
      estimatedMemoryMB: memoryMB,
      complexity: 'O(n)',
      suitable: nodeCount < 1000
    };
  }

  // ========== Private Methods ==========

  private findRootNode(graph: Graph): Node | null {
    // Find node with no incoming edges
    const incomingCounts = new Map<string, number>();

    graph.nodes.forEach(node => incomingCounts.set(node.id, 0));

    graph.edges?.forEach(edge => {
      const count = incomingCounts.get(edge.target) || 0;
      incomingCounts.set(edge.target, count + 1);
    });

    // Find node with zero incoming edges
    for (const [nodeId, count] of incomingCounts.entries()) {
      if (count === 0) {
        return graph.nodes.find(n => n.id === nodeId) || null;
      }
    }

    // If no root found, use first node
    return graph.nodes[0] || null;
  }

  private buildHierarchy(graph: Graph, rootId: string): HierarchyNode {
    const visited = new Set<string>();
    const adjacency = this.buildAdjacencyList(graph);

    const buildNode = (nodeId: string, level: number): HierarchyNode => {
      visited.add(nodeId);

      const children: HierarchyNode[] = [];
      const neighbors = adjacency.get(nodeId) || [];

      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          children.push(buildNode(neighborId, level + 1));
        }
      }

      return {
        id: nodeId,
        level,
        children
      };
    };

    return buildNode(rootId, 0);
  }

  private buildAdjacencyList(graph: Graph): Map<string, string[]> {
    const adjacency = new Map<string, string[]>();

    graph.nodes.forEach(node => adjacency.set(node.id, []));

    graph.edges?.forEach(edge => {
      const neighbors = adjacency.get(edge.source) || [];
      neighbors.push(edge.target);
      adjacency.set(edge.source, neighbors);
    });

    return adjacency;
  }

  private layoutLevel(
    node: HierarchyNode,
    positions: Record<string, Position>,
    centerX: number,
    centerY: number,
    spacing: number,
    startAngle = 0,
    endAngle = 2 * Math.PI
  ): void {
    // Place current node
    const radius = node.level * spacing;
    const angle = startAngle;

    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };

    // Place children in circular arc
    if (node.children.length > 0) {
      const angleStep = (endAngle - startAngle) / node.children.length;

      node.children.forEach((child, index) => {
        const childStartAngle = startAngle + index * angleStep;
        const childEndAngle = childStartAngle + angleStep;

        this.layoutLevel(
          child,
          positions,
          centerX,
          centerY,
          spacing,
          childStartAngle,
          childEndAngle
        );
      });
    }
  }

  private hasCycles(graph: Graph): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const adjacency = this.buildAdjacencyList(graph);

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjacency.get(nodeId) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true; // Cycle detected
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }

  private calculateBounds(
    positions: Record<string, Position>,
    padding: number
  ): BoundingBox {
    const coords = Object.values(positions);

    const minX = Math.min(...coords.map(p => p.x)) - padding;
    const minY = Math.min(...coords.map(p => p.y)) - padding;
    const maxX = Math.max(...coords.map(p => p.x)) + padding;
    const maxY = Math.max(...coords.map(p => p.y)) + padding;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private centerPositions(
    positions: Record<string, Position>,
    bounds: BoundingBox
  ): void {
    const offsetX = -bounds.minX;
    const offsetY = -bounds.minY;

    for (const pos of Object.values(positions)) {
      pos.x += offsetX;
      pos.y += offsetY;
    }

    bounds.minX = 0;
    bounds.minY = 0;
    bounds.maxX = bounds.width;
    bounds.maxY = bounds.height;
  }
}

interface HierarchyNode {
  id: string;
  level: number;
  children: HierarchyNode[];
}

interface PerformanceEstimate {
  estimatedTimeMs: number;
  estimatedMemoryMB: number;
  complexity: string;
  suitable: boolean;
}
```

---

## Advanced Techniques

### 1. Force-Directed Layout

```typescript
export class ForceDirectedLayout implements LayoutEngine {
  name = 'force-directed';
  type = 'force-directed';

  apply(graph: Graph, options: LayoutOptions = {}): LayoutResult {
    const {
      iterations = 100,
      repulsion = 100,
      attraction = 0.1,
      damping = 0.9,
      temperature = 100
    } = options;

    // Initialize positions randomly
    const positions = this.initializePositions(graph);
    const velocities = this.initializeVelocities(graph);

    // Simulation loop
    let temp = temperature;

    for (let i = 0; i < iterations; i++) {
      // Calculate forces
      const forces = this.calculateForces(graph, positions, {
        repulsion,
        attraction
      });

      // Update positions
      this.updatePositions(positions, velocities, forces, damping);

      // Cool down
      temp *= 0.95;

      // Early stopping if converged
      if (this.hasConverged(velocities, temp)) {
        break;
      }
    }

    return {
      positions,
      bounds: this.calculateBounds(positions, 50),
      metadata: {
        iterations: i,
        convergenceScore: this.calculateConvergence(velocities)
      }
    };
  }

  private calculateForces(
    graph: Graph,
    positions: Record<string, Position>,
    params: { repulsion: number; attraction: number }
  ): Record<string, Force> {
    const forces: Record<string, Force> = {};

    // Initialize forces
    graph.nodes.forEach(node => {
      forces[node.id] = { fx: 0, fy: 0 };
    });

    // Repulsive forces (all pairs)
    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const node1 = graph.nodes[i];
        const node2 = graph.nodes[j];

        const pos1 = positions[node1.id];
        const pos2 = positions[node2.id];

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = params.repulsion / (distance * distance);

        forces[node1.id].fx -= (dx / distance) * force;
        forces[node1.id].fy -= (dy / distance) * force;
        forces[node2.id].fx += (dx / distance) * force;
        forces[node2.id].fy += (dy / distance) * force;
      }
    }

    // Attractive forces (connected pairs)
    graph.edges?.forEach(edge => {
      const pos1 = positions[edge.source];
      const pos2 = positions[edge.target];

      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const force = distance * params.attraction;

      forces[edge.source].fx += (dx / distance) * force;
      forces[edge.source].fy += (dy / distance) * force;
      forces[edge.target].fx -= (dx / distance) * force;
      forces[edge.target].fy -= (dy / distance) * force;
    });

    return forces;
  }

  private updatePositions(
    positions: Record<string, Position>,
    velocities: Record<string, Velocity>,
    forces: Record<string, Force>,
    damping: number
  ): void {
    for (const nodeId in positions) {
      const vel = velocities[nodeId];
      const force = forces[nodeId];

      // Update velocity
      vel.vx = (vel.vx + force.fx) * damping;
      vel.vy = (vel.vy + force.fy) * damping;

      // Update position
      positions[nodeId].x += vel.vx;
      positions[nodeId].y += vel.vy;
    }
  }

  private hasConverged(
    velocities: Record<string, Velocity>,
    temperature: number
  ): boolean {
    const threshold = 0.01 * temperature;

    for (const vel of Object.values(velocities)) {
      const speed = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);
      if (speed > threshold) {
        return false;
      }
    }

    return true;
  }
}

interface Force {
  fx: number;
  fy: number;
}

interface Velocity {
  vx: number;
  vy: number;
}
```

---

### 2. Hierarchical Layout with Layer Assignment

```typescript
export class LayeredLayout implements LayoutEngine {
  name = 'layered';
  type = 'hierarchical';

  apply(graph: Graph, options: LayoutOptions = {}): LayoutResult {
    const {
      direction = 'TB',
      rankSpacing = 100,
      nodeSpacing = 50
    } = options;

    // Step 1: Assign layers (topological sort)
    const layers = this.assignLayers(graph);

    // Step 2: Minimize edge crossings
    this.minimizeCrossings(layers, graph);

    // Step 3: Assign x-coordinates
    const positions = this.assignCoordinates(
      layers,
      graph,
      direction,
      rankSpacing,
      nodeSpacing
    );

    // Step 4: Route edges
    const edgePaths = this.routeEdges(graph, positions);

    return {
      positions,
      edgePaths,
      bounds: this.calculateBounds(positions, 50)
    };
  }

  private assignLayers(graph: Graph): string[][] {
    const layers: string[][] = [];
    const layerMap = new Map<string, number>();
    const inDegree = new Map<string, number>();
    const adjacency = this.buildAdjacencyList(graph);

    // Calculate in-degrees
    graph.nodes.forEach(node => inDegree.set(node.id, 0));
    graph.edges?.forEach(edge => {
      const deg = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, deg + 1);
    });

    // Topological sort with layer assignment
    const queue: string[] = [];

    // Start with nodes that have no incoming edges
    for (const [nodeId, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(nodeId);
        layerMap.set(nodeId, 0);
      }
    }

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const layer = layerMap.get(nodeId)!;

      // Add to layers array
      if (!layers[layer]) {
        layers[layer] = [];
      }
      layers[layer].push(nodeId);

      // Process neighbors
      const neighbors = adjacency.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const deg = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, deg);

        if (deg === 0) {
          // Assign to next layer
          layerMap.set(neighbor, layer + 1);
          queue.push(neighbor);
        }
      }
    }

    return layers;
  }

  private minimizeCrossings(layers: string[][], graph: Graph): void {
    const maxIterations = 10;

    for (let i = 0; i < maxIterations; i++) {
      let swapped = false;

      // Forward pass
      for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
        swapped ||= this.orderLayer(layers, layerIdx, graph, 'forward');
      }

      // Backward pass
      for (let layerIdx = layers.length - 2; layerIdx >= 0; layerIdx--) {
        swapped ||= this.orderLayer(layers, layerIdx, graph, 'backward');
      }

      if (!swapped) break;
    }
  }

  private orderLayer(
    layers: string[][],
    layerIdx: number,
    graph: Graph,
    direction: 'forward' | 'backward'
  ): boolean {
    const layer = layers[layerIdx];
    const adjacentLayer = direction === 'forward'
      ? layers[layerIdx + 1]
      : layers[layerIdx - 1];

    if (!adjacentLayer) return false;

    // Calculate barycenter for each node
    const barycenters = layer.map(nodeId => ({
      nodeId,
      value: this.calculateBarycenter(nodeId, adjacentLayer, graph, direction)
    }));

    // Sort by barycenter
    const sorted = barycenters.sort((a, b) => a.value - b.value);

    // Check if order changed
    const changed = !sorted.every((item, idx) => item.nodeId === layer[idx]);

    // Update layer order
    layers[layerIdx] = sorted.map(item => item.nodeId);

    return changed;
  }

  private calculateBarycenter(
    nodeId: string,
    adjacentLayer: string[],
    graph: Graph,
    direction: 'forward' | 'backward'
  ): number {
    const edges = graph.edges || [];
    const connected = direction === 'forward'
      ? edges.filter(e => e.source === nodeId).map(e => e.target)
      : edges.filter(e => e.target === nodeId).map(e => e.source);

    if (connected.length === 0) return 0;

    const sum = connected.reduce((acc, connectedId) => {
      const position = adjacentLayer.indexOf(connectedId);
      return acc + (position >= 0 ? position : 0);
    }, 0);

    return sum / connected.length;
  }

  private assignCoordinates(
    layers: string[][],
    graph: Graph,
    direction: string,
    rankSpacing: number,
    nodeSpacing: number
  ): Record<string, Position> {
    const positions: Record<string, Position> = {};

    layers.forEach((layer, layerIdx) => {
      const y = layerIdx * rankSpacing;

      layer.forEach((nodeId, nodeIdx) => {
        const x = nodeIdx * nodeSpacing;

        positions[nodeId] =
          direction === 'TB' || direction === 'BT'
            ? { x, y }
            : { x: y, y: x }; // Swap for LR/RL
      });
    });

    return positions;
  }

  private routeEdges(
    graph: Graph,
    positions: Record<string, Position>
  ): Record<string, PathData> {
    const edgePaths: Record<string, PathData> = {};

    graph.edges?.forEach(edge => {
      const source = positions[edge.source];
      const target = positions[edge.target];

      // Simple straight line for now
      // Can be enhanced with splines or orthogonal routing
      edgePaths[edge.id] = {
        points: [source, target],
        pathString: `M ${source.x} ${source.y} L ${target.x} ${target.y}`
      };
    });

    return edgePaths;
  }

  private buildAdjacencyList(graph: Graph): Map<string, string[]> {
    const adjacency = new Map<string, string[]>();

    graph.nodes.forEach(node => adjacency.set(node.id, []));

    graph.edges?.forEach(edge => {
      const neighbors = adjacency.get(edge.source) || [];
      neighbors.push(edge.target);
      adjacency.set(edge.source, neighbors);
    });

    return adjacency;
  }

  private calculateBounds(
    positions: Record<string, Position>,
    padding: number
  ): BoundingBox {
    const coords = Object.values(positions);

    const minX = Math.min(...coords.map(p => p.x)) - padding;
    const minY = Math.min(...coords.map(p => p.y)) - padding;
    const maxX = Math.max(...coords.map(p => p.x)) + padding;
    const maxY = Math.max(...coords.map(p => p.y)) + padding;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}

interface PathData {
  points: Position[];
  pathString: string;
}
```

---

## Testing

**tests/radial-layout.test.ts:**

```typescript
import { describe, it, expect } from 'vitest';
import { RadialLayoutEngine } from '../src/radial-layout';
import type { Graph } from '@aigraphia/protocol';

describe('RadialLayoutEngine', () => {
  it('applies radial layout to tree graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'root', type: 'process', label: 'Root' },
        { id: 'child1', type: 'process', label: 'Child 1' },
        { id: 'child2', type: 'process', label: 'Child 2' }
      ],
      edges: [
        { id: 'e1', source: 'root', target: 'child1', type: 'flow' },
        { id: 'e2', source: 'root', target: 'child2', type: 'flow' }
      ]
    };

    const layout = new RadialLayoutEngine();
    const result = layout.apply(graph, { spacing: 100 });

    expect(result.positions).toHaveProperty('root');
    expect(result.positions).toHaveProperty('child1');
    expect(result.positions).toHaveProperty('child2');

    // Root should be at center
    expect(result.positions['root'].x).toBeCloseTo(500);
    expect(result.positions['root'].y).toBeCloseTo(500);

    // Children should be on circle around root
    const dist1 = Math.sqrt(
      Math.pow(result.positions['child1'].x - 500, 2) +
      Math.pow(result.positions['child1'].y - 500, 2)
    );
    expect(dist1).toBeCloseTo(100);
  });

  it('rejects cyclic graphs', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a', type: 'process', label: 'A' },
        { id: 'b', type: 'process', label: 'B' }
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'flow' },
        { id: 'e2', source: 'b', target: 'a', type: 'flow' } // Cycle
      ]
    };

    const layout = new RadialLayoutEngine();
    expect(layout.validate(graph)).toBe(false);
  });
});
```

---

## Performance Optimization

### 1. Spatial Indexing

```typescript
class SpatialIndex {
  private grid: Map<string, Set<string>>;
  private cellSize: number;

  constructor(cellSize: number = 100) {
    this.grid = new Map();
    this.cellSize = cellSize;
  }

  insert(nodeId: string, pos: Position): void {
    const key = this.getCellKey(pos);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key)!.add(nodeId);
  }

  getNearby(pos: Position, radius: number): Set<string> {
    const nearby = new Set<string>();
    const cells = this.getCellsInRadius(pos, radius);

    for (const cellKey of cells) {
      const nodes = this.grid.get(cellKey);
      if (nodes) {
        nodes.forEach(nodeId => nearby.add(nodeId));
      }
    }

    return nearby;
  }

  private getCellKey(pos: Position): string {
    const x = Math.floor(pos.x / this.cellSize);
    const y = Math.floor(pos.y / this.cellSize);
    return `${x},${y}`;
  }

  private getCellsInRadius(pos: Position, radius: number): string[] {
    const cells: string[] = [];
    const startX = Math.floor((pos.x - radius) / this.cellSize);
    const endX = Math.floor((pos.x + radius) / this.cellSize);
    const startY = Math.floor((pos.y - radius) / this.cellSize);
    const endY = Math.floor((pos.y + radius) / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        cells.push(`${x},${y}`);
      }
    }

    return cells;
  }
}
```

### 2. Parallel Processing

```typescript
import { Worker } from 'worker_threads';

class ParallelForceLayout {
  async apply(graph: Graph, options: LayoutOptions): Promise<LayoutResult> {
    const workerCount = 4;
    const chunkSize = Math.ceil(graph.nodes.length / workerCount);

    const promises = [];

    for (let i = 0; i < workerCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, graph.nodes.length);
      const chunk = graph.nodes.slice(start, end);

      promises.push(this.processChunk(chunk, graph, options));
    }

    const results = await Promise.all(promises);

    // Merge results
    return this.mergeResults(results);
  }

  private processChunk(
    nodes: Node[],
    graph: Graph,
    options: LayoutOptions
  ): Promise<Partial<LayoutResult>> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./force-worker.js');

      worker.postMessage({ nodes, graph, options });

      worker.on('message', result => {
        resolve(result);
        worker.terminate();
      });

      worker.on('error', reject);
    });
  }
}
```

---

## Contribution Process

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/aigp.git
cd aigp/packages/layout
```

### 2. Create Branch

```bash
git checkout -b feature/radial-layout
```

### 3. Implement Layout Engine

Create your layout engine following the interface and examples above.

### 4. Write Tests

Ensure 80%+ code coverage:

```bash
pnpm test -- --coverage
```

### 5. Add Documentation

**README.md:**

```markdown
## Radial Layout

Places nodes in concentric circles around a root node.

### Usage

```typescript
import { RadialLayoutEngine } from '@aigraphia/layout';

const layout = new RadialLayoutEngine();
const result = layout.apply(graph, {
  spacing: 100,
  centerGraph: true
});
```

### Options

- `spacing` (number): Distance between levels (default: 100)
- `centerGraph` (boolean): Center output in viewport (default: true)
- `padding` (number): Container padding (default: 50)

### Best For

- Tree structures
- Hierarchical data
- Organizational charts
- Family trees
```

### 6. Submit Pull Request

```bash
git add .
git commit -m "feat: add radial layout engine"
git push origin feature/radial-layout
```

Create PR on GitHub with:
- Clear description of the layout algorithm
- Performance characteristics
- Example diagrams
- Test results

### 7. Code Review

AIGP maintainers will review:
- Code quality
- Test coverage
- Performance
- Documentation
- API consistency

---

## Quality Checklist

✅ **Code Quality**
- Follows TypeScript best practices
- Proper error handling
- Clear variable names
- Documented complex logic

✅ **Performance**
- Time complexity documented
- Memory usage reasonable
- Benchmarks for large graphs
- Spatial indexing for O(n²) operations

✅ **Testing**
- Unit tests for all methods
- Edge cases covered
- Performance tests included
- 80%+ coverage

✅ **Documentation**
- Clear algorithm description
- Usage examples
- API documentation
- Performance notes

✅ **Integration**
- Works with existing plugins
- Compatible with renderers
- Handles edge routing
- Respects options interface

---

## Resources

- **Layout Algorithm Papers**: https://aigp.dev/research/layouts
- **Example Implementations**: https://github.com/aigp/aigp/tree/main/packages/layout/src
- **Performance Benchmarks**: https://aigp.dev/benchmarks/layout
- **Community Forum**: https://github.com/aigp/aigp/discussions

---

## Support

- GitHub Issues: https://github.com/aigp/aigp/issues
- Discord: https://discord.gg/aigp
- Email: layout@aigp.dev
