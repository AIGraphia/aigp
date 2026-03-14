# Changelog

All notable changes to AIGP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Mermaid → AIGP import converter supporting 5 diagram types (flowchart, sequence, class, ER, state)
- Comprehensive test suite for Mermaid parser (33 tests, 100% passing)
- CI/CD pipeline with GitHub Actions (test, build, lint, coverage, publish)
- Community infrastructure (issue templates, PR template, Code of Conduct, Security policy)
- All 20 diagram type plugins implemented
- npm publication metadata for all 6 packages

### Changed
- Package scoping from `@aigraphia/*` to `@aigp/*`
- Improved Mermaid parser with accurate regex patterns for all node shapes
- Enhanced flowchart parsing to support combined node+edge syntax

### Fixed
- Mermaid parser regex alternation issues causing false matches
- Circle node shape detection for `((text))` syntax
- Dotted edge style parsing (`-.->`)
- Class diagram relationship parsing (`--|>`, `--*`, `--o`)

## [1.0.0] - 2026-03-09

### Added - Foundation Release
- Universal JSON protocol with 29 diagram types
- Type-safe validation with Zod schemas
- Plugin system with 20 diagram implementations
  - Core: flowchart, sequence, UML-class, ER, state-machine
  - Process: BPMN, timeline
  - Hierarchical: org-chart, architecture
  - Network: mind-map, network, petri-net
  - Data viz: sankey, funnel, treemap, circle-packing, sunburst
  - Advanced: chord, alluvial, kanban
- 7 layout engines (Dagre, ELK, D3, Timeline, Radial, Grid, Manual)
- CLI tool with 3 commands (init, validate, types)
- Mermaid exporter for universal rendering
- 3 AI Skills (create, edit, explain diagrams)
- Multi-modal output system
- Complete documentation (1500+ lines)
- Integration tests
- Example diagrams

### Technical Stack
- TypeScript for type safety
- Zod for runtime validation
- Turborepo for monorepo management
- pnpm for package management
- Vitest for testing
- Commander.js for CLI
- MIT License

## Roadmap

See [ROADMAP.md](./docs/ROADMAP.md) for planned features and timeline.

### Upcoming in 1.1.0
- PlantUML → AIGP importer
- Performance optimizations for large diagrams
- Enhanced error handling
- Documentation site
- VS Code extension MVP

### Planned for 2.0.0
- Python SDK
- Go SDK
- Browser JavaScript library
- Additional export formats (PDF, GraphML, DOT)
- Advanced AI capabilities

---

## Version History

- **1.0.0** (2026-03-09) - Initial public release
  - Complete protocol implementation
  - 20 diagram types
  - CLI tool
  - Mermaid compatibility
  - AI Skills integration

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute to AIGP.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
