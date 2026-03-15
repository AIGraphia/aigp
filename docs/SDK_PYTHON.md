# AIGP Python SDK

## Installation

```bash
pip install aigp
```

## Quick Start

```python
from aigp import AIGPDocument, Node, Edge, validate, to_mermaid

# Create a diagram
diagram = AIGPDocument(
    type="flowchart",
    metadata={
        "title": "User Authentication",
        "description": "Login flow with validation"
    },
    graph={
        "nodes": [
            Node(id="start", type="start", label="Login"),
            Node(id="validate", type="process", label="Validate Credentials"),
            Node(id="check", type="decision", label="Valid?"),
            Node(id="success", type="end", label="Access Granted"),
            Node(id="error", type="end", label="Access Denied")
        ],
        "edges": [
            Edge(id="e1", source="start", target="validate"),
            Edge(id="e2", source="validate", target="check"),
            Edge(id="e3", source="check", target="success", label="Yes"),
            Edge(id="e4", source="check", target="error", label="No")
        ]
    }
)

# Validate
result = validate(diagram)
if result.valid:
    print("✓ Diagram is valid")
else:
    print(f"✗ Errors: {result.errors}")

# Convert to Mermaid
mermaid = to_mermaid(diagram)
print(mermaid)

# Save
diagram.save("auth-flow.json")

# Load
loaded = AIGPDocument.load("auth-flow.json")
```

## API Reference

### AIGPDocument

```python
class AIGPDocument:
    def __init__(
        self,
        type: str,
        metadata: dict,
        graph: dict,
        layout: dict = None,
        version: str = "1.0.0"
    ):
        """Create a new AIGP document."""
        pass

    def save(self, path: str) -> None:
        """Save diagram to file."""
        pass

    @staticmethod
    def load(path: str) -> 'AIGPDocument':
        """Load diagram from file."""
        pass

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        pass

    def to_json(self, indent: int = 2) -> str:
        """Convert to JSON string."""
        pass

    @staticmethod
    def from_dict(data: dict) -> 'AIGPDocument':
        """Create from dictionary."""
        pass

    @staticmethod
    def from_json(json_str: str) -> 'AIGPDocument':
        """Create from JSON string."""
        pass
```

### Node

```python
class Node:
    def __init__(
        self,
        id: str,
        type: str,
        label: str,
        data: dict = None,
        position: dict = None
    ):
        """Create a node."""
        self.id = id
        self.type = type
        self.label = label
        self.data = data or {}
        self.position = position
```

### Edge

```python
class Edge:
    def __init__(
        self,
        id: str,
        source: str,
        target: str,
        type: str = "flow",
        label: str = None,
        data: dict = None
    ):
        """Create an edge."""
        self.id = id
        self.source = source
        self.target = target
        self.type = type
        self.label = label
        self.data = data or {}
```

### Validation

```python
def validate(diagram: AIGPDocument) -> ValidationResult:
    """
    Validate an AIGP diagram.

    Returns:
        ValidationResult with `valid` bool and `errors` list
    """
    pass

class ValidationResult:
    def __init__(self, valid: bool, errors: list = None, warnings: list = None):
        self.valid = valid
        self.errors = errors or []
        self.warnings = warnings or []
```

### Converters

```python
# Mermaid
def from_mermaid(mermaid: str) -> AIGPDocument:
    """Convert Mermaid to AIGP."""
    pass

def to_mermaid(diagram: AIGPDocument) -> str:
    """Convert AIGP to Mermaid."""
    pass

# PlantUML
def from_plantuml(plantuml: str) -> AIGPDocument:
    """Convert PlantUML to AIGP."""
    pass

def to_plantuml(diagram: AIGPDocument) -> str:
    """Convert AIGP to PlantUML."""
    pass

# DOT (Graphviz)
def from_dot(dot: str) -> AIGPDocument:
    """Convert DOT to AIGP."""
    pass

def to_dot(diagram: AIGPDocument) -> str:
    """Convert AIGP to DOT."""
    pass

# GraphML
def from_graphml(graphml: str) -> AIGPDocument:
    """Convert GraphML to AIGP."""
    pass

def to_graphml(diagram: AIGPDocument) -> str:
    """Convert AIGP to GraphML."""
    pass

# Images
def to_svg(diagram: AIGPDocument, options: dict = None) -> str:
    """Render diagram to SVG."""
    pass

def to_png(diagram: AIGPDocument, path: str, options: dict = None) -> None:
    """Render diagram to PNG file."""
    pass

def to_pdf(diagram: AIGPDocument, path: str, options: dict = None) -> None:
    """Render diagram to PDF file."""
    pass
```

### Layout

```python
def apply_layout(
    diagram: AIGPDocument,
    algorithm: str = "hierarchical",
    direction: str = "TB"
) -> AIGPDocument:
    """
    Apply layout algorithm to diagram.

    Args:
        algorithm: 'hierarchical', 'force', 'timeline', 'circular', 'radial', 'grid', 'manual'
        direction: 'TB' (top-bottom), 'LR' (left-right), 'BT', 'RL'

    Returns:
        Diagram with positioned nodes
    """
    pass
```

### Performance

```python
def analyze_performance(diagram: AIGPDocument) -> dict:
    """Analyze diagram performance metrics."""
    pass

def optimize_diagram(
    diagram: AIGPDocument,
    max_nodes: int = 500,
    remove_orphans: bool = True,
    merge_parallel_edges: bool = True
) -> AIGPDocument:
    """Optimize diagram for performance."""
    pass

def paginate_diagram(
    diagram: AIGPDocument,
    page_size: int = 100
) -> list[AIGPDocument]:
    """Split large diagram into pages."""
    pass
```

## Examples

### Example 1: Generate Flowchart

```python
from aigp import AIGPDocument, Node, Edge

def create_checkout_flow():
    nodes = [
        Node("start", "start", "Begin Checkout"),
        Node("cart", "process", "Review Cart"),
        Node("shipping", "process", "Enter Shipping"),
        Node("payment", "process", "Enter Payment"),
        Node("validate", "decision", "Validate?"),
        Node("complete", "end", "Order Complete"),
        Node("error", "end", "Show Error")
    ]

    edges = [
        Edge("e1", "start", "cart"),
        Edge("e2", "cart", "shipping"),
        Edge("e3", "shipping", "payment"),
        Edge("e4", "payment", "validate"),
        Edge("e5", "validate", "complete", label="Valid"),
        Edge("e6", "validate", "error", label="Invalid"),
        Edge("e7", "error", "payment", label="Retry")
    ]

    return AIGPDocument(
        type="flowchart",
        metadata={"title": "Checkout Flow"},
        graph={"nodes": nodes, "edges": edges}
    )

diagram = create_checkout_flow()
diagram.save("checkout.json")
```

### Example 2: Load and Validate

```python
from aigp import AIGPDocument, validate

# Load diagram
diagram = AIGPDocument.load("diagram.json")

# Validate
result = validate(diagram)

if not result.valid:
    for error in result.errors:
        print(f"Error: {error}")
else:
    print("✓ Valid diagram")

# Check warnings
for warning in result.warnings:
    print(f"Warning: {warning}")
```

### Example 3: Convert Formats

```python
from aigp import from_mermaid, to_dot, AIGPDocument

# From Mermaid
mermaid_code = """
graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[End]
    C -->|No| B
"""

diagram = from_mermaid(mermaid_code)

# To DOT (Graphviz)
dot = to_dot(diagram)
with open("output.dot", "w") as f:
    f.write(dot)

# Render to PNG
diagram.to_png("output.png", options={"width": 1200, "height": 800})
```

### Example 4: Optimize Large Diagram

```python
from aigp import AIGPDocument, optimize_diagram, analyze_performance

# Load large diagram
diagram = AIGPDocument.load("large-diagram.json")

# Analyze
metrics = analyze_performance(diagram)
print(f"Nodes: {metrics['nodeCount']}")
print(f"Edges: {metrics['edgeCount']}")
print(f"Complexity: {metrics['complexity']}/100")

# Optimize
optimized = optimize_diagram(
    diagram,
    max_nodes=500,
    remove_orphans=True,
    merge_parallel_edges=True
)

print(f"Reduced to {len(optimized.graph['nodes'])} nodes")
```

### Example 5: Pagination

```python
from aigp import AIGPDocument, paginate_diagram

diagram = AIGPDocument.load("huge-diagram.json")

# Split into pages
pages = paginate_diagram(diagram, page_size=100)

print(f"Split into {len(pages)} pages")

for i, page in enumerate(pages):
    page.save(f"page-{i+1}.json")
```

### Example 6: Diff and Merge

```python
from aigp import AIGPDocument, diff_diagrams, merge_diagrams

# Load versions
v1 = AIGPDocument.load("diagram-v1.json")
v2 = AIGPDocument.load("diagram-v2.json")

# Diff
diff = diff_diagrams(v1, v2)
print(f"Added nodes: {len(diff['added_nodes'])}")
print(f"Removed nodes: {len(diff['removed_nodes'])}")
print(f"Similarity: {diff['similarity']:.1%}")

# Merge multiple diagrams
auth = AIGPDocument.load("auth.json")
payment = AIGPDocument.load("payment.json")
checkout = AIGPDocument.load("checkout.json")

merged = merge_diagrams([auth, payment, checkout], strategy="smart")
merged.save("complete-flow.json")
```

### Example 7: Custom Layout

```python
from aigp import AIGPDocument, apply_layout

diagram = AIGPDocument.load("diagram.json")

# Apply hierarchical layout
laid_out = apply_layout(diagram, algorithm="hierarchical", direction="LR")

# Apply force-directed layout
force_layout = apply_layout(diagram, algorithm="force")

# Save
laid_out.save("diagram-hierarchical.json")
force_layout.save("diagram-force.json")
```

## Type Hints

```python
from typing import List, Dict, Optional, Union
from dataclasses import dataclass

@dataclass
class Node:
    id: str
    type: str
    label: str
    data: Optional[Dict] = None
    position: Optional[Dict] = None

@dataclass
class Edge:
    id: str
    source: str
    target: str
    type: str = "flow"
    label: Optional[str] = None
    data: Optional[Dict] = None

@dataclass
class ValidationResult:
    valid: bool
    errors: List[str]
    warnings: List[str]
```

## Installation from Source

```bash
git clone https://github.com/aigp/aigp-python.git
cd aigp-python
pip install -e .
```

## Testing

```bash
pytest tests/
```

## Contributing

See [CONTRIBUTING.md](https://github.com/aigp/aigp-python/blob/main/CONTRIBUTING.md)

## License

MIT License - see [LICENSE](https://github.com/aigp/aigp-python/blob/main/LICENSE)
