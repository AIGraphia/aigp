# @aigp/plugins

Plugin system for diagram types with base classes and built-in plugins

## Installation

```bash
pnpm add @aigp/plugins
```

## Usage

```ts
import {
  registerPlugin,
  getPlugin,
  flowchartPlugin,
  sequencePlugin,
} from '@aigp/plugins';
import type { DiagramPlugin } from '@aigp/plugins';

// Plugins are auto-registered on import; look one up by type
const plugin = getPlugin('flowchart');
```

## License

MIT
