# AIGP - AI Graphic Protocol

> **Universal JSON Standard for AI-Native Diagrams**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40aigraphia%2Fprotocol.svg)](https://www.npmjs.com/package/@aigraphia/protocol)
[![CI](https://github.com/AIGraphia/aigp/actions/workflows/ci.yml/badge.svg)](https://github.com/AIGraphia/aigp/actions/workflows/ci.yml)

AIGP (AI Graphic Protocol) is an open-source, universal JSON standard designed for AI-native diagram creation. It enables AI agents to generate, transform, and manipulate complex diagrams with semantic understanding, automatic layout, and flexible rendering.

## 🎯 Why AIGP?

Traditional diagramming formats like Mermaid or PlantUML force AI agents to generate text syntax, which is:
- **Error-prone**: Syntax mistakes break rendering
- **Limited**: Fixed set of diagram types
- **Not semantic**: No structured understanding of diagram elements

AIGP solves this by providing:
- ✅ **AI-First Design**: JSON format optimized for LLM generation
- ✅ **Semantic Structure**: Rich metadata and relationships
- ✅ **Auto-Layout**: 7 built-in layout engines
- ✅ **20+ Diagram Types**: From flowcharts to architecture diagrams
- ✅ **Extensible**: Easy to add new diagram types
- ✅ **Universal**: Export to Mermaid, SVG, and more

## 🚀 Quick Start

### Installation

```bash
# Install the CLI tool
pnpm add -g @aigraphia/cli

# Or use individual packages
pnpm add @aigraphia/protocol @aigraphia/plugins @aigraphia/layout
```

### Create Your First Diagram

```bash
# Initialize a new diagram
aigp init my-diagram.json

# Validate a diagram
aigp validate my-diagram.json

# Export to Mermaid
aigp export my-diagram.json --format mermaid
```

### Example: Flowchart in AIGP

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "User Authentication Flow",
    "description": "Login process diagram"
  },
  "graph": {
    "nodes": [
      {
        "id": "start",
        "type": "start",
        "label": "Start",
        "data": {}
      },
      {
        "id": "login",
        "type": "process",
        "label": "Enter Credentials",
        "data": {}
      },
      {
        "id": "validate",
        "type": "decision",
        "label": "Valid?",
        "data": {}
      },
      {
        "id": "success",
        "type": "end",
        "label": "Login Success",
        "data": {}
      }
    ],
    "edges": [
      { "id": "e0", "type": "flow", "source": "start", "target": "login", "data": {} },
      { "id": "e1", "type": "flow", "source": "login", "target": "validate", "data": {} },
      { "id": "e2", "type": "flow", "source": "validate", "target": "success", "label": "Yes", "data": {} }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

## 📦 Packages

AIGP is organized as a monorepo with the following packages:

| Package | Description | npm |
|---------|-------------|-----|
| [@aigraphia/protocol](./packages/protocol) | Core JSON schema and validation | [![npm](https://img.shields.io/npm/v/@aigraphia/protocol.svg)](https://www.npmjs.com/package/@aigraphia/protocol) |
| [@aigraphia/plugins](./packages/plugins) | 20+ diagram type implementations | [![npm](https://img.shields.io/npm/v/@aigraphia/plugins.svg)](https://www.npmjs.com/package/@aigraphia/plugins) |
| [@aigraphia/layout](./packages/layout) | 7 automatic layout engines | [![npm](https://img.shields.io/npm/v/@aigraphia/layout.svg)](https://www.npmjs.com/package/@aigraphia/layout) |
| [@aigraphia/cli](./packages/cli) | Command-line tool | [![npm](https://img.shields.io/npm/v/@aigraphia/cli.svg)](https://www.npmjs.com/package/@aigraphia/cli) |
| [@aigraphia/converters](./packages/converters) | Export to Mermaid, SVG, etc. | [![npm](https://img.shields.io/npm/v/@aigraphia/converters.svg)](https://www.npmjs.com/package/@aigraphia/converters) |
| [@aigraphia/export](./packages/export) | Export utilities (SVG, PNG rendering) | [![npm](https://img.shields.io/npm/v/@aigraphia/export.svg)](https://www.npmjs.com/package/@aigraphia/export) |
| [@aigraphia/skills](./packages/skills) | AI Skills for Claude Code, ChatGPT | *private* |

## 🎨 Supported Diagram Types

AIGP supports 20+ diagram types out of the box:

- **Flow Diagrams**: Flowcharts, process flows, decision trees
- **Architecture**: System architecture, C4 diagrams, deployment diagrams
- **Data**: Entity-relationship, database schemas
- **UML**: Class diagrams, sequence diagrams, state machines
- **Network**: Infrastructure, network topology
- **Organization**: Org charts, hierarchy diagrams
- **Time-based**: Gantt charts, timelines
- **Mind Maps**: Brainstorming, concept maps
- **And more**: Kanban, BPMN, state machines, etc.

See the [full list](./docs/PROTOCOL.md#diagram-types) in the documentation.

## 🔧 Usage

### Programmatic API

```typescript
import { createDiagram, validateDiagram } from '@aigraphia/protocol';
import { applyLayout } from '@aigraphia/layout';
import { exportToMermaid } from '@aigraphia/converters';

// Create a diagram
const diagram = createDiagram({
  type: 'flowchart',
  graph: {
    nodes: [...],
    edges: [...]
  }
});

// Validate
const validation = validateDiagram(diagram);
if (!validation.valid) {
  console.error('Invalid diagram:', validation.errors);
}

// Apply auto-layout
const laidOut = applyLayout(diagram, { algorithm: 'hierarchical' });

// Export to Mermaid
const mermaid = exportToMermaid(laidOut);
console.log(mermaid);
```

### AI Skills

AIGP includes AI Skills for Claude Code and other AI agents:

```bash
# Copy skills to your project
cp -r node_modules/@aigraphia/skills/* .claude/skills/

# Now AI agents can create diagrams natively!
```

## 🌐 Commercial Hosted Version

While AIGP is fully open-source and free to use, we also offer **[AIGraphia Cloud](https://aigraphia.com)** - a hosted SaaS platform with:

- 🌐 **Web-based Editor**: Visual diagram creation
- 🤝 **Real-time Collaboration**: Multiplayer editing
- ☁️ **Cloud Storage**: Save and share diagrams
- 🔐 **Enterprise Features**: SSO, RBAC, audit logs
- 🎨 **Advanced Export**: PDF, PNG, SVG
- 📊 **Analytics**: Usage tracking and insights

**Try it free at [aigraphia.com](https://aigraphia.com)**

## 📚 Documentation

- [Protocol Specification](./docs/PROTOCOL.md) - Complete JSON schema reference
- [Quick Start Guide](./docs/QUICKSTART.md) - Get started in 5 minutes
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Roadmap](./docs/ROADMAP.md) - Future plans
- [Quick Reference](./docs/QUICK_REFERENCE.md) - Command reference
- [AI Integration Guide](./llms.txt) - How AI models should generate AIGP diagrams

## 🤝 Contributing

We welcome contributions! AIGP is an open standard, and we encourage the community to:

- Add new diagram types
- Improve layout algorithms
- Create exporters for other formats
- Report bugs and suggest features

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 🏗️ Architecture

```
AIGP/
├── packages/
│   ├── protocol/      # Core JSON schema (Zod)
│   ├── plugins/       # Diagram type implementations
│   ├── layout/        # Layout engines (Dagre, ELK, D3)
│   ├── cli/           # Command-line tool
│   ├── export/        # SVG/PNG export
│   ├── converters/    # Export to other formats
│   └── skills/        # AI Skills for agents
├── docs/              # Documentation
└── examples/          # Example diagrams
```

## 📄 License

AIGP is open source under the [MIT License](./LICENSE).

## 🙏 Credits

Built with:
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Dagre](https://github.com/dagrejs/dagre) - Hierarchical layout
- [ELK.js](https://github.com/kieler/elkjs) - Advanced graph layout
- [D3.js](https://d3js.org/) - Force-directed and hierarchical layouts

## 🔗 Links

- **Website**: [aigp.dev](https://aigp.dev) *(coming soon)*
- **Commercial SaaS**: [aigraphia.com](https://aigraphia.com)
- **npm**: [@aigraphia/protocol](https://www.npmjs.com/package/@aigraphia/protocol)
- **GitHub**: [github.com/AIGraphia/aigp](https://github.com/AIGraphia/aigp)
- **Discord**: [Join our community](https://discord.gg/aigp) *(coming soon)*

---

**Made with ❤️ by the AIGP community**
