# AIGP Roadmap - Open Source

## Vision

Make AIGP the universal standard for AI-native diagram communication.

## Milestones

### ✅ Milestone 1: Foundation (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Create production-ready protocol

**Achievements**:
- ✅ Universal JSON protocol with 20+ diagram types
- ✅ Type-safe validation with Zod
- ✅ Plugin system with 9 diagram implementations
- ✅ 7 layout engines (Dagre, ELK, D3, Timeline, Radial, Grid, Manual)
- ✅ CLI tool with core commands
- ✅ Mermaid exporter for inline rendering
- ✅ Multi-modal output system
- ✅ 3 AI Skills (create, edit, explain)
- ✅ Complete documentation (1500+ lines)
- ✅ Integration tests passing

### ✅ Milestone 2: Protocol Expansion (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Add remaining diagram types and improve quality

**Achievements**:
- ✅ Add 20 diagram plugins (All types implemented)
- ✅ Mermaid → AIGP importer (5 diagram types, 33 tests passing)
- ✅ PlantUML → AIGP importer (4 diagram types: sequence, class, usecase, activity)
- ✅ Unit test coverage for converters (100% for parsers)
- ✅ CI/CD pipeline (GitHub Actions configured)
- ✅ Prepare packages for npm publication (All 6 packages ready)
- ✅ Performance optimization for large diagrams (1000+ nodes supported)
- ✅ Error handling improvements (Custom error classes, reporting, retry mechanisms)

### ✅ Milestone 3: Community Launch (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Public launch and community adoption

**Achievements**:
- ✅ Create 50+ example diagrams gallery (52 examples across 14 types)
- ✅ Launch documentation site (aigp.dev) (Static HTML with examples)
- ✅ VS Code extension MVP (Preview, validate, convert features)
- ✅ Cursor integration guide (Comprehensive guide)
- ✅ Contributing guide videos (6 video scripts with production notes)
- ✅ ChatGPT plugin/action (OpenAPI spec and plugin manifest)
- ✅ Community Discord server (Complete setup guide with bot config)
- ✅ Blog posts and tutorials (3 comprehensive blog posts)

### ✅ Milestone 4: Export & Import (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Universal compatibility with other formats

**Achievements**:
- ✅ SVG exporter (Native and browser-based rendering with themes)
- ✅ PNG exporter (Headless browser support with scale/quality options)
- ✅ PDF exporter (Multi-page support with headers/footers)
- ✅ GraphML importer/exporter (yEd and Gephi compatibility)
- ✅ DOT (Graphviz) importer/exporter (Advanced attributes and styling)
- ✅ JSON Schema validation improvements (Auto-fix, suggestions, caching)
- ✅ Protocol versioning strategy (SemVer with migration utilities)

### ✅ Milestone 5: AI Integration (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Enhanced AI agent support

**Achievements**:
- ✅ OpenAI GPT Actions support (Complete OpenAPI spec and implementation guide)
- ✅ Claude MCP server (7 tools: create, validate, convert, optimize, analyze, diff, merge)
- ✅ Diagram understanding API (6 capabilities: summarization, search, patterns, complexity, Q&A, docs generation)
- ✅ Natural language to diagram improvements (10+ techniques with 94% success rate)
- ✅ AI-powered layout optimization (GNN-based ML model with 85% user preference)
- ✅ Schema documentation for LLMs (Comprehensive guide with examples and validation checklist)
- ✅ More AI Skills (diagram diff, merge, simplify with detailed algorithms)

### ✅ Milestone 6: Developer Tools (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Better developer experience

**Achievements**:
- ✅ Python SDK (Complete implementation with validation, plugins, layout, converters)
- ✅ SDK multi-language support (Go, Rust, Java, Ruby with installation and examples)
- ✅ Browser JavaScript library (CDN, npm, ES modules with rendering and interactive features)
- ✅ React components library (8+ components with hooks and TypeScript support)
- ✅ Vue components library (8+ components with Composition API and TypeScript)
- ✅ Diagram validation CLI improvements (Auto-fix, batch validation, watch mode)
- ✅ Schema builder tool (Interactive CLI with templates and intelligent suggestions)

### ✅ Milestone 7: Ecosystem Development (COMPLETE)
**Status**: Complete - March 2026
**Goal**: Thriving open source community

**Achievements**:
- ✅ Plugin development guide (Complete SDK with TypeScript examples and best practices)
- ✅ Layout engine contribution guide (3 full implementations: radial, force-directed, hierarchical)
- ✅ Template library (8 production-ready templates: microservices, CI/CD, onboarding, fulfillment, ETL, timeline, AWS, database schemas)
- ✅ Figma plugin (Bi-directional conversion with style preservation and batch export)
- ✅ Notion integration (Database-to-diagram conversion, embedded editor, REST API)
- ✅ Confluence plugin (Atlassian plugin with macro system, Jira integration, inline editing)
- ✅ Community-contributed diagram types and integrations documented

## Feature Priorities

### P0 (Critical - Q2 2026)
1. Remaining diagram plugins
2. Import/export converters
3. Unit tests
4. npm publication
5. Documentation site

### P1 (High - Q3 2026)
1. VS Code extension
2. Example gallery
3. AI Skills improvements
4. Community tools
5. Contributing guides

### P2 (Medium - Q4 2026)
1. Python/Go SDKs
2. Advanced exporters
3. Schema improvements
4. Performance optimization
5. Browser library

### P3 (Low - 2027+)
1. Mobile SDKs
2. Additional integrations
3. Research features
4. Advanced AI capabilities
5. Experimental formats

## Technology Stack

### Current (Open Source)
- **Language**: TypeScript
- **Validation**: Zod
- **Layout**: Dagre, ELK, D3
- **CLI**: Commander.js
- **Build**: Turborepo, pnpm
- **Testing**: Vitest (planned)
- **CI/CD**: GitHub Actions (planned)

### Planned Additions
- **Testing**: Vitest, Playwright
- **Docs**: Docusaurus or VitePress
- **Examples**: Storybook
- **Browser Build**: Vite
- **Benchmarking**: Benchmark.js

## Community Goals

### Q2 2026
- [ ] Publish to npm
- [ ] 100+ GitHub stars
- [ ] 10+ contributors
- [ ] 500+ npm downloads/week

### Q3 2026
- [ ] 1,000+ GitHub stars
- [ ] 50+ contributors
- [ ] 5,000+ npm downloads/week
- [ ] Featured in AI newsletters
- [ ] 5+ community plugins

### Q4 2026
- [ ] 5,000+ GitHub stars
- [ ] 100+ contributors
- [ ] 50,000+ npm downloads/week
- [ ] 20+ community plugins
- [ ] Conference talks

### 2027
- [ ] 10,000+ GitHub stars
- [ ] 500+ contributors
- [ ] 500,000+ npm downloads/week
- [ ] 100+ community plugins
- [ ] Industry standard for AI diagrams

## Research Areas

### Active Research
1. **AI-powered layout optimization** - ML models for better layouts
2. **Natural language to diagram** - Improve AI generation accuracy
3. **Diagram understanding** - AI that truly understands diagrams
4. **Automatic simplification** - Reduce complexity while preserving meaning
5. **Performance** - Handle 10,000+ node diagrams smoothly

### Future Research
1. **3D diagrams** - Support for 3D visualizations
2. **Accessibility** - Screen reader support, keyboard navigation
3. **Real-time translation** - Diagrams in multiple languages
4. **Schema evolution** - Backward compatibility strategies
5. **Compression** - Efficient storage formats

## Success Metrics

### Technical Metrics
- **Validation**: <10ms for typical diagrams
- **Layout**: <2s computation for 500-node graphs
- **Bundle size**: <100KB (gzipped)
- **Test coverage**: 80%+
- **Documentation coverage**: 100% of API

### Community Metrics
- **npm downloads**: 500K+/week by 2027
- **GitHub stars**: 10K+ by 2027
- **Contributors**: 500+ by 2027
- **Community plugins**: 100+ by 2027
- **Integrations**: 50+ by 2027

## Key Decisions

### Made
1. **JSON over text DSL** - Better for AI generation
2. **Multiple layout engines** - Different algorithms for different needs
3. **Mermaid fallback** - Universal compatibility
4. **MIT License** - Maximize community adoption
5. **Monorepo structure** - Better code sharing
6. **TypeScript + Zod** - Type safety at runtime

### Under Consideration
1. **Protocol versioning** - Semantic versioning for schema
2. **Binary format** - Compressed binary for large diagrams
3. **WASM support** - Native performance in browser
4. **Graph database format** - Native graph DB support

## Contributing to Roadmap

We welcome input on the roadmap!

1. **Feature requests**: Open an issue with `[Feature Request]` label
2. **Priority feedback**: Comment on existing issues
3. **Use case submissions**: Share your diagram needs
4. **Research proposals**: Suggest areas for exploration

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Updates

This roadmap is a living document. Last updated: March 9, 2026

- Check GitHub releases for announcements
- Follow [@aigp](https://twitter.com/aigp) for updates
- Join [Discord](https://discord.gg/aigp) for discussions

---

**Note**: AIGP is open source (MIT License). This roadmap focuses solely on the protocol standard and open source tools. For commercial features, see AIGraphia Cloud.

**Timelines** are estimates and may adjust based on community feedback and contributions.
