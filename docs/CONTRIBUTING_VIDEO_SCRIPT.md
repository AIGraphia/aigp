# Contributing Guide Video Scripts

## Video 1: Getting Started with AIGP (5 minutes)

### Scene 1: Introduction (30 seconds)
**Visual**: AIGP logo animation
**Narration**: "Welcome to AIGP - the AI Graphic Protocol. In this video, you'll learn how to contribute to the open source standard that's revolutionizing diagram creation."

### Scene 2: Prerequisites (1 minute)
**Visual**: Screen recording of terminal
**Narration**: "First, make sure you have Node.js 18+ and pnpm installed."
**Commands shown**:
```bash
node --version  # Should show v18+
pnpm --version
git --version
```

### Scene 3: Fork and Clone (1 minute)
**Visual**: GitHub UI + terminal
**Narration**: "Fork the AIGP repository on GitHub, then clone your fork locally."
**Commands shown**:
```bash
git clone https://github.com/YOUR_USERNAME/aigp.git
cd aigp
pnpm install
```

### Scene 4: Project Structure (1.5 minutes)
**Visual**: VS Code file explorer
**Narration**: "AIGP uses a monorepo structure with 6 core packages."
**Highlight**:
- `packages/protocol/` - Core JSON schema
- `packages/plugins/` - 9 diagram types
- `packages/layout/` - 7 layout engines
- `packages/cli/` - Command-line tools
- `packages/converters/` - Import/export
- `packages/skills/` - AI Skills

### Scene 5: Running Tests (1 minute)
**Visual**: Terminal with test output
**Narration**: "Before making changes, verify everything works by running tests."
**Commands shown**:
```bash
pnpm run build
pnpm test
node test-integration.js
```

---

## Video 2: Adding a New Diagram Type (10 minutes)

### Scene 1: Understanding Plugins (2 minutes)
**Visual**: Code walkthrough of existing plugin
**Narration**: "Diagram types in AIGP are implemented as plugins. Let's look at the flowchart plugin as an example."
**Code shown**: `packages/plugins/src/flowchart.ts`

### Scene 2: Creating Plugin Skeleton (3 minutes)
**Visual**: Live coding
**Narration**: "Let's create a new timeline diagram plugin."
**Steps**:
1. Create `packages/plugins/src/timeline.ts`
2. Define node types (event, milestone, period)
3. Implement `createNode` function
4. Export plugin interface

**Code template**:
```typescript
import type { DiagramPlugin, Node } from '@aigraphia/protocol';

export const timelinePlugin: DiagramPlugin = {
  type: 'timeline',
  version: '1.0.0',
  nodeTypes: ['event', 'milestone', 'period'],
  edgeTypes: ['sequence', 'dependency'],

  createNode(type: string, label: string, data?: any): Node {
    return {
      id: `timeline_${Date.now()}`,
      type,
      label,
      data: data || {}
    };
  }
};
```

### Scene 3: Writing Tests (3 minutes)
**Visual**: Test file creation
**Narration**: "Every plugin needs comprehensive tests."
**Code shown**: `packages/plugins/src/__tests__/timeline.test.ts`

### Scene 4: Integration (2 minutes)
**Visual**: Export and documentation
**Narration**: "Register your plugin and update documentation."
**Steps**:
1. Add to `packages/plugins/src/index.ts`
2. Update `packages/protocol/README.md`
3. Add examples

---

## Video 3: Contributing to Layout Engines (8 minutes)

### Scene 1: Layout Engine Basics (2 minutes)
**Visual**: Diagram showing node positioning
**Narration**: "Layout engines position nodes and route edges. AIGP supports 7 algorithms."

### Scene 2: Implementing a Custom Layout (4 minutes)
**Visual**: Live coding
**Narration**: "Let's implement a radial layout algorithm."
**Code shown**:
```typescript
export function radialLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions
): LayoutResult {
  const positioned: PositionedNode[] = [];
  const centerX = 500;
  const centerY = 500;
  const radius = 300;

  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    positioned.push({
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    });
  });

  return {
    nodes: positioned,
    edges: routeEdges(edges, positioned)
  };
}
```

### Scene 3: Testing Layouts (2 minutes)
**Visual**: Visual regression tests
**Narration**: "Test your layout with various graph structures."

---

## Video 4: Creating an AI Skill (12 minutes)

### Scene 1: What are AI Skills? (2 minutes)
**Visual**: Skill execution demo
**Narration**: "AI Skills are Claude skills that understand and manipulate AIGP diagrams."

### Scene 2: Skill Structure (3 minutes)
**Visual**: Skill file breakdown
**Narration**: "Skills have frontmatter metadata and instructions for Claude."
**Template shown**:
```markdown
---
name: diagram-complexity-analyzer
description: Analyzes diagram complexity and suggests optimizations
tags: [analysis, optimization]
---

You are analyzing an AIGP diagram for complexity issues.

## Steps
1. Count nodes and edges
2. Calculate complexity score
3. Identify bottlenecks
4. Suggest improvements
```

### Scene 3: Building a Custom Skill (5 minutes)
**Visual**: Live coding
**Narration**: "Let's create a skill that generates test data."
**Implementation**: Complete skill with examples

### Scene 4: Testing Skills (2 minutes)
**Visual**: Testing with AIGP CLI
**Commands**:
```bash
aigp skill diagram-complexity-analyzer example.json
```

---

## Video 5: Submitting Your First PR (7 minutes)

### Scene 1: Creating a Branch (1 minute)
**Commands**:
```bash
git checkout -b feature/timeline-plugin
```

### Scene 2: Making Changes (2 minutes)
**Visual**: Code changes + commit
**Best practices**:
- Keep commits focused
- Write descriptive messages
- Follow code style

### Scene 3: Testing Before Submit (2 minutes)
**Commands**:
```bash
pnpm run lint
pnpm run test
pnpm run build
```

### Scene 4: Opening PR (2 minutes)
**Visual**: GitHub PR interface
**Checklist**:
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Examples added
- [ ] CHANGELOG.md updated

---

## Video 6: Advanced Topics (10 minutes)

### Scene 1: Performance Optimization (3 minutes)
- Handling large diagrams (1000+ nodes)
- Pagination strategies
- Lazy rendering

### Scene 2: Error Handling (3 minutes)
- Using AIGPError classes
- Error reporting
- Recovery strategies

### Scene 3: Format Conversion (4 minutes)
- Adding new importers
- Implementing exporters
- Testing conversions

---

## Production Notes

### Equipment Needed
- Screen recording: OBS Studio or ScreenFlow
- Code editor: VS Code with AIGP theme
- Terminal: iTerm2 with custom theme
- Audio: Good microphone (Blue Yeti recommended)

### Editing Guidelines
- Keep pace energetic but clear
- Add text overlays for commands
- Include timestamps in video
- Add chapter markers
- Include links in description

### Publishing Checklist
- [ ] Upload to YouTube
- [ ] Add to AIGP documentation
- [ ] Post on Twitter/LinkedIn
- [ ] Add to Discord announcements
- [ ] Update CONTRIBUTING.md with video links

### Video Thumbnails
Each thumbnail should include:
- AIGP logo
- Video number
- Key topic (large text)
- Duration badge
- High contrast colors

### Call to Action (end of each video)
"Ready to contribute? Join our Discord server, star the repo, and let's build the future of AI-native diagrams together. Links in the description!"
