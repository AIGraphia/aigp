# Quick Start Guide

## Installation

### Using pnpm/yarn

```bash
pnpm add -g @aigraphia/cli
```

### From source

```bash
git clone https://github.com/AIGraphia/aigp.git
cd aigp
pnpm install
pnpm run build
```

## Your First Diagram

### 1. Create a new diagram

```bash
aigp init flowchart my-first-diagram
```

This creates `my-first-diagram.json`:

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "my-first-diagram"
  },
  "graph": {
    "nodes": [],
    "edges": []
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

### 2. Add nodes and edges

Edit the file to add content:

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "Simple Process"
  },
  "graph": {
    "nodes": [
      {"id": "start", "type": "start", "label": "Start", "data": {}},
      {"id": "process", "type": "process", "label": "Do Work", "data": {}},
      {"id": "end", "type": "start", "label": "End", "data": {}}
    ],
    "edges": [
      {"id": "e1", "type": "flow", "source": "start", "target": "process", "data": {}},
      {"id": "e2", "type": "flow", "source": "process", "target": "end", "data": {}}
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

### 3. Validate the diagram

```bash
aigp validate my-first-diagram.json
```

Output:
```
✓ Diagram is valid
  Type: flowchart
  Nodes: 3
  Edges: 2
```

### 4. Export to other formats

```bash
aigp export my-first-diagram.json --format mermaid
aigp export my-first-diagram.json --format svg
```

## Using with AI

### Claude/ChatGPT

When explaining complex topics, AI will automatically generate diagrams:

**User:** "Explain how OAuth 2.0 works"

**AI:** "Here's the OAuth 2.0 authorization code flow:

\`\`\`mermaid
sequenceDiagram
    actor User
    participant Client
    participant AuthServer
    participant ResourceServer

    User->>Client: Click Login
    Client->>AuthServer: Authorization Request
    AuthServer->>User: Login Page
    User->>AuthServer: Credentials
    AuthServer-->>Client: Authorization Code
    Client->>AuthServer: Exchange Code
    AuthServer-->>Client: Access Token
    Client->>ResourceServer: API Request + Token
    ResourceServer-->>Client: Protected Data
\`\`\`

[View interactive version](https://aigraphia.com/view?data=...)"

### Cursor/VS Code

1. Install AIGraphia extension
2. AI generates `.json` files
3. Preview panel shows live diagram
4. Edit JSON to modify diagram

## Common Diagram Types

### Flowchart
```bash
aigp init flowchart process-flow
```

Node types: `start`, `process`, `decision`, `input`, `subprocess`

### Sequence Diagram
```bash
aigp init sequence api-flow
```

Node types: `actor`, `object`, `database` (all need `data.lifeline = true`)

### Architecture
```bash
aigp init architecture system-design
```

Node types: `service`, `database`, `cache`, `queue`, `storage`, `loadbalancer`

### Organization Chart
```bash
aigp init org-chart company-structure
```

Node types: `executive`, `manager`, `employee`, `contractor`

### Mind Map
```bash
aigp init mind-map brainstorm
```

Node types: `central`, `main`, `sub`, `detail` (need one `central` node)

## Next Steps

- Read [Protocol Documentation](./PROTOCOL.md)
- Explore [Example Diagrams](../examples/)
- Try [AI Skills](../packages/skills/README.md)
- Build [Custom Plugins](./PLUGIN_DEVELOPMENT.md)

## Troubleshooting

### Validation Errors

```bash
aigp validate broken.json
```

Fix reported errors in JSON structure.

### Missing Dependencies

```bash
pnpm install
pnpm run build
```

## Getting Help

- Documentation: https://aigraphia.com/docs
- Examples: `packages/protocol/src/examples/`
- Issues: https://github.com/AIGraphia/aigp/issues
- Discord: https://discord.gg/aigp
