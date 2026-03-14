# AIGP Test Suite

## Overview

Comprehensive test coverage for all AIGP packages using Vitest.

## Test Statistics

| Package | Test Files | Tests | Status |
|---------|-----------|-------|--------|
| @aigp/protocol | 1 | 19 | ✅ Passing |
| @aigp/plugins | 2 | 27 | ✅ Passing |
| @aigp/layout | 2 | 24 | ✅ Passing |
| @aigp/converters | 1 | 11 | ✅ Passing |
| @aigp/cli | 1 | 1 | ✅ Passing |
| @aigp/skills | 1 | 1 | ✅ Passing |
| **Total** | **8** | **83** | **✅ All Passing** |

## Package Details

### @aigp/protocol

**Test Files:**
- `src/__tests__/validation.test.ts` - Protocol validation tests

**Coverage:**
- ✅ Basic diagram structure (version, type, metadata, graph, layout)
- ✅ Node validation (id, type, label, position, size)
- ✅ Edge validation (source, target, label)
- ✅ Layout configuration (algorithm, direction, spacing)
- ✅ Styling (diagram-level and node-level)
- ✅ Complex diagrams (multi-node flowcharts)
- ✅ Default values (version defaults to '1.0.0')

### @aigp/plugins

**Test Files:**
- `src/__tests__/registry.test.ts` - Plugin registry tests
- `src/__tests__/flowchart.test.ts` - Flowchart plugin tests

**Coverage:**
- ✅ Plugin registration and retrieval
- ✅ Plugin validation
- ✅ Default configurations (layout, styles)
- ✅ Node types (start, process, decision, input, subprocess)
- ✅ Edge types (flow, conditional)
- ✅ AI prompts

### @aigp/layout

**Test Files:**
- `src/__tests__/engine.test.ts` - Layout engine registry tests
- `src/__tests__/selector.test.ts` - Layout selector tests

**Coverage:**
- ✅ Engine registration and retrieval
- ✅ Multiple engine support
- ✅ Auto-selection by diagram type (flowchart→hierarchical, network→force-directed, etc.)
- ✅ Manual layout preservation
- ✅ All 7 layout engines (hierarchical, layered, force-directed, timeline, radial, grid, manual)

### @aigp/converters

**Test Files:**
- `src/__tests__/mermaid.test.ts` - Mermaid converter tests

**Coverage:**
- ✅ Flowchart conversion
- ✅ Sequence diagram conversion
- ✅ ER diagram conversion
- ✅ Mind map conversion
- ✅ Org chart conversion
- ✅ Edge labels
- ✅ Layout directions
- ✅ Message types (sync, async, return)
- ✅ Special character escaping
- ✅ Unknown diagram type fallback

### @aigp/cli

**Test Files:**
- `src/__tests__/cli.test.ts` - Basic CLI test

**Status:** ✅ Placeholder test (comprehensive CLI tests pending)

### @aigp/skills

**Test Files:**
- `src/__tests__/skills.test.ts` - Basic skills test

**Status:** ✅ Placeholder test (comprehensive skills tests pending)

## Running Tests

### All Packages
```bash
pnpm test
```

### Run Tests (Non-Watch Mode)
```bash
./node_modules/.bin/turbo run test -- run
```

### Individual Package
```bash
cd packages/protocol
pnpm test run
```

### Watch Mode
```bash
cd packages/protocol
pnpm test
```

## Test Configuration

All packages use:
- **Test Framework:** Vitest 1.6.1
- **Environment:** Node.js
- **Config File:** `vitest.config.ts` in each package

## Next Steps

### Immediate (Week 1)
- [ ] Add more comprehensive CLI tests (command parsing, file I/O)
- [ ] Add skills tests (create, edit, explain skills)
- [ ] Increase test coverage to 80%+

### Future (Week 2+)
- [ ] Integration tests for full diagram workflows
- [ ] Performance benchmarks (1000+ node diagrams)
- [ ] Edge case testing (malformed inputs)
- [ ] Cross-package integration tests

## Testing Best Practices

1. **Isolation:** Each test is independent
2. **Clarity:** Descriptive test names
3. **Coverage:** Test happy paths and edge cases
4. **Speed:** Fast unit tests (<10ms per test)
5. **Reliability:** No flaky tests

## Known Limitations

1. CLI tests are minimal (placeholder only)
2. Skills tests are minimal (placeholder only)
3. No integration tests between packages yet
4. No performance/load tests yet
5. Mock-based tests for layout engines (actual layout computation not tested)

## Test Maintenance

- Update tests when adding new features
- Refactor tests when refactoring code
- Remove obsolete tests when removing features
- Keep test coverage above 80%

---

**Last Updated:** March 9, 2026
**Test Suite Version:** 1.0.0
**Status:** ✅ All 83 tests passing
