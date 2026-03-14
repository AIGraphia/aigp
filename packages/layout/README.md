# @aigp/layout

Layout engine abstraction supporting Dagre, ELK, D3, and more

## Installation

```bash
pnpm add @aigp/layout
```

## Usage

```ts
import { selectLayoutEngine, DagreLayoutEngine } from '@aigp/layout';
import type { LayoutEngine, LayoutResult } from '@aigp/layout';

// Auto-select the best engine for a document
const engine = selectLayoutEngine(document);
const result: LayoutResult = await engine.layout(document.graph, document.layout);
```

## License

MIT
