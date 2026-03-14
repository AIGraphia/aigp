# AIGP VS Code Extension

Preview, validate, and create AIGP diagrams directly in Visual Studio Code.

## Features

- **📊 Diagram Preview**: Real-time preview of AIGP diagrams using Mermaid rendering
- **✅ Validation**: Instant validation of AIGP document schema
- **🔄 Convert to Mermaid**: Export AIGP diagrams to Mermaid format
- **📝 Create Diagrams**: Quick-start templates for 14+ diagram types
- **💾 Auto-validation**: Validate diagrams automatically on save
- **🎨 Syntax Highlighting**: JSON syntax highlighting for .json files

## Installation

### From Marketplace (Coming Soon)
```
ext install aigp.aigp-vscode
```

### From Source
1. Clone the AIGP repository
2. Navigate to `extensions/vscode`
3. Run `pnpm install`
4. Run `pnpm run compile`
5. Press F5 to open Extension Development Host

## Usage

### Preview a Diagram
1. Open any `.json` file
2. Click the preview icon in the editor title bar
3. Or use Command Palette: `AIGP: Preview Diagram`

### Validate a Document
- Command Palette: `AIGP: Validate Document`
- Or save the file (if auto-validation is enabled)

### Convert to Mermaid
- Command Palette: `AIGP: Convert to Mermaid`
- Opens Mermaid code in a new editor

### Create New Diagram
1. Command Palette: `AIGP: New Diagram`
2. Select diagram type
3. Edit the template

## Configuration

Settings available in VS Code preferences:

- `aigp.preview.theme`: Theme for diagram preview (default, dark, neutral)
- `aigp.validation.onSave`: Validate documents on save (default: true)

## Supported Diagram Types

- Flowcharts
- Sequence Diagrams
- Class Diagrams
- ER Diagrams
- State Machines
- BPMN
- Architecture Diagrams
- Organization Charts
- Mind Maps
- Network Diagrams
- Timelines
- Kanban Boards
- Sankey Diagrams
- Funnel Diagrams

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18+ (for development)

## Known Issues

- Preview requires internet connection for Mermaid CDN
- Large diagrams (1000+ nodes) may render slowly

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Links

- [AIGP Repository](https://github.com/aigp/aigp)
- [Documentation](https://aigp.dev)
- [Examples](../../examples/README.md)
