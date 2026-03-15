# OpenAI GPT Actions for AIGP

## Overview

This document describes how to integrate AIGP diagram generation into ChatGPT using GPT Actions (formerly plugins).

## GPT Configuration

### Name
AIGP Diagram Creator

### Description
Create professional diagrams from natural language descriptions. Supports flowcharts, sequence diagrams, ER diagrams, class diagrams, and 20+ other types. Powered by the AIGP (AI Graphic Protocol) open standard.

### Instructions

```markdown
You are a diagram creation expert using the AIGP (AI Graphic Protocol) standard.

When a user asks to create a diagram:

1. Determine the best diagram type based on their description:
   - Flowchart: For processes, workflows, decision trees
   - Sequence: For interactions between actors/systems over time
   - Class: For object-oriented design, UML class diagrams
   - ER: For database schemas, entity relationships
   - State: For state machines, FSMs
   - Network: For infrastructure, network topology
   - Mind map: For brainstorming, hierarchical concepts
   - Timeline: For chronological events
   - Gantt: For project schedules

2. Use the create_diagram action to generate the AIGP JSON

3. Present the result to the user with:
   - A brief description of what you created
   - The diagram type
   - Key components (number of nodes, edges)
   - A link to view/edit (if available)

4. Offer to:
   - Modify the diagram
   - Export to other formats (Mermaid, PlantUML, SVG)
   - Optimize the layout
   - Add more detail

Example interaction:
User: "Create a flowchart for user login"
You: "I'll create a login flowchart for you."
[Call create_diagram with description]
You: "I've created a login flowchart with 6 steps including authentication, validation, and error handling. Would you like me to add more detail or export it to another format?"
```

### Conversation Starters

1. "Create a flowchart for my checkout process"
2. "Generate a sequence diagram for API authentication"
3. "Build an ER diagram for an e-commerce database"
4. "Make a mind map about machine learning concepts"

### Actions Schema

Use the OpenAPI schema from `/docs/openapi.json`:

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "AIGP - AI Graphic Protocol",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.aigp.dev"
    }
  ],
  "paths": {
    "/v1/diagrams/create": {
      "post": {
        "operationId": "createDiagram",
        "summary": "Create a diagram from natural language",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["description"],
                "properties": {
                  "description": {
                    "type": "string",
                    "description": "Natural language description of the diagram"
                  },
                  "diagramType": {
                    "type": "string",
                    "enum": ["flowchart", "sequence", "class", "er", "state", "network"]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/v1/diagrams/convert": {
      "post": {
        "operationId": "convertDiagram",
        "summary": "Convert diagram between formats"
      }
    },
    "/v1/diagrams/validate": {
      "post": {
        "operationId": "validateDiagram",
        "summary": "Validate AIGP diagram"
      }
    }
  }
}
```

## API Implementation

### Mock API Server (for testing)

Create `packages/api/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { AIGPDocument } from '@aigraphia/protocol';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Create diagram endpoint
app.post('/v1/diagrams/create', async (req, res) => {
  const { description, diagramType } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'description is required' });
  }

  // In production, this would use AI to generate the diagram
  // For now, return a template
  const diagram: AIGPDocument = {
    schema: 'https://aigraphia.com/schema/v1',
    version: '1.0.0',
    type: diagramType || detectDiagramType(description),
    metadata: {
      title: extractTitle(description),
      description,
      author: 'AIGP API',
      created: new Date().toISOString(),
      tags: ['gpt-action', 'generated']
    },
    graph: {
      nodes: generateNodes(description, diagramType),
      edges: generateEdges(description, diagramType)
    },
    layout: {
      algorithm: 'hierarchical',
      direction: 'TB'
    }
  };

  res.json({
    id: generateId(),
    diagram,
    mermaidPreview: convertToMermaid(diagram),
    imageUrl: `https://api.aigp.dev/render/${generateId()}.png`,
    editUrl: `https://aigp.dev/edit/${generateId()}`
  });
});

// Convert diagram endpoint
app.post('/v1/diagrams/convert', async (req, res) => {
  const { content, from, to } = req.body;

  // Conversion logic here
  res.json({
    result: content, // Placeholder
    format: to
  });
});

// Validate diagram endpoint
app.post('/v1/diagrams/validate', async (req, res) => {
  const { diagram } = req.body;

  const errors: any[] = [];
  const warnings: string[] = [];

  // Validation logic
  if (!diagram.schema) {
    errors.push({ field: 'schema', message: 'Missing schema field' });
  }

  res.json({
    valid: errors.length === 0,
    errors,
    warnings
  });
});

// Enhance diagram endpoint
app.post('/v1/diagrams/enhance', async (req, res) => {
  const { diagram, instructions } = req.body;

  // Enhancement logic
  res.json({
    id: generateId(),
    diagram,
    changes: ['Added error handling', 'Optimized layout']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AIGP API running on port ${PORT}`);
});

// Helper functions
function detectDiagramType(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('flow') || lower.includes('process')) return 'flowchart';
  if (lower.includes('sequence') || lower.includes('interaction')) return 'sequence';
  if (lower.includes('class') || lower.includes('uml')) return 'class';
  if (lower.includes('database') || lower.includes('entity')) return 'er';
  if (lower.includes('state') || lower.includes('fsm')) return 'state';
  if (lower.includes('network') || lower.includes('topology')) return 'network';
  return 'flowchart';
}

function extractTitle(description: string): string {
  // Extract first sentence or first 50 chars
  const sentences = description.split(/[.!?]/);
  return sentences[0].trim().substring(0, 50);
}

function generateNodes(description: string, type?: string): any[] {
  // Simple keyword extraction for demo
  const keywords = description.split(' ').filter(w => w.length > 4);
  return keywords.slice(0, 5).map((word, i) => ({
    id: `n${i}`,
    type: i === 0 ? 'start' : i === keywords.length - 1 ? 'end' : 'process',
    label: word,
    data: {}
  }));
}

function generateEdges(description: string, type?: string): any[] {
  // Connect nodes sequentially
  const nodeCount = 5;
  return Array.from({ length: nodeCount - 1 }, (_, i) => ({
    id: `e${i}`,
    source: `n${i}`,
    target: `n${i + 1}`,
    type: 'flow',
    data: {}
  }));
}

function convertToMermaid(diagram: AIGPDocument): string {
  let mermaid = 'graph TD\n';
  diagram.graph.nodes.forEach(node => {
    mermaid += `  ${node.id}[${node.label}]\n`;
  });
  diagram.graph.edges.forEach(edge => {
    mermaid += `  ${edge.source} --> ${edge.target}\n`;
  });
  return mermaid;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
```

## Deployment

### Deploy to Vercel

1. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/api/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "packages/api/src/index.ts"
    }
  ]
}
```

2. Deploy:

```bash
vercel --prod
```

3. Your API will be at: `https://your-project.vercel.app`

### Environment Variables

```bash
OPENAI_API_KEY=sk-...        # For AI-powered generation
DATABASE_URL=postgresql://... # For storing diagrams
CORS_ORIGIN=https://chat.openai.com
```

## Testing the GPT Action

### 1. Create Custom GPT

1. Go to https://chat.openai.com/gpts/editor
2. Fill in the configuration
3. Add the Actions schema
4. Set authentication to "None" (or API key if you want)
5. Test in the Preview pane

### 2. Test Commands

```
Create a flowchart for user authentication with email and password
```

Expected output:
```
I've created an authentication flowchart with the following components:

- Login form (start)
- Validate email format
- Check credentials against database
- Decision point: credentials valid?
- Success: Generate session token
- Error: Return error message
- End

The diagram has 7 nodes and 8 edges. Would you like me to:
- Add two-factor authentication?
- Export to Mermaid format?
- Add error handling for network issues?
```

### 3. Test Conversions

```
Convert this Mermaid to AIGP:
graph TD
A[Start] --> B[Process]
B --> C[End]
```

### 4. Test Validation

```
Can you validate this AIGP diagram? [paste JSON]
```

## Advanced Features

### Streaming Responses

For large diagrams, stream the generation:

```typescript
app.post('/v1/diagrams/create/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Stream nodes as they're generated
  for (let i = 0; i < 10; i++) {
    const node = generateNode(i);
    res.write(`data: ${JSON.stringify({ type: 'node', node })}\n\n`);
    await sleep(100);
  }

  res.write('data: {"type": "complete"}\n\n');
  res.end();
});
```

### Diagram Storage

Store user diagrams:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.post('/v1/diagrams/save', async (req, res) => {
  const { diagram, userId } = req.body;

  const saved = await prisma.diagram.create({
    data: {
      userId,
      content: diagram,
      type: diagram.type,
      title: diagram.metadata.title,
      createdAt: new Date()
    }
  });

  res.json({ id: saved.id, url: `https://aigp.dev/diagrams/${saved.id}` });
});
```

### Analytics

Track diagram creation:

```typescript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });
  next();
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/v1/', limiter);
```

## Authentication (Optional)

```typescript
app.use('/v1/', (req, res, next) => {
  const apiKey = req.get('X-API-Key');

  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
});
```

## Publishing the GPT

1. Complete all testing
2. Add privacy policy URL
3. Set visibility to "Public"
4. Submit for review
5. Share the link: `https://chat.openai.com/g/g-YOUR-GPT-ID`

## Monitoring

### Log diagram requests

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.post('/v1/diagrams/create', async (req, res) => {
  logger.info('Diagram creation requested', {
    description: req.body.description,
    type: req.body.diagramType,
    ip: req.ip
  });

  // ... rest of handler
});
```

## Cost Optimization

For AI-powered generation, cache common diagrams:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

app.post('/v1/diagrams/create', async (req, res) => {
  const cacheKey = hashDescription(req.body.description);

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const result = await generateDiagram(req.body);
  cache.set(cacheKey, result);

  res.json(result);
});
```

## Resources

- ChatGPT Actions Documentation: https://platform.openai.com/docs/actions
- AIGP Protocol: https://aigp.dev/docs
- Example GPTs: https://chat.openai.com/gpts/discovery
