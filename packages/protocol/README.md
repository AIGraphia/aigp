# @aigraphia/protocol

Core AIGP protocol types, schemas, and validation using Zod

## Installation

```bash
pnpm add @aigraphia/protocol
```

## Usage

```ts
import { AIGraphDocumentSchema, validate } from '@aigraphia/protocol';
import type { AIGraphDocument, DiagramType, Node, Edge } from '@aigraphia/protocol';

// Validate an unknown payload against the schema
const result = validate(data);
if (result.valid) {
  const doc: AIGraphDocument = result.document;
}
```

## License

MIT
