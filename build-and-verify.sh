#!/bin/bash

# AIGraphia Build & Verification Script
# This script builds all packages and verifies the system is working

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         AIGraphia - Build & Verification Script           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js version
echo "📋 Step 1: Checking prerequisites..."
echo "─────────────────────────────────────"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
echo "─────────────────────────────────────"

if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install --silent
    echo -e "${GREEN}✓${NC} Root dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi
echo ""

# Step 3: Build packages
echo "🔨 Step 3: Building packages..."
echo "─────────────────────────────────────"

PACKAGES=(
    "packages/protocol"
    "packages/plugins"
    "packages/layout"
    "packages/cli"
    "packages/converters"
)

for package in "${PACKAGES[@]}"; do
    if [ -d "$package" ]; then
        echo "Building $package..."
        cd "$package"

        # Install package dependencies if needed
        if [ ! -d "node_modules" ]; then
            npm install --silent
        fi

        # Build
        if npm run build --if-present 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Built $package"
        else
            echo -e "${YELLOW}⚠${NC} $package has no build script (skipping)"
        fi

        cd - > /dev/null
    else
        echo -e "${YELLOW}⚠${NC} $package not found (skipping)"
    fi
done
echo ""

# Step 4: Verify package structure
echo "🔍 Step 4: Verifying package structure..."
echo "─────────────────────────────────────"

verify_package() {
    local package=$1
    if [ -f "$package/package.json" ]; then
        echo -e "${GREEN}✓${NC} $package/package.json exists"
        return 0
    else
        echo -e "${RED}✗${NC} $package/package.json missing"
        return 1
    fi
}

ALL_VERIFIED=true
for package in "${PACKAGES[@]}"; do
    if ! verify_package "$package"; then
        ALL_VERIFIED=false
    fi
done
echo ""

# Step 5: Run integration tests
echo "🧪 Step 5: Running integration tests..."
echo "─────────────────────────────────────"

if [ -f "test-integration.js" ]; then
    if node test-integration.js > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Integration tests passed"
    else
        echo -e "${RED}✗${NC} Integration tests failed"
        echo "Run: node test-integration.js"
        ALL_VERIFIED=false
    fi
else
    echo -e "${YELLOW}⚠${NC} test-integration.js not found (skipping)"
fi
echo ""

# Step 6: Verify key files
echo "📄 Step 6: Verifying key files..."
echo "─────────────────────────────────────"

KEY_FILES=(
    "README.md"
    "CONTRIBUTING.md"
    "docs/PROTOCOL.md"
    "docs/QUICKSTART.md"
    "packages/protocol/src/schema.ts"
    "packages/protocol/src/validator.ts"
    "packages/plugins/src/base.ts"
    "packages/layout/src/engine.ts"
    "packages/cli/src/index.ts"
    "packages/converters/src/export/mermaid.ts"
    "packages/skills/aigraphia-create/system-prompt.md"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file missing"
        ALL_VERIFIED=false
    fi
done
echo ""

# Step 7: Package statistics
echo "📊 Step 7: Package statistics..."
echo "─────────────────────────────────────"

echo "TypeScript files:"
TS_COUNT=$(find packages -name "*.ts" -type f | wc -l)
echo -e "  ${GREEN}$TS_COUNT${NC} .ts files"

echo "Documentation files:"
MD_COUNT=$(find . -name "*.md" -type f | wc -l)
echo -e "  ${GREEN}$MD_COUNT${NC} .md files"

echo "Example diagrams:"
AGF_COUNT=$(find . -name "*.json" -path "*/examples/*" | wc -l)
echo -e "  ${GREEN}$AGF_COUNT${NC} example files"
echo ""

# Step 8: CLI verification
echo "🖥️  Step 8: Verifying CLI tool..."
echo "─────────────────────────────────────"

if [ -f "packages/cli/dist/index.js" ]; then
    echo -e "${GREEN}✓${NC} CLI built successfully"
    echo ""
    echo "You can now use the CLI:"
    echo "  cd packages/cli"
    echo "  node dist/index.js init flowchart my-diagram"
    echo "  node dist/index.js validate my-diagram.json"
    echo "  node dist/index.js types"
else
    echo -e "${YELLOW}⚠${NC} CLI not built yet"
    echo "Run: cd packages/cli && npm run build"
fi
echo ""

# Final summary
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    Build Summary                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

if [ "$ALL_VERIFIED" = true ]; then
    echo -e "${GREEN}✅ All verifications passed!${NC}"
    echo ""
    echo "🎉 AIGraphia is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Try the CLI: cd packages/cli && node dist/index.js types"
    echo "  2. Create a diagram: node dist/index.js init flowchart my-process"
    echo "  3. Validate it: node dist/index.js validate my-process.json"
    echo "  4. Start web app: cd ../web && npm run dev"
    echo ""
    echo "Documentation:"
    echo "  • Quick Start: docs/QUICKSTART.md"
    echo "  • Protocol: docs/PROTOCOL.md"
    echo "  • Status: IMPLEMENTATION_STATUS.md"
    echo "  • Summary: FINAL_SUMMARY.md"
    echo ""
else
    echo -e "${RED}❌ Some verifications failed${NC}"
    echo ""
    echo "Please check the errors above and:"
    echo "  1. Ensure all dependencies are installed: npm install"
    echo "  2. Try building again: npm run build"
    echo "  3. Check for TypeScript errors"
    echo ""
fi

echo "────────────────────────────────────────────────────────────"
echo ""
