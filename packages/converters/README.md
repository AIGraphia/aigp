# @aigraphia/converters

Import/export converters for Mermaid, PlantUML, and other formats

## Installation

```bash
pnpm add @aigraphia/converters
```

## Usage

```ts
import { convertToMermaid, fromMermaid, fromPlantUML } from '@aigraphia/converters';

// Import from Mermaid syntax
const { success, document } = fromMermaid('flowchart TD\n  A --> B');

// Export an AIGP document back to Mermaid
const mermaidCode = convertToMermaid(document);
```

## License

MIT
