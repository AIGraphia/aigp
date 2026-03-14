# AIGP Testing Guide

Complete guide to testing all AIGP packages before publishing to npm.

---

## 🎯 Quick Test (5 minutes)

Run this to verify everything works:

```bash
cd /path/to/aigp

# 1. Install dependencies
pnpm install

# 2. Build all packages
pnpm run build

# 3. Run integration tests
node test-integration.js

# 4. Run unit tests in all packages
pnpm test
```

If all pass ✅ → You're ready to publish!

---

## 📦 Test Each Package Individually

### 1. Protocol Package (@aigp/protocol)

**What it does**: Core JSON schema and validation

```bash
cd packages/protocol

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test
node -e "
const { createDiagram, validateDiagram } = require('./dist/index.js');
const diagram = createDiagram({
  type: 'flowchart',
  elements: [],
  connections: []
});
console.log('✅ Protocol works!', diagram);
"
```

**Expected output**: Diagram object with schema validation

---

### 2. Plugins Package (@aigp/plugins)

**What it does**: 20+ diagram type implementations

```bash
cd packages/plugins

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test - List all plugin types
node -e "
const { DiagramRegistry } = require('./dist/index.js');
const types = DiagramRegistry.listTypes();
console.log('✅ Plugins:', types.length, 'diagram types');
console.log(types);
"
```

**Expected output**: Array of 20+ diagram types (flowchart, sequence, er, etc.)

---

### 3. Layout Package (@aigp/layout)

**What it does**: 7 automatic layout engines

```bash
cd packages/layout

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test - Apply layout
node -e "
const { applyLayout } = require('./dist/index.js');
const diagram = {
  type: 'flowchart',
  elements: [
    { id: '1', type: 'start', properties: {} },
    { id: '2', type: 'process', properties: {} }
  ],
  connections: [{ from: '1', to: '2' }]
};
const result = applyLayout(diagram, { engine: 'dagre' });
console.log('✅ Layout applied!');
console.log('Positions:', result.elements.map(e => ({ id: e.id, x: e.position?.x, y: e.position?.y })));
"
```

**Expected output**: Elements with x,y positions calculated

---

### 4. CLI Package (@aigp/cli)

**What it does**: Command-line tool

```bash
cd packages/cli

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test - CLI commands
node dist/index.js --help
node dist/index.js types
node dist/index.js init test.json
node dist/index.js validate test.json
```

**Expected output**:
- Help text displayed
- List of diagram types
- Created test.json file
- Validation result

---

### 5. Converters Package (@aigp/converters)

**What it does**: Export to Mermaid, import from Mermaid/PlantUML

```bash
cd packages/converters

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test - Export to Mermaid
node -e "
const { exportToMermaid } = require('./dist/index.js');
const diagram = {
  version: '1.0',
  type: 'flowchart',
  elements: [
    { id: 'a', type: 'start', properties: { label: 'Start' } },
    { id: 'b', type: 'process', properties: { label: 'Process' } }
  ],
  connections: [{ from: 'a', to: 'b' }]
};
const mermaid = exportToMermaid(diagram);
console.log('✅ Mermaid export:');
console.log(mermaid);
"
```

**Expected output**: Valid Mermaid syntax

---

### 6. Export Package (@aigp/export)

**What it does**: Export to SVG, PNG, PDF

```bash
cd packages/export

# Install
pnpm install

# Build
pnpm run build

# Test
pnpm test

# Manual test
node -e "
const { renderToSVG } = require('./dist/index.js');
console.log('✅ Export package loaded');
"
```

**Expected output**: Module loads without errors

---

### 7. Skills Package (@aigp/skills)

**What it does**: AI Skills for Claude Code and ChatGPT

```bash
cd packages/skills

# Install
pnpm install

# Test
pnpm test

# Manual verification - Check skills exist
ls -la aigraphia-create/
cat aigraphia-create/system-prompt.md | head -20
```

**Expected output**: Skill files and prompts

---

## 🔄 Full Build & Test Workflow

```bash
# From AIGP root directory
cd /path/to/aigp

# 1. Clean install
rm -rf node_modules packages/*/node_modules packages/*/dist
pnpm install

# 2. Build all packages (uses Turbo for speed)
pnpm run build

# 3. Verify all dist/ folders created
ls -d packages/*/dist

# 4. Run all unit tests
pnpm test

# 5. Run integration test
node test-integration.js

# 6. Test CLI globally
cd packages/cli
pnpm link --global
aigp --help
aigp types
```

---

## 🧪 Integration Test Details

The `test-integration.js` file tests:

1. ✅ **Diagram creation** - Creates a flowchart
2. ✅ **Validation** - Validates JSON structure
3. ✅ **File I/O** - Writes/reads .json files
4. ✅ **Schema compliance** - Checks required fields

**Run it:**
```bash
node test-integration.js
```

**Expected output:**
```
🚀 AIGraphia Integration Test

Test 1: Creating a simple flowchart...
✅ Created test-diagram.json

Test 2: Validating diagram structure...
✅ Diagram structure is valid

Test 3: Testing diagram types...
✅ All diagram types validated

✅ All integration tests passed!
```

---

## 🐛 Troubleshooting

### Issue: `pnpm install` fails

**Solution:**
```bash
# Update pnpm
corepack enable && corepack prepare pnpm@latest --activate

# Clear cache
pnpm store prune

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript version
pnpm exec tsc --version

# Rebuild
pnpm run clean
pnpm run build
```

### Issue: Tests fail with "module not found"

**Solution:**
```bash
# Build before testing
pnpm run build
pnpm test
```

### Issue: Layout tests fail

**Solution:**
```bash
# Install layout dependencies separately
cd packages/layout
pnpm install dagre elkjs d3-hierarchy
pnpm run build
pnpm test
```

---

## ✅ Pre-Publish Checklist

Before running `pnpm -r publish --access public`:

- [ ] All packages build: `pnpm run build`
- [ ] All tests pass: `pnpm test`
- [ ] Integration test passes: `node test-integration.js`
- [ ] CLI works: `cd packages/cli && pnpm link --global && aigp --help`
- [ ] Version is 1.0.0 in all package.json files
- [ ] Package scope is @aigp/* in all package.json files
- [ ] LICENSE file exists
- [ ] README.md exists in each package
- [ ] No private keys or secrets in code

---

## 🎯 Quick Health Check Script

Create and run this script for a full health check:

```bash
#!/bin/bash
# save as check-health.sh

echo "🔍 AIGP Health Check"
echo ""

cd /path/to/aigp

echo "1. Installing dependencies..."
pnpm install --silent

echo "2. Building packages..."
pnpm run build --silent

echo "3. Running tests..."
pnpm test --silent

echo "4. Running integration test..."
node test-integration.js

echo ""
echo "✅ Health check complete!"
```

**Run it:**
```bash
chmod +x check-health.sh
./check-health.sh
```

---

## 📊 Test Coverage

To see test coverage:

```bash
# In each package with tests
cd packages/protocol
pnpm test -- --coverage

cd ../plugins
pnpm test -- --coverage

cd ../layout
pnpm test -- --coverage

cd ../converters
pnpm test -- --coverage
```

---

## 🚀 Continuous Integration

The project includes GitHub Actions workflows:

**`.github/workflows/ci.yml`** - Runs on every push:
- Installs dependencies
- Builds all packages
- Runs all tests
- Reports failures

**`.github/workflows/publish.yml`** - Runs on version tags:
- Builds packages
- Publishes to npm

Once you push to GitHub, tests will run automatically!

---

## 📝 Testing Summary

| Package | Build | Tests | Manual Test |
|---------|-------|-------|-------------|
| protocol | `pnpm run build` | `pnpm test` | Create & validate |
| plugins | `pnpm run build` | `pnpm test` | List types |
| layout | `pnpm run build` | `pnpm test` | Apply layout |
| cli | `pnpm run build` | `pnpm test` | CLI commands |
| converters | `pnpm run build` | `pnpm test` | Export Mermaid |
| export | `pnpm run build` | `pnpm test` | Render SVG |
| skills | N/A | `pnpm test` | Check files |

---

**Ready to test!** Run `pnpm install && pnpm run build && pnpm test` to verify everything works! 🎉
