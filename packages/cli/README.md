# @aigraphia/cli

Command-line interface for working with AIGP diagrams.

## Installation

```bash
pnpm add -g @aigraphia/cli
```

Or use with pnpm dlx:

```bash
pnpm dlx @aigraphia/cli [command]
```

## Commands

### `aigp init [type] [name]`

Initialize a new diagram with optional type and name.

**Examples:**

```bash
# Interactive mode - prompts for type and name
aigp init

# Create a flowchart diagram
aigp init flowchart my-diagram

# Create a sequence diagram
aigp init sequence user-flow
```

### `aigp validate <file>`

Validate an AIGP diagram file against the schema.

**Examples:**

```bash
# Validate a diagram file
aigp validate my-diagram.json

# Validate a JSON file
aigp validate diagram.json
```

### `aigp types`

List all available diagram types supported by AIGP.

**Output includes:**
- Diagram type ID
- Display name
- Description
- Node types available
- Edge types available

**Example:**

```bash
aigp types
```

### `aigp export svg <input> [options]`

Export an AIGP diagram to SVG format.

**Arguments:**
- `<input>` - Input AIGP diagram file (.json or .json)

**Options:**
- `-o, --output <file>` - Output SVG file (default: input.svg)
- `-w, --width <pixels>` - SVG width (default: 800)
- `-h, --height <pixels>` - SVG height (default: 600)
- `-p, --padding <pixels>` - Padding around diagram (default: 20)
- `-b, --background <color>` - Background color (default: #ffffff)
- `--no-viewbox` - Disable viewBox attribute

**Examples:**

```bash
# Export to SVG with default settings
aigp export svg diagram.json

# Export with custom dimensions
aigp export svg diagram.json -w 1200 -h 800

# Export with custom output path
aigp export svg diagram.json -o output/diagram.svg

# Export with transparent background
aigp export svg diagram.json -b transparent

# Export with custom padding
aigp export svg diagram.json -p 40
```

### `aigp export png <input> [options]`

Export an AIGP diagram to PNG format (or JPEG/WebP).

**Arguments:**
- `<input>` - Input AIGP diagram file (.json or .json)

**Options:**
- `-o, --output <file>` - Output PNG file (default: input.png)
- `-w, --width <pixels>` - Image width (default: 800)
- `-h, --height <pixels>` - Image height (default: 600)
- `-p, --padding <pixels>` - Padding around diagram (default: 20)
- `-b, --background <color>` - Background color (default: #ffffff)
- `-s, --scale <factor>` - Scale factor for retina displays (default: 2)
- `-q, --quality <percent>` - Image quality 1-100 (default: 90)
- `-f, --format <type>` - Output format: png, jpeg, webp (default: png)

**Examples:**

```bash
# Export to PNG with default settings (2x scale)
aigp export png diagram.json

# Export with custom dimensions
aigp export png diagram.json -w 1600 -h 1200

# Export as JPEG with 85% quality
aigp export png diagram.json -o diagram.jpg -f jpeg -q 85

# Export as WebP
aigp export png diagram.json -o diagram.webp -f webp

# Export with 3x scale for extra high quality
aigp export png diagram.json -s 3

# Export with custom output path
aigp export png diagram.json -o exports/diagram.png
```

## Usage Examples

### Create and Export a Flowchart

```bash
# Initialize a flowchart
aigp init flowchart my-flow

# Edit the generated file (my-flow.json)
# ... add your nodes and edges ...

# Validate the diagram
aigp validate my-flow.json

# Export to SVG
aigp export svg my-flow.json

# Export to PNG
aigp export png my-flow.json
```

### Batch Export

```bash
# Export all diagrams in a directory to SVG
for file in *.json; do
  aigp export svg "$file"
done

# Export all diagrams to PNG with high quality
for file in *.json; do
  aigp export png "$file" -s 3 -q 95
done
```

### Export for Web and Print

```bash
# Web version (optimized size)
aigp export png diagram.json -o web/diagram.png -w 800 -s 2

# Print version (high quality)
aigp export png diagram.json -o print/diagram.png -w 3000 -s 1 -q 100
```

## Global Options

All commands support:
- `--help` - Display help information

## File Formats

### Input Files

The CLI accepts two input formats:
- `.json` - AIGP Format (recommended)
- `.json` - Standard JSON format

Both formats must conform to the AIGP schema.

### Output Files

Export commands support:
- `.svg` - Scalable Vector Graphics
- `.png` - Portable Network Graphics
- `.jpg` / `.jpeg` - JPEG images
- `.webp` - WebP images

## Exit Codes

- `0` - Success
- `1` - Error (validation failure, file not found, etc.)

## Environment Variables

None currently used.

## Dependencies

The CLI integrates these AIGP packages:
- `@aigraphia/protocol` - Core protocol definitions
- `@aigraphia/plugins` - Diagram type plugins
- `@aigraphia/layout` - Layout engines
- `@aigraphia/export` - SVG and PNG export
- `@aigraphia/converters` - Format converters

## Development

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Run tests
pnpm test

# Link for local development
pnpm link --global

# Test locally
aigp --help
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT - See LICENSE file for details

## Related Packages

- `@aigraphia/protocol` - Core protocol definitions
- `@aigraphia/plugins` - Diagram type plugins
- `@aigraphia/layout` - Layout algorithms
- `@aigraphia/export` - SVG and PNG export
- `@aigraphia/converters` - Format converters
