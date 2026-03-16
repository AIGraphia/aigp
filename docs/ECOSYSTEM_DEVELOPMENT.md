# AIGP Ecosystem Development Guide

## Overview

Complete guide for building the AIGP open source ecosystem including plugins, integrations, and community tools.

---

## 1. Plugin Development SDK

### Creating Custom Diagram Types

```typescript
import { DiagramPlugin, Node, Edge } from '@aigraphia/plugin-sdk';

export const customPlugin: DiagramPlugin = {
  // Plugin metadata
  name: 'my-custom-diagram',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Custom diagram type for XYZ',

  // Diagram type definition
  type: 'custom',

  // Supported node types
  nodeTypes: [
    {
      id: 'custom-start',
      label: 'Custom Start',
      icon: '▶',
      defaultStyle: {
        fillColor: '#4CAF50',
        shape: 'circle'
      }
    },
    {
      id: 'custom-process',
      label: 'Custom Process',
      icon: '⚙',
      defaultStyle: {
        fillColor: '#2196F3',
        shape: 'rectangle'
      }
    },
    {
      id: 'custom-end',
      label: 'Custom End',
      icon: '⏹',
      defaultStyle: {
        fillColor: '#f44336',
        shape: 'circle'
      }
    }
  ],

  // Supported edge types
  edgeTypes: [
    {
      id: 'custom-flow',
      label: 'Custom Flow',
      defaultStyle: {
        strokeColor: '#000000',
        strokeWidth: 2,
        arrowType: 'standard'
      }
    }
  ],

  // Node creation function
  createNode(type: string, label: string, data?: any): Node {
    return {
      id: `custom_${Date.now()}`,
      type,
      label,
      data: data || {}
    };
  },

  // Edge creation function
  createEdge(source: string, target: string, label?: string, data?: any): Edge {
    return {
      id: `edge_${Date.now()}`,
      source,
      target,
      type: 'custom-flow',
      label,
      data: data || {}
    };
  },

  // Validation rules specific to this diagram type
  validate(document: AIGPDocument): ValidationResult {
    const errors: string[] = [];

    // Custom validation logic
    const startNodes = document.graph.nodes.filter(n => n.type === 'custom-start');
    if (startNodes.length === 0) {
      errors.push('Must have at least one start node');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Recommended layout for this diagram type
  defaultLayout: {
    algorithm: 'hierarchical',
    direction: 'TB'
  }
};

// Export plugin
export default customPlugin;
```

### Plugin Package Structure

```
my-aigp-plugin/
├── package.json
├── README.md
├── src/
│   ├── index.ts              # Main plugin export
│   ├── plugin.ts             # Plugin definition
│   ├── validators.ts         # Custom validators
│   └── __tests__/
│       └── plugin.test.ts
├── examples/
│   └── example-diagram.json
└── docs/
    └── README.md
```

### Plugin package.json

```json
{
  "name": "@aigp-plugins/my-custom-diagram",
  "version": "1.0.0",
  "description": "Custom diagram type for AIGP",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["aigp", "plugin", "diagram"],
  "peerDependencies": {
    "@aigraphia/protocol": "^1.0.0"
  },
  "devDependencies": {
    "@aigraphia/plugin-sdk": "^1.0.0"
  }
}
```

### Publishing Plugin

```bash
pnpm publish --access public
```

### Using Custom Plugin

```typescript
import { registerPlugin } from '@aigraphia/protocol';
import customPlugin from '@aigp-plugins/my-custom-diagram';

// Register plugin
registerPlugin(customPlugin);

// Now you can create diagrams with this type
const diagram: AIGPDocument = {
  type: 'custom',  // Your custom type
  // ...
};
```

---

## 2. Layout Engine Contribution Guide

### Creating Custom Layout Algorithm

```typescript
import { LayoutEngine, LayoutResult, Node, Edge } from '@aigraphia/layout-sdk';

export const myLayoutEngine: LayoutEngine = {
  name: 'my-layout',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Custom layout algorithm',

  // Layout configuration options
  options: {
    spacing: {
      type: 'number',
      default: 50,
      description: 'Space between nodes'
    },
    orientation: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
      default: 'horizontal',
      description: 'Layout orientation'
    }
  },

  // Main layout function
  async layout(
    nodes: Node[],
    edges: Edge[],
    options?: any
  ): Promise<LayoutResult> {
    const spacing = options?.spacing || 50;
    const positioned: Node[] = [];

    // Your layout algorithm here
    // Example: Simple grid layout
    const cols = Math.ceil(Math.sqrt(nodes.length));

    nodes.forEach((node, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;

      positioned.push({
        ...node,
        position: {
          x: col * spacing,
          y: row * spacing
        }
      });
    });

    // Route edges (optional)
    const routedEdges = routeEdges(edges, positioned);

    return {
      nodes: positioned,
      edges: routedEdges,
      bounds: calculateBounds(positioned)
    };
  },

  // Performance characteristics
  performance: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    recommendedMaxNodes: 1000
  }
};

export default myLayoutEngine;
```

### Layout Engine Testing

```typescript
import { myLayoutEngine } from './my-layout';

describe('My Layout Engine', () => {
  it('should position all nodes', async () => {
    const nodes = [
      { id: 'n1', type: 'process', label: 'A' },
      { id: 'n2', type: 'process', label: 'B' },
      { id: 'n3', type: 'process', label: 'C' }
    ];

    const edges = [
      { id: 'e1', source: 'n1', target: 'n2' }
    ];

    const result = await myLayoutEngine.layout(nodes, edges);

    expect(result.nodes).toHaveLength(3);
    expect(result.nodes.every(n => n.position)).toBe(true);
  });

  it('should handle large graphs', async () => {
    const nodes = Array.from({ length: 500 }, (_, i) => ({
      id: `n${i}`,
      type: 'process',
      label: `Node ${i}`
    }));

    const start = performance.now();
    await myLayoutEngine.layout(nodes, []);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(2000); // Should complete in < 2s
  });
});
```

---

## 3. Integration Guides

### Figma Plugin

**Figma Plugin Architecture:**

```typescript
// figma-plugin/code.ts
figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-to-aigp') {
    const selection = figma.currentPage.selection;
    const diagram = convertFigmaToAIGP(selection);

    figma.ui.postMessage({
      type: 'aigp-exported',
      diagram
    });
  }

  if (msg.type === 'import-from-aigp') {
    const diagram = msg.diagram;
    await renderAIGPInFigma(diagram);
  }
};

function convertFigmaToAIGP(nodes: SceneNode[]): AIGPDocument {
  const aigpNodes: Node[] = [];
  const aigpEdges: Edge[] = [];

  nodes.forEach(node => {
    if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
      aigpNodes.push({
        id: node.id,
        type: 'process',
        label: node.name,
        position: {
          x: node.x,
          y: node.y
        }
      });
    }

    if (node.type === 'LINE') {
      // Detect connections
      aigpEdges.push({
        id: node.id,
        source: detectSource(node),
        target: detectTarget(node),
        type: 'flow'
      });
    }
  });

  return {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: 'flowchart',
    metadata: {
      title: 'Imported from Figma'
    },
    graph: {
      nodes: aigpNodes,
      edges: aigpEdges
    }
  };
}
```

### Notion Integration

**Notion Database Property:**

```typescript
import { Client } from '@notionhq/client';
import { AIGPDocument } from '@aigraphia/protocol';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Save AIGP diagram to Notion page
async function saveDiagramToNotion(
  pageId: string,
  diagram: AIGPDocument
) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        type: 'code',
        code: {
          language: 'json',
          rich_text: [{
            type: 'text',
            text: { content: JSON.stringify(diagram, null, 2) }
          }]
        }
      }
    ]
  });
}

// Load AIGP diagram from Notion
async function loadDiagramFromNotion(pageId: string): Promise<AIGPDocument> {
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  const codeBlock = blocks.results.find(b => b.type === 'code');
  if (codeBlock && 'code' in codeBlock) {
    const content = codeBlock.code.rich_text[0]?.plain_text;
    return JSON.parse(content);
  }

  throw new Error('No AIGP diagram found');
}
```

### Confluence Integration

**Confluence Macro:**

```xml
<!-- atlassian-plugin.xml -->
<atlassian-plugin key="com.aigp.confluence" name="AIGP Diagrams">
  <plugin-info>
    <description>Embed AIGP diagrams in Confluence</description>
    <version>1.0.0</version>
  </plugin-info>

  <xhtml-macro name="aigp-diagram" key="aigp-diagram-macro">
    <description>Render AIGP diagram</description>
    <category name="formatting"/>
    <parameters>
      <parameter name="diagram" type="string" required="true"/>
    </parameters>
  </xhtml-macro>
</atlassian-plugin>
```

```javascript
// macro.js
AJS.toInit(function() {
  AJS.$('.aigp-diagram').each(function() {
    const diagramJson = AJS.$(this).data('diagram');
    const diagram = JSON.parse(diagramJson);

    // Render using AIGP browser library
    AIGP.render(diagram, this, {
      width: 800,
      height: 600
    });
  });
});
```

---

## 4. Template Library

### Template Structure

```
templates/
├── business/
│   ├── swot-analysis.json
│   ├── business-model-canvas.json
│   └── value-chain.json
├── software/
│   ├── microservices-architecture.json
│   ├── ci-cd-pipeline.json
│   └── api-gateway.json
├── data/
│   ├── ecommerce-erd.json
│   ├── analytics-pipeline.json
│   └── data-warehouse.json
└── workflows/
    ├── onboarding-process.json
    ├── support-ticket-flow.json
    └── approval-workflow.json
```

### Template Metadata

```json
{
  "id": "microservices-architecture",
  "name": "Microservices Architecture",
  "description": "Standard microservices architecture with API gateway, services, and databases",
  "category": "software",
  "tags": ["architecture", "microservices", "cloud"],
  "author": "AIGP Community",
  "license": "MIT",
  "preview": "https://templates.aigp.dev/previews/microservices.png",
  "complexity": "intermediate",
  "customizable": [
    "services",
    "databases",
    "message queues"
  ]
}
```

### Template Manager

```bash
# Install template
aigp template install microservices-architecture

# List templates
aigp template list --category software

# Create from template
aigp create --template microservices-architecture --output my-arch.json

# Publish template
aigp template publish my-template.json --category workflows

# Search templates
aigp template search "approval workflow"
```

---

## 5. Community Contribution Workflow

### Step 1: Fork Repository

```bash
git clone https://github.com/AIGraphia/aigp.git
cd aigp
git checkout -b feature/my-plugin
```

### Step 2: Develop

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm run build
```

### Step 3: Document

Create comprehensive README:

```markdown
# My AIGP Plugin

## Description
Brief description of what your plugin does.

## Installation
\`\`\`bash
pnpm install @aigp-plugins/my-plugin
\`\`\`

## Usage
\`\`\`typescript
import myPlugin from '@aigp-plugins/my-plugin';
// Usage examples
\`\`\`

## API
Document all public APIs.

## Examples
Provide working examples.

## Contributing
How others can contribute.

## License
MIT
```

### Step 4: Submit PR

```bash
git add .
git commit -m "feat: add my-plugin for X functionality"
git push origin feature/my-plugin
```

Create PR with:
- Clear title
- Description of changes
- Screenshots/examples
- Test coverage report
- Breaking changes (if any)

### Step 5: Review Process

1. Automated checks (CI/CD)
2. Code review by maintainers
3. Community feedback
4. Approval and merge
5. Published to npm

---

## 6. Community Resources

### Discord Channels
- **#plugin-development** - Plugin creation help
- **#layout-algorithms** - Layout engine discussions
- **#integrations** - Third-party integrations
- **#showcase** - Show your creations
- **#help** - General help

### GitHub Discussions
- Feature requests
- Design proposals
- Best practices
- Q&A

### Monthly Community Calls
- First Friday of each month
- Demo new features
- Community showcase
- Roadmap discussions

---

## 7. Recognition Program

### Contributor Levels

**Level 1: Contributor** (1+ merged PR)
- GitHub badge
- Name in CONTRIBUTORS.md
- Discord role

**Level 2: Regular Contributor** (5+ merged PRs)
- All Level 1 benefits
- Early access to new features
- Vote on feature priorities

**Level 3: Core Contributor** (20+ merged PRs)
- All Level 2 benefits
- Core team channel access
- Maintainer consideration

**Level 4: Maintainer** (Invited)
- All Level 3 benefits
- Merge permissions
- Release management
- Roadmap decisions

### Plugin Showcase

Top plugins featured on:
- AIGP website homepage
- Monthly newsletter
- Social media highlights
- Conference talks

---

## 8. Quality Standards

### Plugin Checklist

- [ ] TypeScript types included
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] Documentation complete
- [ ] Examples provided
- [ ] Performance benchmarks
- [ ] Changelog maintained
- [ ] Semantic versioning
- [ ] MIT or compatible license
- [ ] Code of Conduct followed

### Code Review Criteria

1. **Functionality**: Does it work as intended?
2. **Performance**: Acceptable performance?
3. **Code quality**: Clean, readable, maintainable?
4. **Tests**: Adequate test coverage?
5. **Documentation**: Clear and complete?
6. **Breaking changes**: Properly communicated?

---

## Resources

- Plugin SDK: https://github.com/aigp/plugin-sdk
- Layout SDK: https://github.com/aigp/layout-sdk
- Integration Examples: https://github.com/aigp/integrations
- Template Library: https://templates.aigp.dev
- Community Forum: https://community.aigp.dev
- Discord: https://discord.gg/aigp
