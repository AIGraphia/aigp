# AIGraphia Skills

AI Skills for universal agent integration with AIGraphia.

## Available Skills

### aigraphia-create
Generate diagrams from natural language descriptions.

**Triggers:**
- Explanation exceeds 10 sentences
- User says "show me", "explain", "how does X work"
- Complex relationships described
- User requests a diagram

**Platforms:** Claude, ChatGPT, Cursor, Generic

### aigraphia-edit
Modify existing diagrams based on user feedback.

**Capabilities:**
- Add/remove nodes and edges
- Modify labels and properties
- Restructure layout
- Change diagram type

**Platforms:** Claude, ChatGPT, Cursor, Generic

### aigraphia-explain
Convert diagram back to natural language explanation.

**Use Case:**
- User opens diagram and asks for explanation
- Understanding existing diagrams
- Documentation generation

**Platforms:** Claude, ChatGPT, Cursor, Generic

## Installation

### For Claude Code
```bash
claude-code skills install aigraphia
```

### For ChatGPT
Install from OpenAI Plugin Store

### For Cursor
Install as Cursor extension

### Generic Integration
```bash
pnpm add @aigraphia/skills
```

## Usage

Skills are automatically triggered based on context. When your explanation would benefit from a diagram, the AI will automatically generate one.

## Examples

See individual skill directories for detailed examples.

## Documentation

Full documentation: https://aigraphia.com/docs/skills
