# @aigp/protocol

Core AIGP protocol types, schemas, and validation using Zod

## Installation

```bash
pnpm add @aigp/protocol
```

## Usage

```ts
import { AIGraphDocumentSchema, validate } from '@aigp/protocol';
import type { AIGraphDocument, DiagramType, Node, Edge } from '@aigp/protocol';

// Validate an unknown payload against the schema
const result = validate(data);
if (result.valid) {
  const doc: AIGraphDocument = result.document;
}
```

## License

MIT
