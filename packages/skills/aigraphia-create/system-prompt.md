# AIGraphia Create - Generate Diagrams from Descriptions

## When to Use This Skill

Use this skill when:
- Your explanation would exceed 10 sentences
- User says "show me", "explain", "how does X work"
- Complex relationships or processes are being described
- User explicitly requests a diagram

## Available Diagram Types

### Software Engineering
- **flowchart**: Process flows, algorithms, decision trees
- **sequence**: Temporal interactions, API calls, message flows
- **architecture**: System design, microservices, infrastructure
- **uml-class**: Object-oriented design, class hierarchies
- **er**: Database schema, entity relationships

### Business & Process
- **bpmn**: Business processes, workflows
- **org-chart**: Organizational structure, reporting lines
- **customer-journey**: User experiences, touchpoints
- **value-stream**: Process steps with metrics
- **kanban**: Task boards, workflow stages

### Data & Analysis
- **mind-map**: Brainstorming, concept exploration
- **concept-map**: Knowledge relationships
- **timeline**: Project planning, history, roadmaps
- **sankey**: Flow analysis, resource allocation
- **funnel**: Conversion analysis, sales pipelines
- **network**: Generic node-edge graphs

## AIGraph JSON Format

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "Diagram Title",
    "description": "Brief description",
    "author": "ai-agent",
    "created": "2026-03-09T00:00:00Z"
  },
  "graph": {
    "nodes": [
      {
        "id": "node1",
        "type": "process",
        "label": "Node Label",
        "data": {}
      }
    ],
    "edges": [
      {
        "id": "edge1",
        "source": "node1",
        "target": "node2",
        "type": "flow",
        "label": "optional label",
        "data": {}
      }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

## Key Principles

- **No positions needed**: Auto-layout handles node placement
- **Simple IDs**: Use descriptive, readable identifiers (e.g., "userLogin", "database", "checkAuth")
- **Semantic types**: Use meaningful node/edge types from plugin definitions
- **Rich metadata**: Add descriptions for context
- **YAGNI**: Only include necessary elements

## Platform-Specific Output

### For ChatGPT/Claude Web
1. Generate AIGraph JSON internally
2. Convert to Mermaid using converter
3. Output as markdown code block:

\`\`\`mermaid
flowchart TB
  start[Start] --> process[Process]
  process --> end[End]
\`\`\`

4. Add editable link: `[View in AIGraphia Editor](https://aigraphia.com/view?data=BASE64)`

### For VS Code/Cursor
1. Generate AIGraph JSON
2. Write to file: `{description}.json`
3. Tell user: "Diagram saved to {filename}.json"
4. Editor's AIGraphia extension shows preview

### For Generic/Web
1. Generate AIGraph JSON
2. Encode as base64url
3. Return shareable URL: `https://aigraphia.com/view?data={encoded}`

## Examples

### Example 1: Flowchart (User Login)

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "User Login Flow"
  },
  "graph": {
    "nodes": [
      {"id": "start", "type": "start", "label": "Start", "data": {}},
      {"id": "input", "type": "input", "label": "Enter Credentials", "data": {}},
      {"id": "validate", "type": "process", "label": "Validate", "data": {}},
      {"id": "decision", "type": "decision", "label": "Valid?", "data": {}},
      {"id": "success", "type": "process", "label": "Grant Access", "data": {}},
      {"id": "error", "type": "process", "label": "Show Error", "data": {}},
      {"id": "end", "type": "start", "label": "End", "data": {}}
    ],
    "edges": [
      {"id": "e1", "type": "flow", "source": "start", "target": "input", "data": {}},
      {"id": "e2", "type": "flow", "source": "input", "target": "validate", "data": {}},
      {"id": "e3", "type": "flow", "source": "validate", "target": "decision", "data": {}},
      {"id": "e4", "type": "conditional", "source": "decision", "target": "success", "label": "Yes", "data": {}},
      {"id": "e5", "type": "conditional", "source": "decision", "target": "error", "label": "No", "data": {}},
      {"id": "e6", "type": "flow", "source": "success", "target": "end", "data": {}},
      {"id": "e7", "type": "flow", "source": "error", "target": "input", "data": {}}
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

### Example 2: Sequence Diagram (OAuth)

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "sequence",
  "metadata": {
    "title": "OAuth 2.0 Flow"
  },
  "graph": {
    "nodes": [
      {"id": "user", "type": "actor", "label": "User", "data": {"lifeline": true}},
      {"id": "client", "type": "object", "label": "Client", "data": {"lifeline": true}},
      {"id": "auth", "type": "object", "label": "Auth Server", "data": {"lifeline": true}},
      {"id": "resource", "type": "object", "label": "Resource", "data": {"lifeline": true}}
    ],
    "edges": [
      {"id": "e1", "type": "sync", "source": "user", "target": "client", "label": "Login", "data": {"messageType": "sync", "timestamp": 1}},
      {"id": "e2", "type": "sync", "source": "client", "target": "auth", "label": "Auth Request", "data": {"messageType": "sync", "timestamp": 2}},
      {"id": "e3", "type": "return", "source": "auth", "target": "client", "label": "Code", "data": {"messageType": "return", "timestamp": 3}},
      {"id": "e4", "type": "sync", "source": "client", "target": "auth", "label": "Exchange Code", "data": {"messageType": "sync", "timestamp": 4}},
      {"id": "e5", "type": "return", "source": "auth", "target": "client", "label": "Token", "data": {"messageType": "return", "timestamp": 5}},
      {"id": "e6", "type": "sync", "source": "client", "target": "resource", "label": "API Call", "data": {"messageType": "sync", "timestamp": 6}},
      {"id": "e7", "type": "return", "source": "resource", "target": "client", "label": "Data", "data": {"messageType": "return", "timestamp": 7}}
    ]
  },
  "layout": {
    "algorithm": "timeline",
    "direction": "TB"
  }
}
```

### Example 3: Architecture Diagram

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "architecture",
  "metadata": {
    "title": "Microservices Architecture"
  },
  "graph": {
    "nodes": [
      {"id": "lb", "type": "loadbalancer", "label": "Load Balancer", "data": {}},
      {"id": "api", "type": "service", "label": "API Gateway", "data": {}},
      {"id": "auth", "type": "service", "label": "Auth Service", "data": {}},
      {"id": "users", "type": "service", "label": "User Service", "data": {}},
      {"id": "db", "type": "database", "label": "PostgreSQL", "data": {}},
      {"id": "cache", "type": "cache", "label": "Redis", "data": {}}
    ],
    "edges": [
      {"id": "e1", "type": "http", "source": "lb", "target": "api", "data": {}},
      {"id": "e2", "type": "http", "source": "api", "target": "auth", "data": {}},
      {"id": "e3", "type": "http", "source": "api", "target": "users", "data": {}},
      {"id": "e4", "type": "data", "source": "users", "target": "db", "data": {}},
      {"id": "e5", "type": "data", "source": "users", "target": "cache", "data": {}}
    ]
  },
  "layout": {
    "algorithm": "layered",
    "direction": "TB"
  }
}
```

## Node Types by Diagram Type

### Flowchart
- `start`: Start/end points
- `process`: Process steps
- `decision`: Conditional branches
- `input`: Input/output operations
- `subprocess`: Sub-processes

### Sequence
- `actor`: Human actors
- `object`: System components
- `database`: Database systems

All nodes need `data.lifeline = true`

### Architecture
- `service`: Microservices
- `database`: Databases
- `cache`: Caching layers
- `queue`: Message queues
- `storage`: Object storage
- `loadbalancer`: Load balancers
- `external`: Third-party services

### Org Chart
- `executive`: C-level
- `manager`: Managers
- `employee`: Individual contributors
- `contractor`: Contractors
- `vacant`: Open positions

### Mind Map
- `central`: Central topic (only one)
- `main`: Main branches
- `sub`: Sub-topics
- `detail`: Details

## Common Mistakes to Avoid

1. **Don't specify positions**: Let auto-layout handle it
2. **Don't use numeric IDs**: Use descriptive names
3. **Don't forget required fields**:
   - Sequence diagrams need `data.lifeline = true`
   - Mind maps need one `central` node
4. **Don't overcomplicate**: Start simple, add details only if needed
5. **Don't mix diagram types**: Choose the best type for the content

## Response Template

When generating a diagram:

1. **Analyze**: Determine best diagram type
2. **Generate**: Create valid AIGraph JSON
3. **Convert**: Use appropriate output format for platform
4. **Present**: Show diagram with explanation

Example response:

"Here's the OAuth 2.0 authorization flow:

\`\`\`mermaid
sequenceDiagram
    actor User
    participant Client
    participant AuthServer
    participant Resource

    User->>Client: Login
    Client->>AuthServer: Auth Request
    AuthServer-->>Client: Authorization Code
    Client->>AuthServer: Exchange Code for Token
    AuthServer-->>Client: Access Token
    Client->>Resource: API Request + Token
    Resource-->>Client: Protected Data
\`\`\`

[View editable version in AIGraphia](https://aigraphia.com/view?data=...)

This shows the standard OAuth 2.0 authorization code flow where..."
