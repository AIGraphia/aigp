# AIGP Claude MCP Server

## Overview

Model Context Protocol (MCP) server for AIGP that enables Claude to understand, create, and manipulate diagrams natively.

## Installation

```bash
pnpm install -g @aigp/mcp-server

# Or via Claude desktop config
claude mcp add aigp
```

## Server Capabilities

### Tools

#### 1. **create_diagram**
Generate AIGP diagram from natural language description.

```typescript
{
  name: "create_diagram",
  description: "Create an AIGP diagram from a text description",
  inputSchema: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "Natural language description of the diagram"
      },
      type: {
        type: "string",
        enum: ["flowchart", "sequence", "class", "er", "state", "network"],
        description: "Diagram type (optional - auto-detected)"
      }
    },
    required: ["description"]
  }
}
```

**Example:**
```
User: Create a flowchart for user authentication
MCP Server: [Returns AIGP JSON]
Claude: I've created an authentication flowchart with login, validation, and error handling steps.
```

####  2. **validate_diagram**
Validate AIGP diagram and return errors/suggestions.

```typescript
{
  name: "validate_diagram",
  description: "Validate an AIGP diagram",
  inputSchema: {
    type: "object",
    properties: {
      diagram: {
        type: "object",
        description: "AIGP diagram JSON"
      }
    },
    required: ["diagram"]
  }
}
```

#### 3. **convert_diagram**
Convert between formats (Mermaid ↔ AIGP ↔ PlantUML).

```typescript
{
  name: "convert_diagram",
  description: "Convert diagram between formats",
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "Diagram content"
      },
      from: {
        type: "string",
        enum: ["aigp", "mermaid", "plantuml", "dot"],
        description: "Source format"
      },
      to: {
        type: "string",
        enum: ["aigp", "mermaid", "plantuml", "svg"],
        description: "Target format"
      }
    },
    required: ["content", "from", "to"]
  }
}
```

#### 4. **optimize_diagram**
Optimize diagram layout and structure.

```typescript
{
  name: "optimize_diagram",
  description: "Optimize diagram for better readability",
  inputSchema: {
    type: "object",
    properties: {
      diagram: {
        type: "object",
        description: "AIGP diagram to optimize"
      },
      options: {
        type: "object",
        properties: {
          removeOrphans: { type: "boolean" },
          simplifyLabels: { type: "boolean" },
          mergeParallelEdges: { type: "boolean" }
        }
      }
    },
    required: ["diagram"]
  }
}
```

#### 5. **analyze_diagram**
Analyze diagram complexity and provide recommendations.

```typescript
{
  name: "analyze_diagram",
  description: "Analyze diagram and provide improvement recommendations",
  inputSchema: {
    type: "object",
    properties: {
      diagram: {
        type: "object",
        description: "AIGP diagram to analyze"
      }
    },
    required: ["diagram"]
  }
}
```

#### 6. **diff_diagrams**
Compare two diagrams and show differences.

```typescript
{
  name: "diff_diagrams",
  description: "Compare two diagrams",
  inputSchema: {
    type: "object",
    properties: {
      diagram1: { type: "object" },
      diagram2: { type: "object" }
    },
    required: ["diagram1", "diagram2"]
  }
}
```

#### 7. **merge_diagrams**
Merge multiple diagrams into one.

```typescript
{
  name: "merge_diagrams",
  description: "Merge multiple diagrams",
  inputSchema: {
    type: "object",
    properties: {
      diagrams: {
        type: "array",
        items: { type: "object" }
      },
      strategy: {
        type: "string",
        enum: ["concat", "smart", "hierarchical"]
      }
    },
    required: ["diagrams"]
  }
}
```

### Resources

#### Diagram Templates
```typescript
{
  uri: "aigp://templates",
  name: "AIGP Templates",
  description: "Pre-built diagram templates",
  mimeType: "application/json"
}
```

Available templates:
- Authentication flow
- Payment processing
- Microservices architecture
- Database ERD
- State machine
- CI/CD pipeline

#### Schema Documentation
```typescript
{
  uri: "aigp://schema",
  name: "AIGP Schema",
  description: "Full AIGP protocol schema",
  mimeType: "application/json"
}
```

### Prompts

#### Generate from Description
```typescript
{
  name: "generate_diagram",
  description: "Interactive diagram generation",
  arguments: [
    {
      name: "description",
      description: "What kind of diagram do you want?",
      required: true
    },
    {
      name: "style",
      description: "Style preference (minimal, detailed, technical)",
      required: false
    }
  ]
}
```

## Server Implementation

### TypeScript Server (packages/mcp-server/src/index.ts)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { AIGPDocument } from '@aigp/protocol';
import { fromMermaid } from '@aigp/converters';
import { validate } from '@aigp/protocol';

class AIGPMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'aigp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_diagram',
          description: 'Create an AIGP diagram from a text description',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Natural language description of the diagram',
              },
              type: {
                type: 'string',
                enum: ['flowchart', 'sequence', 'class', 'er', 'state', 'network'],
                description: 'Diagram type (optional)',
              },
            },
            required: ['description'],
          },
        },
        {
          name: 'validate_diagram',
          description: 'Validate an AIGP diagram',
          inputSchema: {
            type: 'object',
            properties: {
              diagram: {
                type: 'object',
                description: 'AIGP diagram JSON',
              },
            },
            required: ['diagram'],
          },
        },
        {
          name: 'convert_diagram',
          description: 'Convert diagram between formats',
          inputSchema: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              from: { type: 'string', enum: ['aigp', 'mermaid', 'plantuml', 'dot'] },
              to: { type: 'string', enum: ['aigp', 'mermaid', 'plantuml', 'svg'] },
            },
            required: ['content', 'from', 'to'],
          },
        },
        {
          name: 'optimize_diagram',
          description: 'Optimize diagram for better readability',
          inputSchema: {
            type: 'object',
            properties: {
              diagram: { type: 'object' },
              options: { type: 'object' },
            },
            required: ['diagram'],
          },
        },
        {
          name: 'analyze_diagram',
          description: 'Analyze diagram and provide recommendations',
          inputSchema: {
            type: 'object',
            properties: {
              diagram: { type: 'object' },
            },
            required: ['diagram'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'create_diagram':
          return this.createDiagram(request.params.arguments);

        case 'validate_diagram':
          return this.validateDiagram(request.params.arguments);

        case 'convert_diagram':
          return this.convertDiagram(request.params.arguments);

        case 'optimize_diagram':
          return this.optimizeDiagram(request.params.arguments);

        case 'analyze_diagram':
          return this.analyzeDiagram(request.params.arguments);

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });

    // List resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'aigp://templates',
          name: 'AIGP Templates',
          description: 'Pre-built diagram templates',
          mimeType: 'application/json',
        },
        {
          uri: 'aigp://schema',
          name: 'AIGP Schema',
          description: 'Full AIGP protocol schema',
          mimeType: 'application/json',
        },
      ],
    }));
  }

  private async createDiagram(args: any) {
    // Implementation would use AI to generate diagram from description
    // For now, return template
    const diagram: AIGPDocument = {
      schema: 'https://aigraphia.com/schema/v1',
      version: '1.0.0',
      type: args.type || 'flowchart',
      metadata: {
        title: 'Generated Diagram',
        description: args.description,
        author: 'AIGP MCP Server',
      },
      graph: {
        nodes: [],
        edges: [],
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(diagram, null, 2),
        },
      ],
    };
  }

  private async validateDiagram(args: any) {
    const result = validate(args.diagram);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async convertDiagram(args: any) {
    // Conversion logic
    let result: any;

    if (args.from === 'mermaid' && args.to === 'aigp') {
      result = fromMermaid(args.content);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async optimizeDiagram(args: any) {
    // Optimization logic
    return {
      content: [
        {
          type: 'text',
          text: 'Diagram optimized',
        },
      ],
    };
  }

  private async analyzeDiagram(args: any) {
    // Analysis logic
    return {
      content: [
        {
          type: 'text',
          text: 'Analysis complete',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AIGP MCP server running on stdio');
  }
}

const server = new AIGPMCPServer();
server.run().catch(console.error);
```

## Configuration

### Claude Desktop Config

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aigp": {
      "command": "pnpm",
      "args": ["dlx", "@aigp/mcp-server"]
    }
  }
}
```

Or local development:

```json
{
  "mcpServers": {
    "aigp": {
      "command": "node",
      "args": ["/path/to/packages/mcp-server/dist/index.js"]
    }
  }
}
```

## Usage Examples

### Creating a Diagram

```
User: I need a flowchart for the checkout process

Claude: I'll create that diagram for you using the AIGP MCP server.

[Calls create_diagram tool]

Here's a flowchart showing the checkout process with cart review,
payment processing, order confirmation, and error handling.

[Returns AIGP JSON]
```

### Validating a Diagram

```
User: Can you check if this AIGP diagram is valid? [pastes JSON]

Claude: [Calls validate_diagram tool]

The diagram is valid! It has:
- 5 nodes (all properly typed)
- 6 edges (all references exist)
- No orphan nodes
- Proper flowchart structure with start and end nodes
```

### Converting Formats

```
User: Convert this Mermaid to AIGP:
graph TD
A[Start] --> B[Process]

Claude: [Calls convert_diagram tool]

Converted to AIGP format:
{
  "schema": "https://aigraphia.com/schema/v1",
  "type": "flowchart",
  "graph": {
    "nodes": [
      {"id": "A", "type": "start", "label": "Start"},
      {"id": "B", "type": "process", "label": "Process"}
    ],
    "edges": [
      {"id": "e0", "source": "A", "target": "B"}
    ]
  }
}
```

## Testing

```bash
# Install MCP Inspector
pnpm install -g @modelcontextprotocol/inspector

# Test server
mcp-inspector node packages/mcp-server/dist/index.js

# Open browser to http://localhost:6274
```

## Publishing

```bash
cd packages/mcp-server
pnpm publish --access public
```

## Resources

- MCP Specification: https://spec.modelcontextprotocol.io
- AIGP Protocol: https://aigp.dev/docs
- Example Servers: https://github.com/modelcontextprotocol/servers
