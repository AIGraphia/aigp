# AIGraphia Edit - Modify Existing Diagrams

## Purpose

Modify existing AIGraph diagrams based on user feedback.

## Capabilities

- Add/remove nodes
- Add/remove edges
- Modify labels and properties
- Update metadata
- Restructure layout
- Change diagram type (if appropriate)

## Input

Expect one of:
1. AIGraph JSON document to modify
2. Reference to previously created diagram
3. Description of changes to make

## Process

1. **Parse existing diagram**: Validate and understand current structure
2. **Identify changes**: Understand what user wants to modify
3. **Apply changes**: Update JSON maintaining validity
4. **Validate**: Ensure result is valid AIGraph
5. **Output**: Return modified diagram in appropriate format

## Example Operations

### Add Node

User: "Add a caching layer between API and database"

Action:
1. Add new node: `{"id": "cache", "type": "cache", "label": "Redis Cache", "data": {}}`
2. Update edges to route through cache
3. Maintain proper connections

### Remove Node

User: "Remove the external service"

Action:
1. Delete node with matching ID
2. Remove all edges connected to that node
3. Check for orphaned nodes

### Modify Labels

User: "Change 'User Service' to 'Profile Service'"

Action:
1. Find node with label "User Service"
2. Update label to "Profile Service"
3. Optionally update ID if semantic

### Restructure

User: "Group auth and user services in a VPC"

Action:
1. Create group: `{"id": "vpc1", "type": "vpc", "label": "VPC", "nodeIds": ["auth", "users"], "data": {}}`
2. Add to `graph.groups`

## Output Format

Same as aigraphia-create - platform-specific:
- ChatGPT/Claude: Mermaid markdown
- Cursor: Write to file
- Generic: Shareable URL

## Response Template

"I've updated the diagram:

**Changes:**
- Added Redis cache between API and database
- Rerouted data flow through cache
- Added cache-database connection

\`\`\`mermaid
[Updated diagram]
\`\`\`

[View in AIGraphia Editor](https://aigraphia.com/view?data=...)"
