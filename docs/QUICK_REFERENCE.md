# AIGP Quick Reference

## Packages

| Package | Purpose |
|---------|---------|
| @aigp/protocol | Core JSON schema & validation |
| @aigp/plugins | 20 diagram type plugins |
| @aigp/layout | 7 layout engine adapters |
| @aigp/cli | Command-line tool |
| @aigp/converters | Mermaid/PlantUML/DOT/GraphML converters |
| @aigp/export | SVG/PNG export utilities |
| @aigp/skills | AI agent skills |

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
