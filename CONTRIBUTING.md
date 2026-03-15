# Contributing to AIGP

Thank you for considering contributing to AIGP! This document provides guidelines for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aigp/aigp.git
   cd aigp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm run build
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

## Project Structure

```
aigp/
├── packages/
│   ├── protocol/       # Core JSON schema
│   ├── plugins/        # Diagram type plugins
│   ├── layout/         # Layout engines
│   ├── cli/           # CLI tool
│   ├── converters/    # Format converters
│   ├── export/        # Export utilities
│   └── skills/        # AI Skills
├── docs/              # Documentation
├── examples/          # Example diagrams
└── tests/            # Test suites
```

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/aigp/aigp/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - System info (OS, Node version)
   - Example diagram (if applicable)

### Suggesting Features

1. Check existing [Feature Requests](https://github.com/aigp/aigp/issues?q=label%3Aenhancement)
2. Create an issue describing:
   - Use case
   - Proposed solution
   - Alternative approaches considered
   - Example diagrams

### Pull Requests

1. **Fork the repository**

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow code style (prettier/eslint)
   - Add tests
   - Update documentation
   - Follow commit message conventions

4. **Test your changes**
   ```bash
   pnpm run build
   pnpm test
   pnpm run lint
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new diagram type"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Add screenshots (for UI changes)
   - Ensure CI passes

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `pnpm run format`)
- **Linting**: ESLint (run `pnpm run lint`)
- **Naming**: camelCase for variables, PascalCase for types

## Adding a New Diagram Plugin

1. **Create plugin directory**
   ```bash
   mkdir packages/plugins/src/types/my-diagram
   ```

2. **Implement plugin**
   ```typescript
   // packages/plugins/src/types/my-diagram/index.ts
   import { DiagramPlugin } from '../../base';

   export const myDiagramPlugin: DiagramPlugin = {
     type: 'my-diagram',
     name: 'My Diagram',
     description: 'Description',
     nodeTypes: { /* ... */ },
     edgeTypes: { /* ... */ },
     groupTypes: {},
     validator: (diagram) => validateFull(diagram),
     defaultLayout: { algorithm: 'hierarchical' },
     defaultStyles: {},
     aiPrompts: {
       systemPrompt: '...',
       examples: [],
     },
   };
   ```

3. **Register plugin**
   ```typescript
   // packages/plugins/src/index.ts
   import { myDiagramPlugin } from './types/my-diagram';
   registerPlugin(myDiagramPlugin);
   ```

4. **Add tests**
   ```typescript
   // packages/plugins/src/types/my-diagram/index.test.ts
   ```

5. **Add example**
   ```json
   // packages/protocol/src/examples/my-diagram-example.json
   ```

6. **Update documentation**

## Testing

- **Unit tests**: `pnpm test` (uses Vitest)
- **Integration tests**: Test cross-package interactions
- **E2E tests**: Test user workflows

## Documentation

- Update relevant `.md` files in `docs/`
- Add JSDoc comments to exported functions
- Include examples in documentation

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

Examples:
```
feat: add sankey diagram plugin
fix: sequence diagram timestamp ordering
docs: update protocol documentation
```

## Release Process

Maintainers handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to npm
5. Create GitHub release

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Keep discussions on-topic

## Questions?

- Open a [Discussion](https://github.com/aigp/aigp/discussions)
- Join [Discord](https://discord.gg/aigp)
- Email: contribute@aigp.dev

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
