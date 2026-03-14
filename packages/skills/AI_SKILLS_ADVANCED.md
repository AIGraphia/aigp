# AI Skills for AIGP

## Overview

Advanced Claude AI Skills for diagram manipulation, comparison, and optimization.

---

## Skill 1: diagram-diff

**Location**: `packages/skills/diagram-diff.md`

```markdown
---
name: diagram-diff
description: Compare two AIGP diagrams and show detailed differences
tags: [comparison, analysis, diff]
---

# Diagram Diff Skill

You are comparing two AIGP diagrams to identify differences.

## Input

You will receive two AIGP diagram JSON objects:
- `diagram1`: The original/baseline diagram
- `diagram2`: The modified/comparison diagram

## Analysis Steps

1. **Structural Comparison**
   - Count nodes in each diagram
   - Count edges in each diagram
   - Identify added nodes
   - Identify removed nodes
   - Identify modified nodes

2. **Node-Level Diff**
   For each node, check:
   - Label changes
   - Type changes
   - Position changes (if manual layout)
   - Data field changes

3. **Edge-Level Diff**
   For each edge, check:
   - New connections
   - Removed connections
   - Label changes
   - Type changes

4. **Metadata Diff**
   - Title changes
   - Description changes
   - Tag additions/removals
   - Author changes

## Output Format

Provide a structured diff report:

```
# Diagram Comparison Report

## Summary
- Nodes: 10 → 12 (+2)
- Edges: 15 → 16 (+1)
- Metadata: 2 changes

## Added Nodes
1. `error_handler` (type: process)
   - Label: "Error Handler"
   - Added between: validate_input → process_data

2. `logging` (type: process)
   - Label: "Log Activity"

## Removed Nodes
(none)

## Modified Nodes
1. `validate_input`
   - Label: "Validate Input" → "Validate & Sanitize Input"
   - Type: unchanged

## Added Edges
1. validate_input → error_handler
   - Type: flow
   - Label: "On Error"

## Removed Edges
(none)

## Metadata Changes
- Title: "User Flow" → "User Flow v2"
- Tags: Added "security", "validation"

## Similarity Score
87% similar (based on node/edge overlap)

## Recommendations
- Consider documenting why error_handler was added
- The new validation step improves security
- Overall changes appear incremental and safe
```

## Implementation Hints

Use set operations for efficient comparison:
- Added = Set(diagram2.nodes) - Set(diagram1.nodes)
- Removed = Set(diagram1.nodes) - Set(diagram2.nodes)
- Common = Set(diagram1.nodes) ∩ Set(diagram2.nodes)

Calculate similarity:
```
similarity = (common_nodes + common_edges) / (total_nodes + total_edges)
```

## Example Usage

```
I have two versions of my authentication diagram. Can you show me what changed?

[User pastes both AIGP JSONs]

You: [Analyzes and provides detailed diff report]
```
```

---

## Skill 2: diagram-merge

**Location**: `packages/skills/diagram-merge.md`

```markdown
---
name: diagram-merge
description: Intelligently merge multiple AIGP diagrams into one
tags: [merge, combine, integration]
---

# Diagram Merge Skill

You are merging multiple AIGP diagrams into a single cohesive diagram.

## Input

You will receive:
- An array of AIGP diagrams to merge
- Optional merge strategy: "concat", "smart", or "hierarchical"

## Merge Strategies

### 1. Concat (Simple)
- Combine all nodes and edges
- Detect and resolve ID conflicts
- Keep all connections
- Use first diagram's metadata as base

### 2. Smart (Default)
- Identify overlapping nodes by label/type similarity
- Merge duplicate nodes
- Preserve all unique connections
- Combine metadata intelligently

### 3. Hierarchical
- Create a parent node for each source diagram
- Connect source diagrams in sequence
- Maintain diagram boundaries
- Generate overview structure

## Merging Process

### Step 1: ID Conflict Resolution

If multiple diagrams have nodes with same ID:
```typescript
node.id = `${node.id}_${diagramIndex}`
```

### Step 2: Node Deduplication (Smart strategy)

Two nodes are considered duplicates if:
- Labels match exactly, OR
- Labels have >80% similarity AND same type

When merging duplicates:
- Keep the node with more data fields
- Preserve all incoming/outgoing edges
- Combine data fields

### Step 3: Edge Merging

- Remove duplicate edges (same source, target, type)
- Keep edge with most detailed label
- Preserve all unique connections

### Step 4: Metadata Merging

```json
{
  "title": "Merged: [Title1] + [Title2] + ...",
  "description": "Combined from X diagrams",
  "tags": [...unique tags from all diagrams],
  "author": "Diagram Merge",
  "created": earliest creation date,
  "modified": current timestamp
}
```

### Step 5: Layout Adjustment

- Reset to automatic layout
- Suggest hierarchical for multi-diagram merges
- Use force-directed for network-like results

## Output

Provide:
1. The merged AIGP diagram JSON
2. Merge statistics:
   - Original diagrams: X
   - Total nodes before: Y
   - Total nodes after: Z
   - Deduplicated nodes: Y - Z
   - Total edges: E
3. Merge warnings (conflicts, ambiguities)

## Example Output

```
# Merge Complete

## Statistics
- Merged 3 diagrams
- Nodes: 25 total (5 duplicates removed) → 20 unique
- Edges: 35 total (3 duplicates removed) → 32 unique
- Strategy: smart

## Deduplication Details
1. "User Authentication" appeared in diagrams 1 and 2
   - Merged into single node with combined properties

2. "Database Query" appeared in diagrams 2 and 3
   - Kept from diagram 2 (more detailed)

## Warnings
- Diagram 1 and 3 had conflicting edge labels between "Process" → "Validate"
  - Resolved by combining labels: "Check & Validate"

## Merged Diagram
[AIGP JSON]
```

## Edge Cases

1. **Circular Dependencies**: Preserve cycles, add warning
2. **Conflicting Types**: Use most common type, note in warnings
3. **Empty Diagrams**: Skip silently
4. **Single Diagram**: Return unchanged with note

## Example Usage

```
I have separate diagrams for frontend, backend, and database.
Can you merge them into one architecture diagram?

[User pastes 3 AIGP JSONs]

You: [Performs smart merge and returns unified diagram]
```
```

---

## Skill 3: diagram-simplify

**Location**: `packages/skills/diagram-simplify.md`

```markdown
---
name: diagram-simplify
description: Simplify complex diagrams by removing noise and optimizing structure
tags: [optimization, simplification, refactoring]
---

# Diagram Simplify Skill

You are simplifying a complex AIGP diagram to improve readability.

## Input

- An AIGP diagram (often large/complex)
- Optional simplification level: "light", "medium", "aggressive"

## Simplification Strategies

### 1. Remove Orphan Nodes

Nodes with no incoming or outgoing edges:
```
BEFORE: [A] → [B] → [C]    [D] (orphan)
AFTER:  [A] → [B] → [C]
```

### 2. Merge Sequential Nodes

Two nodes connected by single edge with no other connections:
```
BEFORE: [A] → [B] → [C]
AFTER:  [A] → [B+C]
```

When to merge:
- Both nodes same type
- No branching between them
- Labels can be combined meaningfully

### 3. Collapse Parallel Edges

Multiple edges between same nodes:
```
BEFORE: A →(label1)→ B
        A →(label2)→ B

AFTER:  A →(label1, label2)→ B
```

### 4. Remove Trivial Nodes

Nodes that just pass through without transformation:
```
BEFORE: [Validate] → [Pass Through] → [Process]
AFTER:  [Validate] → [Process]
```

Criteria for trivial:
- Label like "Next", "Continue", "Pass"
- No data fields
- Exactly 1 input, 1 output

### 5. Simplify Labels

Long labels → concise versions:
```
"Validate user input and sanitize data" → "Validate Input"
"Check if user has admin privileges" → "Check Admin"
```

Rules:
- Keep first 3-5 words
- Preserve key verbs and nouns
- Add data field with original label

### 6. Group Related Nodes

Find clusters of highly connected nodes:
```
BEFORE: [A] → [B] → [C] → [D]
           ↓    ↓    ↓
          [E]  [F]  [G]

AFTER:  [A] → [BCD Cluster] → [D]
```

### 7. Remove Redundant Paths

If multiple paths lead to same result:
```
BEFORE: A → B → D
        A → C → D

AFTER:  A → B/C → D
```

## Simplification Levels

### Light (10-20% reduction)
- Remove orphan nodes only
- Merge obvious duplicates
- Simplify very long labels (>50 chars)

### Medium (20-40% reduction)
- All light operations
- Merge sequential nodes
- Collapse parallel edges
- Remove trivial pass-through nodes

### Aggressive (40-60% reduction)
- All medium operations
- Group related nodes into clusters
- Remove redundant paths
- Simplify all labels

## Output Format

Provide:

1. **Simplified Diagram**: The optimized AIGP JSON

2. **Simplification Report**:
```
# Simplification Report

## Before
- Nodes: 45
- Edges: 78
- Complexity Score: 85/100 (very complex)

## After
- Nodes: 28 (-17, 38% reduction)
- Edges: 42 (-36, 46% reduction)
- Complexity Score: 52/100 (moderate)

## Operations Performed
1. Removed 5 orphan nodes
2. Merged 8 sequential node pairs
3. Collapsed 12 parallel edges
4. Removed 4 trivial pass-through nodes
5. Simplified 15 labels

## Preserved Information
- All critical paths maintained
- Core business logic intact
- Key decision points preserved
- Original labels stored in node.data.originalLabel

## Recommendations
- Layout: Switch from force to hierarchical for clarity
- Consider splitting into 2 diagrams if still too complex
- Add grouping/swimlanes for remaining clusters
```

3. **Reversibility Info**: How to recover original structure

## Complexity Scoring

Calculate complexity before/after:
```
complexity = (
  nodeCount * 0.5 +
  edgeCount * 0.3 +
  avgConnections * 2.0 +
  maxDepth * 1.5
) / 10

Score interpretation:
0-30: Simple
30-50: Moderate
50-70: Complex
70-100: Very Complex
```

## Example Usage

```
This diagram has 50 nodes and is hard to read. Can you simplify it?

[User pastes AIGP JSON]

You: [Analyzes, applies medium simplification, returns optimized diagram with report]
```

## Safety Rules

- Never remove start/end nodes
- Preserve all decision points
- Keep nodes with data fields
- Maintain critical paths
- Store original state for undo

## Edge Cases

1. **Already Simple**: Return unchanged with message
2. **Cannot Simplify**: Explain why (e.g., all nodes are necessary)
3. **Too Aggressive**: Warn if >60% reduction requested
```

---

## Implementation Files

### packages/skills/index.ts

```typescript
export { default as diagramDiff } from './diagram-diff.md';
export { default as diagramMerge } from './diagram-merge.md';
export { default as diagramSimplify } from './diagram-simplify.md';
```

### CLI Integration

```bash
# Diff two diagrams
aigp diff diagram-v1.json diagram-v2.json

# Merge diagrams
aigp merge auth.json payment.json checkout.json --strategy smart

# Simplify diagram
aigp simplify complex-diagram.json --level medium
```

### API Endpoints

```typescript
// Diff
POST /v1/diagrams/diff
{
  "diagram1": { /* AIGP */ },
  "diagram2": { /* AIGP */ }
}

// Merge
POST /v1/diagrams/merge
{
  "diagrams": [ /* array of AIGP */ ],
  "strategy": "smart"
}

// Simplify
POST /v1/diagrams/simplify
{
  "diagram": { /* AIGP */ },
  "level": "medium"
}
```

## Testing

```typescript
import { diff, merge, simplify } from '@aigp/skills';

describe('AI Skills', () => {
  it('should diff diagrams', () => {
    const result = diff(diagram1, diagram2);
    expect(result.addedNodes).toHaveLength(2);
    expect(result.similarity).toBeGreaterThan(0.8);
  });

  it('should merge diagrams', () => {
    const merged = merge([d1, d2, d3], { strategy: 'smart' });
    expect(merged.graph.nodes.length).toBeLessThan(
      d1.graph.nodes.length + d2.graph.nodes.length + d3.graph.nodes.length
    );
  });

  it('should simplify complex diagrams', () => {
    const simplified = simplify(complexDiagram, { level: 'medium' });
    expect(simplified.graph.nodes.length).toBeLessThan(
      complexDiagram.graph.nodes.length * 0.8
    );
  });
});
```

## Resources

- Graph Algorithms: NetworkX documentation
- Diff Algorithms: Myers' diff algorithm
- Clustering: DBSCAN, K-means
- Similarity Metrics: Jaccard, Cosine similarity
