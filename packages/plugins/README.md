# @aigraphia/plugins

Plugin system for diagram types with base classes and built-in plugins

## Installation

```bash
pnpm add @aigraphia/plugins
```

## Usage

```ts
import {
  registerPlugin,
  getPlugin,
  flowchartPlugin,
  sequencePlugin,
} from '@aigraphia/plugins';
import type { DiagramPlugin } from '@aigraphia/plugins';

// Plugins are auto-registered on import; look one up by type
const plugin = getPlugin('flowchart');
```

## License

MIT
