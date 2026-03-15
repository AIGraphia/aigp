# AIGP Quick Reference

## Packages

| Package | Purpose |
|---------|---------|
| @aigraphia/protocol | Core JSON schema & validation |
| @aigraphia/plugins | 20 diagram type plugins |
| @aigraphia/layout | 7 layout engine adapters |
| @aigraphia/cli | Command-line tool |
| @aigraphia/converters | Mermaid/PlantUML/DOT/GraphML converters |
| @aigraphia/export | SVG/PNG export utilities |
| @aigraphia/skills | AI agent skills |

## Common Commands

```bash
# Install & Build
pnpm install && pnpm run build

# Run tests
pnpm test

# Integration test
node test-integration.js

# CLI usage
aigp types                           # List diagram types
aigp init flowchart my-diagram       # Create a diagram
aigp validate my-diagram.json        # Validate a diagram
aigp export my-diagram.json -f svg   # Export to SVG
```

## Publishing to npm

```bash
pnpm login
pnpm -r publish --access public
```

## Links

- Repository: https://github.com/aigp/aigp
- Issues: https://github.com/aigp/aigp/issues
- Docs: https://aigraphia.com/docs
