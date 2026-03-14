# Deep Dive: AIGP Layout Algorithms

## The Layout Problem

You have nodes and edges. How do you position them so the diagram looks good?

This is the **graph layout problem**, and it's computationally hard (NP-complete for optimal solutions). Every diagramming tool faces it.

AIGP includes 7 layout algorithms out of the box. Let's understand when and why to use each one.

## Algorithm 1: Hierarchical (Sugiyama)

**Best for:** Flowcharts, org charts, dependency graphs

**How it works:**
1. Assign nodes to layers (levels)
2. Minimize edge crossings between layers
3. Position nodes horizontally within layers
4. Route edges as polylines

```json
{
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB",
    "spacing": { "node": 60, "layer": 100 }
  }
}
```

**Example use case:**
```
   [Start]
      ↓
   [Process]
      ↓
   [Decision] → [Error]
      ↓
    [End]
```

**Complexity:** O(|V|² + |E|)

**Pros:**
- Clear hierarchy
- Minimal crossings
- Good for directed acyclic graphs (DAGs)

**Cons:**
- Doesn't handle cycles well
- Can create very tall diagrams
- Not good for highly connected graphs

---

## Algorithm 2: Force-Directed (d3-force)

**Best for:** Network diagrams, mind maps, social graphs

**How it works:**
- Treats nodes as charged particles that repel
- Treats edges as springs that attract
- Simulates physics until equilibrium

```json
{
  "layout": {
    "algorithm": "force",
    "iterations": 300,
    "forces": {
      "charge": -400,
      "link": 80,
      "gravity": 0.1
    }
  }
}
```

**Example use case:**
```
    [A] ─── [B]
     │   ╲  │
     │    ╲ │
    [C] ─── [D]
```

**Complexity:** O(iterations × |V|²) - can be slow for large graphs

**Pros:**
- Beautiful, organic layouts
- Works with any graph structure
- Natural clustering
- Handles cycles gracefully

**Cons:**
- Non-deterministic (different every time)
- Slow for 500+ nodes
- Hard to control precisely

---

## Algorithm 3: Timeline (Chronological)

**Best for:** Gantt charts, project timelines, event sequences

**How it works:**
1. Sort nodes by timestamp
2. Position horizontally by time
3. Stack overlapping items vertically

```json
{
  "layout": {
    "algorithm": "timeline",
    "direction": "LR",
    "scale": "month",
    "startDate": "2026-01-01"
  }
}
```

**Example:**
```
Jan     Feb     Mar
[A]━━━━━━━━━┓
         [B]━━━━━━┓
                [C]━━━━━━
```

**Complexity:** O(|V| log |V|) - just sorting

**Pros:**
- Accurate time representation
- Easy to read chronologically
- Scales well

**Cons:**
- Only works with time-based data
- Needs timestamp metadata

---

## Algorithm 4: Circular

**Best for:** Dependency cycles, peer relationships

**How it works:**
1. Arrange nodes in a circle
2. Route edges through the center
3. Minimize edge length via reordering

```json
{
  "layout": {
    "algorithm": "circular",
    "radius": 300,
    "startAngle": 0
  }
}
```

**Example:**
```
        [A]
    [D]     [B]
        [C]
```

**Complexity:** O(|V| + |E|)

**Pros:**
- Shows cycles clearly
- Compact
- No hierarchy implied

**Cons:**
- Hard to read for 20+ nodes
- Edges cross in the center

---

## Algorithm 5: Radial

**Best for:** Tree structures, hub-and-spoke topologies

**How it works:**
1. Place root at center
2. Place children in concentric circles
3. Divide each circle by angle

```json
{
  "layout": {
    "algorithm": "radial",
    "root": "center",
    "levelDistance": 100
  }
}
```

**Example:**
```
       [B] [C]
         [A]
       [D] [E]
```

**Complexity:** O(|V|)

**Pros:**
- Clear root/hub
- Balanced
- Works for trees

**Cons:**
- Outer levels get crowded
- Only for trees (no cycles)

---

## Algorithm 6: Grid

**Best for:** Architecture diagrams, tile layouts, component grids

**How it works:**
1. Place nodes in a grid
2. Route edges orthogonally
3. Align to columns/rows

```json
{
  "layout": {
    "algorithm": "grid",
    "columns": 3,
    "cellSize": { "width": 200, "height": 100 }
  }
}
```

**Example:**
```
[A] [B] [C]
[D] [E] [F]
[G] [H] [I]
```

**Complexity:** O(|V|)

**Pros:**
- Predictable
- Aligned
- Compact

**Cons:**
- Doesn't consider edge routing
- Can have long edges

---

## Algorithm 7: Manual

**Best for:** When you know exactly where things go

**How it works:**
You specify positions:

```json
{
  "graph": {
    "nodes": [
      { "id": "A", "position": { "x": 100, "y": 50 } },
      { "id": "B", "position": { "x": 300, "y": 50 } }
    ]
  },
  "layout": {
    "algorithm": "manual"
  }
}
```

**Complexity:** O(1) - no computation

**Pros:**
- Pixel-perfect control
- Consistent across renders

**Cons:**
- Manual work
- Doesn't scale

---

## Choosing the Right Algorithm

| Graph Type | Best Algorithm | Alternative |
|-----------|---------------|-------------|
| DAG (no cycles) | Hierarchical | Radial |
| Cycles present | Force | Circular |
| Timeline data | Timeline | Hierarchical |
| Tree structure | Radial | Hierarchical |
| Hub-and-spoke | Radial | Circular |
| Highly connected | Force | Grid |
| Need precision | Manual | Grid |

## Performance Comparison (1000 nodes)

| Algorithm | Time | Quality Score* | Deterministic |
|-----------|------|----------------|---------------|
| Hierarchical | 850ms | 8.5 | ✅ |
| Force | 4200ms | 9.2 | ❌ |
| Timeline | 120ms | 8.0 | ✅ |
| Circular | 90ms | 6.5 | ✅ |
| Radial | 70ms | 7.8 | ✅ |
| Grid | 45ms | 6.0 | ✅ |
| Manual | 5ms | 10.0 | ✅ |

*Quality Score: subjective rating of typical output aesthetics

## Advanced: Hybrid Layouts

You can combine algorithms:

```typescript
import { hierarchicalLayout, forceLayout } from '@aigp/layout';

// Use hierarchical for initial positioning
let positioned = hierarchicalLayout(nodes, edges);

// Refine with force-directed for 50 iterations
positioned = forceLayout(positioned.nodes, edges, {
  iterations: 50,
  fixedY: true // Keep hierarchical Y positions
});
```

Result: Hierarchical structure with organic horizontal spacing.

## Edge Routing Strategies

Layout algorithms position nodes. **Edge routing** draws the connections.

### 1. **Straight**
```
[A] ──────→ [B]
```
Pros: Simple, fast
Cons: Overlaps nodes

### 2. **Orthogonal**
```
[A] ───┐
       │
       └──→ [B]
```
Pros: Clean, grid-aligned
Cons: Takes more space

### 3. **Curved (Bezier)**
```
[A] ~~~~→ [B]
```
Pros: Smooth, avoids overlaps
Cons: Harder to follow

### 4. **Bundled**
```
[A] ─┐
     ├══→ [B]
[C] ─┘
```
Pros: Reduces visual clutter
Cons: Harder to trace individual edges

AIGP supports all four:
```json
{
  "layout": {
    "algorithm": "hierarchical",
    "edgeRouting": "orthogonal"
  }
}
```

## Real-World Example: Architecture Diagram

Let's layout a microservices architecture:

```json
{
  "type": "network",
  "graph": {
    "nodes": [
      { "id": "gateway", "type": "node", "label": "API Gateway" },
      { "id": "auth", "type": "node", "label": "Auth Service" },
      { "id": "users", "type": "node", "label": "Users Service" },
      { "id": "orders", "type": "node", "label": "Orders Service" },
      { "id": "db", "type": "database", "label": "PostgreSQL" }
    ],
    "edges": [
      { "source": "gateway", "target": "auth" },
      { "source": "gateway", "target": "users" },
      { "source": "gateway", "target": "orders" },
      { "source": "users", "target": "db" },
      { "source": "orders", "target": "db" }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "LR",
    "spacing": { "node": 80, "layer": 150 }
  }
}
```

Result:
```
             ┌→ [Auth]
[Gateway] ──→┼→ [Users] ──→ [DB]
             └→ [Orders] ─→
```

Clear left-to-right flow showing the gateway as entry point.

## Custom Layout Implementation

Want to add your own algorithm?

```typescript
import type { LayoutAlgorithm } from '@aigp/layout';

export const myLayout: LayoutAlgorithm = {
  name: 'spiral',
  version: '1.0.0',

  layout(nodes, edges, options) {
    const positioned = [];
    const centerX = 500;
    const centerY = 500;
    let radius = 50;
    let angle = 0;

    for (const node of nodes) {
      positioned.push({
        ...node,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
      });

      angle += Math.PI / 4; // 45 degrees
      radius += 5; // Spiral outward
    }

    return {
      nodes: positioned,
      edges: routeEdges(edges, positioned)
    };
  }
};
```

Register and use:
```typescript
import { registerLayout } from '@aigp/layout';

registerLayout(myLayout);

// Now available:
{
  "layout": { "algorithm": "spiral" }
}
```

## Layout Performance Tips

### 1. **Paginate Large Graphs**
```typescript
import { paginate } from '@aigp/converters';

const pages = paginate(hugeDiagram, { nodesPerPage: 200 });
pages.forEach(page => layout(page));
```

### 2. **Use Incremental Layout**
```typescript
// Layout only new nodes, keep existing positions
const newlyPositioned = incrementalLayout(
  existingNodes,
  newNodes,
  edges
);
```

### 3. **Web Workers**
```typescript
const worker = new Worker('layout-worker.js');
worker.postMessage({ nodes, edges, algorithm: 'force' });
worker.onmessage = (e) => {
  renderDiagram(e.data.positioned);
};
```

### 4. **Progressive Rendering**
```typescript
// Show initial rough layout quickly
const quick = hierarchicalLayout(nodes, edges);
render(quick);

// Refine in background
forceLayout(nodes, edges, { iterations: 300 }).then(refined => {
  render(refined);
});
```

## Conclusion

Layout algorithms are the unsung heroes of diagramming. The right algorithm makes the difference between a confusing mess and an instantly understandable visual.

AIGP's 7 algorithms cover 95% of use cases. And if they don't? The plugin system makes it easy to add your own.

**Key takeaways:**
- Use **hierarchical** for most directed graphs
- Use **force** for beautiful, complex networks
- Use **timeline** for chronological data
- Use **radial** for trees with a clear root
- Use **manual** when you need pixel-perfect control

---

**Try it yourself:**
```bash
pnpm install -g @aigp/cli

aigp generate "network diagram with 10 nodes" --layout force
aigp generate "flowchart with 5 steps" --layout hierarchical
```

**Next up:** We'll dive into creating custom diagram type plugins.

---

*Have questions about layout algorithms? Join the discussion on Discord: https://discord.gg/aigp*
