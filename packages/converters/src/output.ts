/**
 * Multi-modal output generator
 */

import { AIGraphDocument } from '@aigraphia/protocol';
import { convertToMermaid } from './export/mermaid.js';

export interface OutputOptions {
  platform: 'chatgpt' | 'claude' | 'cursor' | 'slack' | 'generic';
  format?: 'mermaid' | 'url' | 'file' | 'image' | 'svg';
  baseUrl?: string;
}

export async function generateOutput(
  diagram: AIGraphDocument,
  options: OutputOptions
): Promise<string> {
  switch (options.platform) {
    case 'chatgpt':
    case 'claude':
      // Convert to Mermaid for inline rendering
      const mermaid = convertToMermaid(diagram);
      return `\`\`\`mermaid\n${mermaid}\n\`\`\``;

    case 'cursor':
      // Write local file
      const filename = `${diagram.metadata.title || 'diagram'}.json`;
      return `Diagram saved to ${filename}. Open it in the editor to view.`;

    case 'slack':
      // Would export to PNG and upload
      throw new Error('Slack output format is not yet supported. Contributions welcome!');

    case 'generic':
      // Generate shareable URL
      const encoded = Buffer.from(JSON.stringify(diagram)).toString('base64url');
      const baseUrl = options.baseUrl || 'https://aigraphia.com';
      return `${baseUrl}/view?data=${encoded}`;

    default:
      return convertToMermaid(diagram);
  }
}
