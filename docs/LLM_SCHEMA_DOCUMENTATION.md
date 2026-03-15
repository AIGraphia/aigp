# LLM Schema Documentation

## Overview

Structured documentation and examples specifically designed to help Large Language Models generate valid AIGP diagrams efficiently.

---

## 1. LLM-Optimized Schema Reference

### Core Structure Template

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "<DIAGRAM_TYPE>",
  "metadata": {
    "title": "<DESCRIPTIVE_TITLE>",
    "description": "<OPTIONAL_DESCRIPTION>",
    "author": "<OPTIONAL_AUTHOR>",
    "created": "<ISO_8601_DATE>",
    "modified": "<ISO_8601_DATE>",
    "tags": ["<TAG1>", "<TAG2>"]
  },
  "graph": {
    "nodes": [
      {
        "id": "<UNIQUE_ID>",
        "type": "<NODE_TYPE>",
        "label": "<READABLE_LABEL>",
        "data": {},
        "position": { "x": 0, "y": 0 }
      }
    ],
    "edges": [
      {
        "id": "<UNIQUE_ID>",
        "source": "<SOURCE_NODE_ID>",
        "target": "<TARGET_NODE_ID>",
        "type": "<EDGE_TYPE>",
        "label": "<OPTIONAL_LABEL>",
        "data": {}
      }
    ]
  },
  "layout": {
    "algorithm": "<LAYOUT_ALGORITHM>",
    "direction": "<TB|LR|BT|RL>",
    "spacing": 100,
    "rankSeparation": 150
  }
}
```

---

## 2. Diagram Type Quick Reference

| Type | When to Use | Common Nodes | Common Edges |
|------|-------------|--------------|--------------|
| `flowchart` | Processes, workflows, algorithms | start, process, decision, end | flow |
| `sequence` | Interactions over time | actor, object, lifeline | message, return, create, destroy |
| `class` | Object-oriented design | class, interface, abstract | association, inheritance, composition, aggregation |
| `er` | Database schemas | entity, attribute, relationship | one-to-one, one-to-many, many-to-many |
| `state` | State machines | state, initial, final | transition |
| `network` | Infrastructure, topology | server, router, firewall, database | connection, data-flow |
| `component` | System architecture | component, interface, package | dependency, provides, requires |
| `deployment` | Deployment architecture | node, artifact, device | deploys, communicates |
| `timeline` | Chronological events | event, milestone, phase | follows, triggers |
| `gantt` | Project schedules | task, milestone | dependency, starts-after |
| `mindmap` | Brainstorming, hierarchies | topic, subtopic, idea | branch |

---

## 3. Node Type Reference by Diagram Type

### Flowchart Nodes

```json
{
  "start": "Starting point (rounded rectangle)",
  "end": "Ending point (rounded rectangle)",
  "process": "Processing step (rectangle)",
  "decision": "Conditional branch (diamond)",
  "subprocess": "Sub-process (rectangle with double border)",
  "data": "Data input/output (parallelogram)",
  "document": "Document (wavy bottom)",
  "database": "Database access (cylinder)",
  "manual": "Manual operation (trapezoid)"
}
```

**Example:**
```json
{
  "id": "validate",
  "type": "decision",
  "label": "Valid Input?",
  "data": {
    "condition": "input.length > 0 && input.match(/^[a-z]+$/)"
  }
}
```

### Sequence Diagram Nodes

```json
{
  "actor": "Human actor (stick figure)",
  "object": "System component (rectangle)",
  "lifeline": "Object lifetime (vertical dashed line)",
  "activation": "Active period (thin rectangle on lifeline)"
}
```

### Class Diagram Nodes

```json
{
  "class": "Class with attributes and methods",
  "interface": "Interface definition",
  "abstract": "Abstract class",
  "enum": "Enumeration"
}
```

**Example:**
```json
{
  "id": "user_class",
  "type": "class",
  "label": "User",
  "data": {
    "attributes": [
      "- id: string",
      "- email: string",
      "- password: string"
    ],
    "methods": [
      "+ login(): boolean",
      "+ logout(): void",
      "+ resetPassword(email: string): void"
    ]
  }
}
```

### ER Diagram Nodes

```json
{
  "entity": "Database table (rectangle)",
  "attribute": "Table column (oval)",
  "relationship": "Relationship between entities (diamond)"
}
```

---

## 4. Edge Type Reference

### Flowchart Edges

```json
{
  "flow": "Standard flow (solid arrow)",
  "conditional": "Conditional flow with label (solid arrow + label)",
  "data-flow": "Data transfer (dashed arrow)"
}
```

### Sequence Diagram Edges

```json
{
  "message": "Synchronous message (solid arrow)",
  "return": "Return message (dashed arrow)",
  "async": "Asynchronous message (open arrow)",
  "create": "Object creation (dashed arrow to new object)",
  "destroy": "Object destruction (arrow to X)"
}
```

### Class Diagram Edges

```json
{
  "association": "Basic association (solid line)",
  "inheritance": "Inheritance/extends (solid line + hollow arrow)",
  "implementation": "Interface implementation (dashed line + hollow arrow)",
  "composition": "Strong ownership (solid line + filled diamond)",
  "aggregation": "Weak ownership (solid line + hollow diamond)",
  "dependency": "Dependency (dashed line + arrow)"
}
```

---

## 5. Layout Algorithm Guide

| Algorithm | Best For | Direction | Spacing |
|-----------|----------|-----------|---------|
| `hierarchical` | Flowcharts, trees, workflows | TB, LR | 100-150 |
| `force` | Networks, clusters | N/A | 50-100 |
| `timeline` | Sequences, chronological | LR | 200-300 |
| `circular` | Cycles, relationships | N/A | 150-200 |
| `radial` | Hierarchies with central node | N/A | 100-150 |
| `grid` | Evenly distributed nodes | N/A | 100 |
| `manual` | User-specified positions | N/A | N/A |

---

## 6. Common Patterns

### Pattern 1: Simple Sequential Flow

```json
{
  "type": "flowchart",
  "graph": {
    "nodes": [
      { "id": "start", "type": "start", "label": "Start" },
      { "id": "step1", "type": "process", "label": "Step 1" },
      { "id": "step2", "type": "process", "label": "Step 2" },
      { "id": "end", "type": "end", "label": "End" }
    ],
    "edges": [
      { "id": "e1", "source": "start", "target": "step1" },
      { "id": "e2", "source": "step1", "target": "step2" },
      { "id": "e3", "source": "step2", "target": "end" }
    ]
  }
}
```

### Pattern 2: Decision Branch

```json
{
  "nodes": [
    { "id": "process", "type": "process", "label": "Process Data" },
    { "id": "check", "type": "decision", "label": "Valid?" },
    { "id": "success", "type": "end", "label": "Success" },
    { "id": "error", "type": "end", "label": "Error" }
  ],
  "edges": [
    { "id": "e1", "source": "process", "target": "check" },
    { "id": "e2", "source": "check", "target": "success", "label": "Yes" },
    { "id": "e3", "source": "check", "target": "error", "label": "No" }
  ]
}
```

### Pattern 3: Loop/Retry Logic

```json
{
  "nodes": [
    { "id": "attempt", "type": "process", "label": "Attempt Operation" },
    { "id": "check", "type": "decision", "label": "Success?" },
    { "id": "retry_check", "type": "decision", "label": "Retries Left?" },
    { "id": "success", "type": "end", "label": "Complete" },
    { "id": "fail", "type": "end", "label": "Failed" }
  ],
  "edges": [
    { "id": "e1", "source": "attempt", "target": "check" },
    { "id": "e2", "source": "check", "target": "success", "label": "Yes" },
    { "id": "e3", "source": "check", "target": "retry_check", "label": "No" },
    { "id": "e4", "source": "retry_check", "target": "attempt", "label": "Yes" },
    { "id": "e5", "source": "retry_check", "target": "fail", "label": "No" }
  ]
}
```

### Pattern 4: Parallel Paths

```json
{
  "nodes": [
    { "id": "start", "type": "start", "label": "Start" },
    { "id": "fork", "type": "process", "label": "Fork" },
    { "id": "path1", "type": "process", "label": "Path 1" },
    { "id": "path2", "type": "process", "label": "Path 2" },
    { "id": "join", "type": "process", "label": "Join" },
    { "id": "end", "type": "end", "label": "End" }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "fork" },
    { "id": "e2", "source": "fork", "target": "path1" },
    { "id": "e3", "source": "fork", "target": "path2" },
    { "id": "e4", "source": "path1", "target": "join" },
    { "id": "e5", "source": "path2", "target": "join" },
    { "id": "e6", "source": "join", "target": "end" }
  ]
}
```

---

## 7. Validation Checklist for LLMs

Before outputting AIGP JSON, verify:

✅ **Required fields present:**
- [ ] `schema` = "https://aigraphia.com/schema/v1"
- [ ] `version` = "1.0.0"
- [ ] `type` in [flowchart, sequence, class, er, state, network, component, deployment, timeline, gantt, mindmap]
- [ ] `metadata.title` is descriptive
- [ ] `graph.nodes` is array with at least 1 node
- [ ] `graph.edges` is array

✅ **Node validation:**
- [ ] Each node has unique `id`
- [ ] Each node has valid `type` for diagram type
- [ ] Each node has readable `label` (not just ID)
- [ ] `data` field is object (can be empty)

✅ **Edge validation:**
- [ ] Each edge has unique `id`
- [ ] Each edge `source` exists in nodes
- [ ] Each edge `target` exists in nodes
- [ ] No self-loops (source != target) unless intentional
- [ ] `type` is valid for diagram type

✅ **Layout validation:**
- [ ] `algorithm` is valid layout type
- [ ] `direction` is TB, LR, BT, or RL (if applicable)
- [ ] Numeric values are positive

---

## 8. Error Prevention Guide

### Common Mistake 1: Missing Schema/Version

❌ **Wrong:**
```json
{
  "type": "flowchart",
  "graph": { ... }
}
```

✅ **Correct:**
```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": { ... },
  "graph": { ... }
}
```

### Common Mistake 2: Invalid Edge References

❌ **Wrong:**
```json
{
  "nodes": [
    { "id": "a", "type": "process", "label": "A" }
  ],
  "edges": [
    { "id": "e1", "source": "a", "target": "b" }  // "b" doesn't exist!
  ]
}
```

✅ **Correct:**
```json
{
  "nodes": [
    { "id": "a", "type": "process", "label": "A" },
    { "id": "b", "type": "process", "label": "B" }
  ],
  "edges": [
    { "id": "e1", "source": "a", "target": "b" }
  ]
}
```

### Common Mistake 3: Wrong Node Type for Diagram

❌ **Wrong:**
```json
{
  "type": "sequence",
  "graph": {
    "nodes": [
      { "id": "n1", "type": "process", "label": "Process" }  // Wrong type!
    ]
  }
}
```

✅ **Correct:**
```json
{
  "type": "sequence",
  "graph": {
    "nodes": [
      { "id": "n1", "type": "actor", "label": "User" }
    ]
  }
}
```

### Common Mistake 4: Missing Metadata

❌ **Wrong:**
```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "graph": { ... }
}
```

✅ **Correct:**
```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "User Login Flow",
    "description": "Authentication process with validation"
  },
  "graph": { ... }
}
```

---

## 9. Complete Examples for Training

### Example 1: User Authentication Flowchart

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "User Authentication Flow",
    "description": "Login process with email and password validation",
    "tags": ["authentication", "security", "login"]
  },
  "graph": {
    "nodes": [
      { "id": "start", "type": "start", "label": "User Visits Login Page" },
      { "id": "enter_creds", "type": "process", "label": "Enter Email & Password" },
      { "id": "validate_format", "type": "decision", "label": "Valid Format?" },
      { "id": "check_db", "type": "database", "label": "Check Database" },
      { "id": "creds_match", "type": "decision", "label": "Credentials Match?" },
      { "id": "create_session", "type": "process", "label": "Create Session Token" },
      { "id": "redirect", "type": "end", "label": "Redirect to Dashboard" },
      { "id": "show_error", "type": "end", "label": "Show Error Message" }
    ],
    "edges": [
      { "id": "e1", "source": "start", "target": "enter_creds", "type": "flow" },
      { "id": "e2", "source": "enter_creds", "target": "validate_format", "type": "flow" },
      { "id": "e3", "source": "validate_format", "target": "check_db", "type": "flow", "label": "Yes" },
      { "id": "e4", "source": "validate_format", "target": "show_error", "type": "flow", "label": "No" },
      { "id": "e5", "source": "check_db", "target": "creds_match", "type": "flow" },
      { "id": "e6", "source": "creds_match", "target": "create_session", "type": "flow", "label": "Yes" },
      { "id": "e7", "source": "creds_match", "target": "show_error", "type": "flow", "label": "No" },
      { "id": "e8", "source": "create_session", "target": "redirect", "type": "flow" }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB",
    "spacing": 100,
    "rankSeparation": 150
  }
}
```

### Example 2: E-commerce Class Diagram

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "class",
  "metadata": {
    "title": "E-commerce Domain Model",
    "description": "Core classes for online shopping system",
    "tags": ["ecommerce", "domain-model", "class-diagram"]
  },
  "graph": {
    "nodes": [
      {
        "id": "user",
        "type": "class",
        "label": "User",
        "data": {
          "attributes": ["- id: string", "- email: string", "- name: string"],
          "methods": ["+ login(): boolean", "+ logout(): void"]
        }
      },
      {
        "id": "cart",
        "type": "class",
        "label": "ShoppingCart",
        "data": {
          "attributes": ["- items: CartItem[]", "- total: number"],
          "methods": ["+ addItem(product: Product): void", "+ removeItem(id: string): void", "+ calculateTotal(): number"]
        }
      },
      {
        "id": "product",
        "type": "class",
        "label": "Product",
        "data": {
          "attributes": ["- id: string", "- name: string", "- price: number", "- stock: number"],
          "methods": ["+ updateStock(quantity: number): void"]
        }
      },
      {
        "id": "order",
        "type": "class",
        "label": "Order",
        "data": {
          "attributes": ["- id: string", "- status: OrderStatus", "- items: OrderItem[]", "- total: number"],
          "methods": ["+ placeOrder(): boolean", "+ cancel(): void"]
        }
      }
    ],
    "edges": [
      { "id": "e1", "source": "user", "target": "cart", "type": "composition", "label": "1..1" },
      { "id": "e2", "source": "cart", "target": "product", "type": "association", "label": "0..*" },
      { "id": "e3", "source": "user", "target": "order", "type": "association", "label": "0..*" },
      { "id": "e4", "source": "order", "target": "product", "type": "association", "label": "1..*" }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

### Example 3: API Sequence Diagram

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "sequence",
  "metadata": {
    "title": "RESTful API Call Sequence",
    "description": "User authentication via API",
    "tags": ["api", "sequence", "authentication"]
  },
  "graph": {
    "nodes": [
      { "id": "client", "type": "actor", "label": "Client App" },
      { "id": "api_gateway", "type": "object", "label": "API Gateway" },
      { "id": "auth_service", "type": "object", "label": "Auth Service" },
      { "id": "database", "type": "object", "label": "User DB" }
    ],
    "edges": [
      { "id": "e1", "source": "client", "target": "api_gateway", "type": "message", "label": "POST /login" },
      { "id": "e2", "source": "api_gateway", "target": "auth_service", "type": "message", "label": "validateCredentials()" },
      { "id": "e3", "source": "auth_service", "target": "database", "type": "message", "label": "SELECT * FROM users" },
      { "id": "e4", "source": "database", "target": "auth_service", "type": "return", "label": "user data" },
      { "id": "e5", "source": "auth_service", "target": "api_gateway", "type": "return", "label": "token" },
      { "id": "e6", "source": "api_gateway", "target": "client", "type": "return", "label": "200 OK + token" }
    ]
  },
  "layout": {
    "algorithm": "timeline",
    "direction": "LR"
  }
}
```

---

## 10. Tips for LLM Diagram Generation

1. **Always start with the template** - Include all required fields from the beginning
2. **Use descriptive labels** - "Validate User Input" not "Validate"
3. **Verify edge references** - Every source/target must exist in nodes
4. **Choose appropriate types** - Match node types to diagram type
5. **Add decision labels** - Use "Yes"/"No" or conditions on decision edges
6. **Include metadata** - Title and description help users understand
7. **Use consistent IDs** - Simple alphanumeric like "n1", "n2", "e1", "e2"
8. **Add layout hints** - Specify algorithm and direction
9. **Keep it simple first** - Start with 5-10 nodes, expand if needed
10. **Validate before output** - Check against the validation checklist

---

## 11. JSON Schema for Validation

Full JSON Schema available at: `https://aigraphia.com/schema/v1/aigp.json`

Use this for automated validation in LLM post-processing pipelines.

---

## 12. Token-Efficient Representation

For token-limited contexts, use this compact format:

```json
{
  "$schema": "https://aigraphia.com/schema/v1",
  "v": "1.0.0",
  "t": "flowchart",
  "m": {"title": "Process"},
  "g": {
    "n": [
      {"i": "n1", "t": "start", "l": "Start"},
      {"i": "n2", "t": "process", "l": "Step"}
    ],
    "e": [
      {"i": "e1", "s": "n1", "t": "n2"}
    ]
  }
}
```

Expand to full format before output.

---

## Resources

- Full Protocol Documentation: `/docs/PROTOCOL.md`
- Validation Library: `@aigraphia/protocol`
- Example Gallery: `https://aigp.dev/examples`
- Interactive Schema Builder: `https://aigp.dev/builder`
