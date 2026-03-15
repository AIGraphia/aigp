# Using AIGP with Cursor AI

This guide shows how to use AIGP (AI Graphic Protocol) with Cursor, the AI-first code editor.

## Overview

Cursor's AI capabilities make it perfect for creating and editing AIGP diagrams through natural language. This guide covers setup, usage patterns, and best practices.

## Setup

### 1. Install AIGP CLI

```bash
pnpm add -g @aigraphia/cli
```

### 2. Configure Cursor Rules

Create a `.cursorrules` file in your project root:

```markdown
# AIGP Diagram Rules

When creating or editing AIGP diagrams:

## Format Requirements
- Use AIGP JSON format (schema: https://aigraphia.com/schema/v1)
- Save diagram files with .json extension
- Required fields: schema, version, type, metadata, graph, layout
- Validate with: `aigp validate <file>`
- Convert to Mermaid: `aigp convert <file> mermaid`

## Supported Diagram Types
flowchart, sequence, class, er, state-machine, bpmn, architecture,
org-chart, mind-map, network, timeline, kanban, sankey, funnel

## Node Types by Diagram
- flowchart: start, end, process, decision, data, subprocess
- sequence: actor, lifeline
- class: class, interface, enum, abstract
- er: entity, relationship
- state-machine: state, initial, final
- bpmn: start, end, task, gateway, event
- architecture: component, container, system
- org-chart: position, department
- mind-map: root, branch, leaf
- network: device, cloud, subnet
- timeline: event, milestone
- kanban: card, column
- sankey: source, process, sink
- funnel: stage

## Best Practices
1. Always include metadata (title, description, author, tags)
2. Use meaningful node IDs (lowercase, hyphen-separated)
3. Specify layout algorithm appropriate for diagram type
4. Add data fields for domain-specific information
5. Keep graphs simple and focused (< 50 nodes per diagram)
```

### 3. Add AIGP Schema to Workspace

Create `schema.json` in your project:

```bash
curl -o schema.json https://aigraphia.com/schema/v1/aigp.schema.json
```

Update `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["*.json"],
      "url": "./schema.json"
    }
  ]
}
```

## Usage Patterns

### Pattern 1: Create Diagram from Description

**Prompt:**
```
Create an AIGP flowchart for a CI/CD pipeline with:
- Git commit triggers the pipeline
- Build stage
- Test stage (decision point)
- Deploy to staging if tests pass
- Manual approval for production
- Deploy to production
- Notification at the end
```

Cursor will generate a complete `.json` file following the AIGP format.

### Pattern 2: Edit Existing Diagram

**Prompt:**
```
In ci-cd-pipeline.json, add a security scanning step after the build stage,
and add a decision point for vulnerability severity before deploying to staging.
```

### Pattern 3: Convert Between Formats

**Prompt:**
```
Convert this Mermaid diagram to AIGP format:

flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
```

### Pattern 4: Refactor Diagram

**Prompt:**
```
Refactor user-flow.json to use more specific node types and add
data fields for page routes and user roles.
```

## Example Workflows

### Workflow 1: Architecture Documentation

1. **Create diagram:**
   ```
   Create an AIGP architecture diagram for a microservices e-commerce system
   with: API Gateway, Auth Service, Product Service, Order Service, Payment Service,
   PostgreSQL databases, Redis cache, and Kafka message queue
   ```

2. **Add details:**
   ```
   Add technology stack to each component:
   - API Gateway: Kong
   - Auth Service: Node.js + JWT
   - Product Service: Go
   - Order Service: Java Spring Boot
   - Payment Service: Python FastAPI
   ```

3. **Generate documentation:**
   ```bash
   aigp convert architecture.json mermaid > README.md
   ```

### Workflow 2: Process Modeling

1. **Create BPMN diagram:**
   ```
   Create an AIGP BPMN diagram for expense approval process:
   - Employee submits expense
   - Manager reviews
   - If > $500, needs finance approval
   - If approved, process reimbursement
   - Notify employee of status
   ```

2. **Validate:**
   ```bash
   aigp validate expense-approval.json
   ```

3. **Export to multiple formats:**
   ```bash
   aigp convert expense-approval.json mermaid
   aigp convert expense-approval.json svg
   ```

### Workflow 3: Database Design

1. **Create ER diagram:**
   ```
   Create an AIGP ER diagram for a blog platform with:
   - Users (id, email, name, created_at)
   - Posts (id, user_id FK, title, content, published_at)
   - Comments (id, post_id FK, user_id FK, text, created_at)
   - Tags (id, name)
   - Post-Tag many-to-many relationship
   ```

2. **Generate SQL schema:**
   ```
   From blog-schema.json, generate PostgreSQL CREATE TABLE statements
   ```

## AI Agent Capabilities

Cursor can help with:

### 1. Diagram Creation
- Generate from natural language descriptions
- Follow AIGP schema and conventions
- Choose appropriate layout algorithms
- Add meaningful metadata

### 2. Diagram Editing
- Add/remove/modify nodes and edges
- Restructure layouts
- Update metadata and descriptions
- Refactor node types

### 3. Validation & Quality
- Check schema compliance
- Suggest improvements
- Identify missing fields
- Recommend better node types

### 4. Format Conversion
- Convert Mermaid → AIGP
- Convert PlantUML → AIGP
- Generate Mermaid from AIGP
- Export to SVG/PNG/PDF

### 5. Documentation
- Generate diagram descriptions
- Create usage examples
- Write integration guides
- Document workflows

## Prompt Templates

### Create Flowchart
```
Create an AIGP flowchart diagram for [PROCESS NAME] with the following steps:
[LIST STEPS]

Requirements:
- Use [hierarchical/timeline/force] layout
- Include decision points at [LOCATIONS]
- Add error handling for [SCENARIOS]
- Tag with: [TAGS]
```

### Create Sequence Diagram
```
Create an AIGP sequence diagram showing [INTERACTION NAME] between:
[LIST ACTORS]

Steps:
[LIST MESSAGES AND INTERACTIONS]

Include both synchronous and asynchronous messages where appropriate.
```

### Create Architecture Diagram
```
Create an AIGP architecture diagram for [SYSTEM NAME] showing:

Components:
[LIST COMPONENTS WITH TECHNOLOGIES]

Data flows:
[DESCRIBE CONNECTIONS]

Layout: [hierarchical/layered/radial]
```

### Refactor Existing Diagram
```
Refactor [filename].json to:
1. [CHANGE 1]
2. [CHANGE 2]
3. [CHANGE 3]

Maintain existing node IDs where possible.
```

## Tips & Tricks

### Tip 1: Use Descriptive Node IDs
**Bad:**
```json
{ "id": "n1", "label": "Process Order" }
```

**Good:**
```json
{ "id": "process_order", "label": "Process Order" }
```

### Tip 2: Add Domain Data
```json
{
  "id": "api_gateway",
  "type": "component",
  "label": "API Gateway",
  "data": {
    "technology": "Kong",
    "port": 8080,
    "replicas": 3,
    "health_check": "/health"
  }
}
```

### Tip 3: Use Appropriate Layouts
- **Flowchart**: hierarchical (TB/LR)
- **Sequence**: timeline (LR)
- **Architecture**: layered/hierarchical
- **Mind Map**: radial
- **Network**: force-directed

### Tip 4: Leverage Cursor's Context
```
Using the AIGP examples in /examples, create a similar diagram for [YOUR USE CASE]
```

### Tip 5: Iterate with AI
1. Create initial diagram
2. Ask for improvements
3. Add specific details
4. Refactor for clarity
5. Validate and export

## Keyboard Shortcuts

When working with AIGP in Cursor:

- `Cmd+K` - Open AI chat for inline editing
- `Cmd+L` - Open AI chat in sidebar
- `Cmd+Shift+P` - Command palette
- `Cmd+B` - Toggle sidebar (view examples)

## Troubleshooting

### Issue: Invalid AIGP Format
**Solution:**
```
The AIGP file has validation errors. Fix the following:
[PASTE ERROR MESSAGE]

Reference: docs/PROTOCOL.md
```

### Issue: Layout Not Working
**Solution:**
```
The diagram layout looks wrong. Try these layout algorithms:
- hierarchical: TB or LR direction
- force: for network diagrams
- timeline: for sequence diagrams
- radial: for mind maps

Update the layout section to use [ALGORITHM].
```

### Issue: Node Types Unclear
**Solution:**
```
What are the correct node types for a [DIAGRAM TYPE] diagram?

Reference: docs/PROTOCOL.md#node-types
```

## Integration with Other Tools

### With Git
```bash
# Add pre-commit hook to validate AIGP files
echo '#!/bin/sh
for file in $(git diff --cached --name-only | grep "\.json$"); do
  aigp validate "$file" || exit 1
done' > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit
```

### With Documentation
```markdown
<!-- In your README.md -->
## Architecture

<!-- Cursor will render AIGP diagrams inline with Mermaid -->
```

### With CI/CD
```yaml
# .github/workflows/validate-diagrams.yml
name: Validate AIGP Diagrams

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm add -g @aigraphia/cli
      - run: find . -name "*.json" -exec aigp validate {} \;
```

## Resources

- [AIGP Protocol Specification](./PROTOCOL.md)
- [Example Gallery](../examples/README.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Cursor Documentation](https://cursor.sh/docs)

## Community

- GitHub: https://github.com/aigp/aigp
- Discord: [Coming Soon]
- Issues: https://github.com/aigp/aigp/issues

---

**Next Steps:**
1. Install AIGP CLI
2. Add `.cursorrules` to your project
3. Try creating your first diagram
4. Explore the example gallery
5. Join the community

Happy diagramming! 🎨

