# AIGP CLI Improvements

## Overview

Enhanced command-line interface with advanced features for diagram manipulation, validation, and automation.

---

## Installation

```bash
pnpm add -g @aigraphia/cli
```

---

## Enhanced Commands

### 1. Interactive Diagram Creation

```bash
aigp create --interactive
```

**Features:**
- Step-by-step guided diagram creation
- Template selection menu
- Node/edge addition wizard
- Real-time validation
- Preview in terminal (ASCII art)

**Example Session:**

```
$ aigp create --interactive

Welcome to AIGP Interactive Creator!

? Select diagram type: (Use arrow keys)
❯ flowchart
  sequence
  class
  er
  state
  network

? Diagram title: User Authentication Flow
? Description: Login process with validation

? Add your first node:
? Node ID: start
? Node type: (Use arrow keys)
❯ start
  process
  decision
  end
? Node label: Begin Login

✓ Node 'start' added

? Add another node? (Y/n) y

? Node ID: validate
? Node type: process
? Node label: Validate Credentials

✓ Node 'validate' added

? Add another node? (Y/n) n

? Add edges between nodes? (Y/n) y

? Source node: start
? Target node: validate
? Edge label (optional):

✓ Edge added: start → validate

? Add another edge? (Y/n) n

? Apply layout algorithm? (Y/n) y
? Select layout: hierarchical

✓ Layout applied

Preview:
┌────────────────┐
│  Begin Login   │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Validate     │
│  Credentials   │
└────────────────┘

? Save diagram? (Y/n) y
? Filename: auth-flow.json

✓ Diagram saved to auth-flow.json
```

---

### 2. Batch Operations

```bash
aigp validate *.json --parallel
aigp convert *.json --from agf --to mermaid --output dist/
aigp optimize diagrams/ --output optimized/ --max-nodes 100
```

**Options:**
- `--parallel` - Process files in parallel
- `--workers N` - Number of parallel workers (default: CPU cores)
- `--fail-fast` - Stop on first error
- `--summary` - Show summary after batch operation
- `--dry-run` - Preview what would be done

**Example:**

```
$ aigp validate diagrams/*.json --parallel --summary

Processing 15 files...

✓ auth-flow.json [127ms]
✓ checkout-process.json [98ms]
✗ broken-diagram.json [23ms]
  - Error: Missing required field 'schema'
  - Error: Node 'invalid_id' referenced in edge but not found
✓ database-schema.json [156ms]
...

Summary:
  Total: 15 files
  Valid: 13 (87%)
  Invalid: 2 (13%)
  Duration: 1.4s
```

---

### 3. Watch Mode

```bash
aigp watch src/ --convert mermaid --output dist/
```

**Features:**
- Real-time file monitoring
- Automatic conversion on file changes
- Error notifications
- Incremental updates only

**Example:**

```
$ aigp watch src/ --convert mermaid --output dist/

👁  Watching src/ for changes...

[10:23:45] Changed: src/auth.json
[10:23:45] Converting to Mermaid... ✓
[10:23:45] Saved: dist/auth.md

[10:24:12] Changed: src/checkout.json
[10:24:12] Converting to Mermaid... ✓
[10:24:12] Saved: dist/checkout.md

Press Ctrl+C to stop
```

---

### 4. Server Mode

```bash
aigp serve --port 3000 --cors
```

**Features:**
- HTTP API for diagram operations
- CORS support
- Rate limiting
- Swagger/OpenAPI documentation
- WebSocket support for real-time updates

**API Endpoints:**

```
POST   /api/create      - Create diagram from description
POST   /api/validate    - Validate diagram
POST   /api/convert     - Convert between formats
POST   /api/optimize    - Optimize diagram
GET    /api/docs        - API documentation
```

**Example:**

```bash
$ aigp serve --port 3000 --cors

🚀 AIGP Server running on http://localhost:3000

API Endpoints:
  POST   /api/create
  POST   /api/validate
  POST   /api/convert
  POST   /api/optimize
  GET    /api/docs

WebSocket: ws://localhost:3000/ws

# Test endpoint
$ curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d @diagram.json

{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

---

### 5. Advanced Export

```bash
aigp export diagram.json --format png --template professional
aigp export diagram.json --format pdf --theme dark --scale 2
aigp export diagram.json --format svg --embed-fonts
```

**Templates:**
- `minimal` - Clean, minimal styling
- `professional` - Corporate/business style
- `colorful` - Vibrant colors
- `monochrome` - Black and white
- `blueprint` - Blueprint/engineering style

**Options:**
- `--template NAME` - Apply styling template
- `--theme light|dark` - Color theme
- `--scale N` - Scale factor for raster formats
- `--dpi N` - DPI for PDF (default: 300)
- `--embed-fonts` - Embed fonts in SVG/PDF
- `--transparent` - Transparent background (PNG)

**Example:**

```bash
$ aigp export architecture.json \
  --format png \
  --template professional \
  --scale 2 \
  --transparent \
  --output high-res.png

✓ Exported to high-res.png (2400x1800, 847 KB)
```

---

### 6. Diagram Statistics

```bash
aigp stats diagram.json
aigp stats diagrams/ --recursive --format table
```

**Output:**

```
$ aigp stats architecture.json

Diagram: System Architecture (architecture.json)
═══════════════════════════════════════════════

Structure:
  Type:              network
  Nodes:             42
  Edges:             67
  Avg Connections:   3.19

Complexity:
  Cyclomatic:        18
  Max Depth:         6
  Branching Factor:  2.8
  Overall Score:     54/100 (moderate)

Node Types:
  server:      12 (29%)
  database:    8 (19%)
  service:     15 (36%)
  queue:       4 (10%)
  cache:       3 (7%)

Performance:
  Estimated render:  <500ms
  Size:              24.3 KB
  Validation:        ✓ Valid

Recommendations:
  • Consider grouping related services
  • High complexity - may benefit from splitting
```

---

### 7. Search Diagrams

```bash
aigp search --type flowchart --tags "auth,security"
aigp search --contains "database" diagrams/
aigp search --modified-after 2026-03-01
```

**Options:**
- `--type TYPE` - Filter by diagram type
- `--tags TAGS` - Filter by tags (comma-separated)
- `--contains TEXT` - Search node labels/descriptions
- `--author AUTHOR` - Filter by author
- `--created-after DATE` - Created after date
- `--modified-after DATE` - Modified after date
- `--complexity MIN-MAX` - Complexity range (0-100)
- `--nodes MIN-MAX` - Node count range

**Example:**

```bash
$ aigp search --type flowchart --tags auth diagrams/

Found 3 matching diagrams:

1. User Authentication (auth-flow.json)
   Type: flowchart
   Nodes: 8, Edges: 12
   Tags: auth, security, login
   Modified: 2 days ago

2. OAuth Flow (oauth.json)
   Type: flowchart
   Nodes: 12, Edges: 18
   Tags: auth, oauth, third-party
   Modified: 1 week ago

3. Password Reset (password-reset.json)
   Type: flowchart
   Nodes: 6, Edges: 9
   Tags: auth, security, recovery
   Modified: 3 days ago
```

---

### 8. Refactor/Rename Nodes

```bash
aigp refactor diagram.json --rename "OldName:NewName"
aigp refactor diagram.json --rename-pattern "^user_:usr_"
aigp refactor diagram.json --update-type "process:subprocess" --node n42
```

**Options:**
- `--rename "OLD:NEW"` - Rename specific node
- `--rename-pattern "REGEX:REPLACEMENT"` - Rename by pattern
- `--update-type "OLD:NEW"` - Change node types
- `--update-label "ID:NEW_LABEL"` - Update node label
- `--merge "ID1,ID2:NEW_ID"` - Merge nodes
- `--split "ID"` - Split node into multiple
- `--dry-run` - Preview changes

**Example:**

```bash
$ aigp refactor diagram.json \
  --rename "old_auth:new_auth" \
  --rename-pattern "^user_(.+):account_$1" \
  --output refactored.json

Changes:
  • Renamed node 'old_auth' → 'new_auth'
  • Renamed node 'user_login' → 'account_login'
  • Renamed node 'user_logout' → 'account_logout'
  • Renamed node 'user_profile' → 'account_profile'
  • Updated 15 edge references

✓ Saved to refactored.json
```

---

### 9. Generate Documentation

```bash
aigp docs generate --input diagrams/ --output docs/
aigp docs generate --input diagram.json --format markdown --output README.md
```

**Options:**
- `--format markdown|html|pdf` - Output format
- `--template NAME` - Documentation template
- `--include-images` - Generate and embed images
- `--include-mermaid` - Include Mermaid code blocks
- `--sections SECTIONS` - Comma-separated sections
- `--toc` - Generate table of contents

**Generated Documentation Structure:**

```markdown
# System Architecture

## Overview

This document describes the system architecture for...

## Diagrams

### 1. High-Level Architecture

**Components:**
- API Gateway: Entry point for all requests
- Auth Service: Handles authentication
- User Service: Manages user data
- Database: PostgreSQL cluster

**Connections:**
- Client → API Gateway → Services
- Services → Database

### 2. Authentication Flow

[Diagram and description...]

## Technical Details

**Complexity Analysis:**
- Overall Complexity: 54/100 (moderate)
- Node Count: 42
- Edge Count: 67

## Maintenance

Last updated: 2026-03-10
```

---

### 10. Benchmark Performance

```bash
aigp benchmark large-diagram.json
aigp benchmark diagrams/ --compare
```

**Output:**

```
$ aigp benchmark large-diagram.json

Benchmarking: large-diagram.json (1247 nodes, 2891 edges)
═══════════════════════════════════════════════════════

Parse:
  Time: 8.3ms
  Memory: 2.4 MB

Validate:
  Time: 42.7ms
  Errors: 0
  Warnings: 3

Layout (hierarchical):
  Time: 1.84s
  Iterations: 127
  Final score: 0.82

Layout (force-directed):
  Time: 3.21s
  Iterations: 500
  Final score: 0.78

Render (SVG):
  Time: 387ms
  Output size: 1.2 MB

Export (PNG 1920x1080):
  Time: 1.56s
  Output size: 847 KB

Summary:
  Total time: 7.1s
  Peak memory: 156 MB
  Performance grade: B+ (suitable for production)
```

---

### 11. Diff Diagrams

```bash
aigp diff diagram-v1.json diagram-v2.json
aigp diff diagram-v1.json diagram-v2.json --visual
```

**Output:**

```
$ aigp diff auth-v1.json auth-v2.json

Comparing: auth-v1.json ↔ auth-v2.json
═══════════════════════════════════

Metadata:
  ~ Title: "User Auth" → "User Authentication v2"
  + Tags: ["security", "2fa"]

Nodes:
  + error_handler (type: process)
  + two_factor (type: decision)
  ~ validate: label updated
  - old_retry (removed)

Edges:
  + validate → error_handler (on error)
  + validate → two_factor (on success)
  - validate → old_retry

Summary:
  Similarity: 87%
  Changes: 7 additions, 1 removal, 1 modification
```

---

### 12. Merge Diagrams

```bash
aigp merge auth.json payment.json checkout.json --strategy smart --output complete.json
```

**Strategies:**
- `concat` - Simple concatenation
- `smart` - Intelligent deduplication
- `hierarchical` - Create parent structure

**Example:**

```bash
$ aigp merge frontend.json backend.json database.json \
  --strategy smart \
  --output full-stack.json

Merging 3 diagrams...

Analysis:
  Total nodes: 67 → 52 (15 duplicates removed)
  Total edges: 98 → 84 (14 duplicates removed)

Merged nodes:
  • "User Database" found in backend.json and database.json
  • "API Gateway" found in frontend.json and backend.json

✓ Saved to full-stack.json
```

---

### 13. Config Management

```bash
aigp config set default-layout hierarchical
aigp config set default-theme dark
aigp config get
aigp config reset
```

**Configuration file:** `~/.aigp/config.json`

```json
{
  "defaultLayout": "hierarchical",
  "defaultTheme": "dark",
  "defaultFormat": "agf",
  "autoValidate": true,
  "parallelWorkers": 4,
  "cacheEnabled": true,
  "plugins": [
    "@aigraphia/plugin-custom"
  ]
}
```

---

### 14. Plugin Management

```bash
aigp plugin list
aigp plugin install @aigp-plugins/custom-diagram
aigp plugin uninstall @aigp-plugins/custom-diagram
aigp plugin info @aigp-plugins/custom-diagram
```

**Example:**

```bash
$ aigp plugin list

Installed Plugins:
  ✓ @aigraphia/plugin-flowchart  v1.0.0
  ✓ @aigraphia/plugin-sequence   v1.0.0
  ✓ @aigp-plugins/gantt     v0.5.2

$ aigp plugin install @aigp-plugins/kanban

Installing @aigp-plugins/kanban...
✓ Downloaded (34 KB)
✓ Verified signature
✓ Installed successfully

New diagram type available: kanban
```

---

## Shell Completion

```bash
# Bash
aigp completion bash >> ~/.bashrc

# Zsh
aigp completion zsh >> ~/.zshrc

# Fish
aigp completion fish >> ~/.config/fish/completions/aigp.fish
```

---

## Environment Variables

```bash
export AIGP_DEFAULT_LAYOUT=hierarchical
export AIGP_CACHE_DIR=~/.aigp/cache
export AIGP_LOG_LEVEL=info
export AIGP_API_KEY=your-api-key
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Validate Diagrams

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm add -g @aigraphia/cli
      - run: aigp validate diagrams/*.json --fail-fast
```

### GitLab CI

```yaml
validate-diagrams:
  stage: test
  image: node:18
  script:
    - pnpm add -g @aigraphia/cli
    - aigp validate diagrams/*.json --summary
```

---

## Scripting with AIGP CLI

### Bash Script

```bash
#!/bin/bash

# Validate all diagrams
echo "Validating diagrams..."
if ! aigp validate diagrams/*.json --fail-fast; then
  echo "Validation failed!"
  exit 1
fi

# Generate documentation
echo "Generating documentation..."
aigp docs generate --input diagrams/ --output docs/

# Export to multiple formats
echo "Exporting diagrams..."
for file in diagrams/*.json; do
  basename=$(basename "$file" .json)
  aigp export "$file" --format svg --output "exports/${basename}.svg"
  aigp export "$file" --format png --output "exports/${basename}.png"
done

echo "Done!"
```

---

## Performance

- **Validation**: <50ms for 1000 nodes
- **Conversion**: <200ms for typical diagrams
- **Batch operations**: Parallel processing scales linearly
- **Watch mode**: <50ms latency
- **Server mode**: <100ms API response time

---

## Resources

- NPM: https://www.npmjs.com/package/@aigraphia/cli
- GitHub: https://github.com/AIGraphia/aigp/tree/main/packages/cli
- Documentation: https://aigp.dev/docs/cli
- Examples: https://aigp.dev/examples/cli
