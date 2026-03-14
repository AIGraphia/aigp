# AIGP Protocol Versioning Strategy

## Overview

This document defines the versioning strategy for the AIGP protocol to ensure backward compatibility, clear migration paths, and predictable evolution.

## Version Format

AIGP uses Semantic Versioning (SemVer) with format: `MAJOR.MINOR.PATCH`

```
Example: 1.2.3
         │ │ └─ Patch: Bug fixes, clarifications, no breaking changes
         │ └─── Minor: New features, backward compatible
         └───── Major: Breaking changes, incompatible with previous versions
```

## Version Types

### Patch Version (1.0.0 → 1.0.1)

**Changes allowed:**
- Bug fixes in validation logic
- Documentation improvements
- Performance optimizations
- Security patches
- Clarifications to ambiguous spec language

**Not allowed:**
- New fields
- New diagram types
- Changing field meanings
- Deprecating features

**Example:**
```json
{
  "version": "1.0.1",
  "changelog": "Fixed validation bug for empty labels"
}
```

### Minor Version (1.0.0 → 1.1.0)

**Changes allowed:**
- New optional fields
- New diagram types
- New layout algorithms
- New enum values (for extensible enums)
- New validation rules (warnings only)

**Not allowed:**
- Removing fields
- Changing required fields
- Breaking existing diagrams

**Example:**
```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.1.0",
  "type": "flowchart",
  "metadata": {
    "title": "Example",
    "license": "MIT"  // New optional field in 1.1.0
  }
}
```

### Major Version (1.0.0 → 2.0.0)

**Changes allowed:**
- Breaking schema changes
- Removing deprecated fields
- Changing field types
- Restructuring document format
- New required fields

**Migration required:**
Old v1 diagrams must be migrated to v2 format.

## Schema URL Versioning

```json
{
  "schema": "https://aigraphia.com/schema/v1",  // Major version
  "version": "1.2.3"  // Full semver version
}
```

The `schema` URL includes only the **major version** to indicate compatibility level.

## Version Detection

```typescript
import { detectVersion, isCompatible } from '@aigp/protocol';

const document: AIGPDocument = { /* ... */ };

// Detect version
const version = detectVersion(document);
console.log(version);  // "1.2.3"

// Check compatibility
const compatible = isCompatible(document, '1.0.0');
if (!compatible) {
  console.error('Document requires migration');
}
```

## Backward Compatibility Rules

### Rule 1: Parsers Must Be Lenient

Parsers should accept:
- Unknown optional fields (ignore them)
- Additional enum values (if extensible)
- Extra metadata fields

```typescript
// Good: Ignore unknown fields
const node = {
  id: 'n1',
  type: 'process',
  label: 'Step 1',
  newFieldInV1_2: 'value'  // Parser v1.0 ignores this
};

// Parser v1.0 can still read this diagram
```

### Rule 2: Validators Must Be Version-Aware

```typescript
function validate(document: AIGPDocument): ValidationResult {
  const version = semver.parse(document.version);

  // Apply version-specific rules
  if (semver.gte(version, '1.2.0')) {
    // Validate new fields introduced in 1.2.0
    validateNewFeatures(document);
  }

  // Always validate core fields
  validateCore(document);
}
```

### Rule 3: Generators Should Target Minimum Version

```typescript
// Generate v1.0.0 compatible documents by default
function generateDiagram(options: GenerateOptions): AIGPDocument {
  const targetVersion = options.targetVersion || '1.0.0';

  const document = {
    schema: getSchemaURL(targetVersion),
    version: targetVersion,
    // Only include fields available in target version
  };

  return document;
}
```

## Version Migration

### Automatic Migration

```typescript
import { migrate } from '@aigp/protocol';

// Migrate v1 to v2
const v1Document: AIGPDocument = { /* ... */ };
const v2Document = migrate(v1Document, '2.0.0');

// Migration applies:
// 1. Schema changes
// 2. Field renames
// 3. Data transformations
// 4. Default values for new required fields
```

### Migration Functions

Each major version provides migration utilities:

```typescript
// From v1 to v2
export function migrateV1toV2(doc: AIGPDocumentV1): AIGPDocumentV2 {
  return {
    schema: 'https://aigraphia.com/schema/v2',
    version: '2.0.0',
    type: doc.type,
    metadata: {
      ...doc.metadata,
      created: doc.metadata.created || new Date().toISOString()  // New required field
    },
    graph: {
      nodes: doc.graph.nodes.map(migrateNodeV1toV2),
      edges: doc.graph.edges.map(migrateEdgeV1toV2)
    }
  };
}
```

## Deprecation Process

### Phase 1: Deprecation Warning (Minor Version)

```json
{
  "version": "1.5.0",
  "graph": {
    "nodes": [
      {
        "id": "n1",
        "label": "Old Label",
        "name": "New Name"  // New field replacing 'label'
      }
    ]
  }
}
```

```typescript
// Emit deprecation warning
console.warn('Field "label" is deprecated in v1.5.0. Use "name" instead. Will be removed in v2.0.0');
```

### Phase 2: Removal (Major Version)

```json
{
  "version": "2.0.0",
  "graph": {
    "nodes": [
      {
        "id": "n1",
        "name": "Node Name"  // 'label' field removed
      }
    ]
  }
}
```

## Version Compatibility Matrix

| Parser Version | Can Read |
|---------------|----------|
| 1.0.0 | 1.0.x |
| 1.1.0 | 1.0.x, 1.1.x |
| 1.2.0 | 1.0.x, 1.1.x, 1.2.x |
| 2.0.0 | 2.0.x (v1.x requires migration) |

## Schema Evolution Examples

### Example 1: Adding Optional Field (Minor)

**v1.0.0:**
```json
{
  "metadata": {
    "title": "Diagram"
  }
}
```

**v1.1.0:**
```json
{
  "metadata": {
    "title": "Diagram",
    "tags": ["flowchart", "architecture"]  // New optional field
  }
}
```

✅ v1.0.0 parsers ignore `tags`
✅ Backward compatible

### Example 2: Adding Diagram Type (Minor)

**v1.0.0:**
```typescript
type DiagramType = 'flowchart' | 'sequence' | 'class';
```

**v1.1.0:**
```typescript
type DiagramType = 'flowchart' | 'sequence' | 'class' | 'er';  // Added 'er'
```

✅ v1.0.0 parsers treat 'er' as unknown type (can still parse structure)
✅ Backward compatible

### Example 3: Changing Required Field (Major)

**v1.x:**
```json
{
  "graph": {
    "nodes": [...]
  }
}
```

**v2.0:**
```json
{
  "graph": {
    "nodes": [...],
    "metadata": { /* required metadata */ }  // New required field
  }
}
```

❌ Breaking change
🔄 Requires migration

## Version Headers

Every AIGP document must declare its version:

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.2.3",
  ...
}
```

Missing version defaults to `1.0.0`.

## CLI Version Commands

```bash
# Check document version
aigp version diagram.json
# Output: 1.2.3

# Migrate to latest
aigp migrate diagram.json --to 2.0.0

# Check compatibility
aigp check diagram.json --target-version 1.0.0
# Output: ✓ Compatible

# Show version changelog
aigp changelog --from 1.0.0 --to 1.5.0
```

## Release Process

### Minor Release Checklist

- [ ] Update schema version in protocol package
- [ ] Add new features with backward compatibility
- [ ] Update documentation
- [ ] Add migration guides for new features
- [ ] Run compatibility tests against previous versions
- [ ] Publish to npm with tag `latest`
- [ ] Update changelog

### Major Release Checklist

- [ ] Finalize breaking changes
- [ ] Create migration utilities
- [ ] Update schema URL
- [ ] Comprehensive migration guide
- [ ] Run full test suite
- [ ] Publish to npm with tag `next` (beta period)
- [ ] After beta: publish with tag `latest`
- [ ] Keep previous major version in maintenance mode

## Version Support Policy

| Version | Status | Support Level |
|---------|--------|--------------|
| 2.x (latest) | Active | Full support, new features |
| 1.x (previous) | Maintenance | Bug fixes, security patches |
| 0.x (legacy) | End of Life | No support |

**Support duration:** 12 months after next major release

## Future Versions Roadmap

### v1.1.0 (Q2 2026)
- Add `license` field to metadata
- New diagram types: Petri nets, Sankey
- Enhanced layout options

### v1.2.0 (Q3 2026)
- Add `tags` array to metadata
- Support for diagram themes
- Animation metadata

### v2.0.0 (Q1 2027)
- Restructure metadata (breaking)
- Required `created` and `modified` timestamps
- New node/edge data structure
- Deprecate legacy fields

## Version Negotiation

For tools that communicate:

```json
{
  "client": {
    "name": "aigp-cli",
    "version": "1.5.0",
    "supportedSchemaVersions": ["1.0", "1.1", "1.2"]
  },
  "server": {
    "name": "aigraphia-api",
    "version": "2.0.0",
    "supportedSchemaVersions": ["1.0", "1.1", "2.0"]
  },
  "negotiated": "1.1"  // Highest common version
}
```

## Testing Strategy

```typescript
describe('Version compatibility', () => {
  it('should read v1.0 diagrams with v1.2 parser', () => {
    const v1_0_diagram = loadFixture('diagram-v1.0.json');
    const result = parse(v1_0_diagram);
    expect(result.success).toBe(true);
  });

  it('should migrate v1.x to v2.0', () => {
    const v1_diagram = loadFixture('diagram-v1.5.json');
    const v2_diagram = migrate(v1_diagram, '2.0.0');
    expect(v2_diagram.version).toBe('2.0.0');
    expect(validate(v2_diagram).valid).toBe(true);
  });

  it('should emit warning for deprecated fields', () => {
    const deprecated = loadFixture('diagram-with-deprecated.json');
    const warnings = validate(deprecated).warnings;
    expect(warnings).toContain('Field "label" is deprecated');
  });
});
```

## Community Input

Version changes (especially breaking changes) should:
1. Be proposed via RFC (Request for Comments)
2. Have at least 30-day comment period
3. Be discussed in community Discord
4. Consider backward compatibility impact
5. Provide clear migration paths

## References

- Semantic Versioning: https://semver.org/
- JSON Schema Versioning: https://json-schema.org/specification-links.html#draft-2020-12
- API Versioning Best Practices: https://www.troyhunt.com/your-api-versioning-is-wrong/
