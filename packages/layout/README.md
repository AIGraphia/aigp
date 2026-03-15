# @aigraphia/layout

Layout engine abstraction supporting Dagre, ELK, D3, and more

## Installation

```bash
pnpm add @aigraphia/layout
```

## Usage

```ts
import { selectLayoutEngine, DagreLayoutEngine } from '@aigraphia/layout';
import type { LayoutEngine, LayoutResult } from '@aigraphia/layout';

// Auto-select the best engine for a document
const engine = selectLayoutEngine(document);
const result: LayoutResult = await engine.layout(document.graph, document.layout);
```

## License

MIT
