/**
 * Base plugin interface and registry
 */

import { AIGraphDocument, DiagramType, LayoutConfig, StyleConfig } from '@aigraphia/protocol';
import { ValidationResult } from '@aigraphia/protocol';

// ============================================================================
// Plugin Type Definitions
// ============================================================================

export interface NodeTypeDefinition {
  name: string;
  label: string;
  description: string;
  defaultStyle?: Record<string, unknown>;
  requiredFields?: string[];
  optionalFields?: string[];
}

export interface EdgeTypeDefinition {
  name: string;
  label: string;
  description: string;
  defaultStyle?: Record<string, unknown>;
  requiredFields?: string[];
  optionalFields?: string[];
}

export interface GroupTypeDefinition {
  name: string;
  label: string;
  description: string;
  defaultStyle?: Record<string, unknown>;
  requiredFields?: string[];
  optionalFields?: string[];
}

// ============================================================================
// Plugin Interface
// ============================================================================

export interface DiagramPlugin {
  // Metadata
  type: DiagramType;
  name: string;
  description: string;

  // Type definitions
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
  groupTypes: Record<string, GroupTypeDefinition>;

  // Validation
  validator: (diagram: AIGraphDocument) => ValidationResult;

  // Default configurations
  defaultLayout: LayoutConfig;
  defaultStyles: StyleConfig;

  // AI generation hints
  aiPrompts: {
    systemPrompt: string;
    examples: string[];
  };
}

// ============================================================================
// Plugin Registry
// ============================================================================

export class PluginRegistry {
  private plugins = new Map<DiagramType, DiagramPlugin>();

  /**
   * Register a plugin
   */
  register(plugin: DiagramPlugin): void {
    if (this.plugins.has(plugin.type)) {
      throw new Error(`Plugin for diagram type '${plugin.type}' already registered`);
    }
    this.plugins.set(plugin.type, plugin);
  }

  /**
   * Get a plugin by diagram type
   */
  get(type: DiagramType): DiagramPlugin | undefined {
    return this.plugins.get(type);
  }

  /**
   * Get a plugin or throw
   */
  getOrThrow(type: DiagramType): DiagramPlugin {
    const plugin = this.plugins.get(type);
    if (!plugin) {
      throw new Error(`No plugin registered for diagram type '${type}'`);
    }
    return plugin;
  }

  /**
   * List all registered plugins
   */
  list(): DiagramPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if plugin exists
   */
  has(type: DiagramType): boolean {
    return this.plugins.has(type);
  }

  /**
   * Validate diagram using appropriate plugin
   */
  validate(diagram: AIGraphDocument): ValidationResult {
    const plugin = this.get(diagram.type);
    if (!plugin) {
      return {
        valid: false,
        errors: [{
          path: 'type',
          message: `No plugin registered for diagram type '${diagram.type}'`,
        }],
      };
    }
    return plugin.validator(diagram);
  }

  /**
   * Get default layout for diagram type
   */
  getDefaultLayout(type: DiagramType): LayoutConfig | undefined {
    const plugin = this.get(type);
    return plugin?.defaultLayout;
  }

  /**
   * Get default styles for diagram type
   */
  getDefaultStyles(type: DiagramType): StyleConfig | undefined {
    const plugin = this.get(type);
    return plugin?.defaultStyles;
  }
}

// Global registry instance
export const registry = new PluginRegistry();

/**
 * Convenience function to get plugin
 */
export function getPlugin(type: DiagramType): DiagramPlugin | undefined {
  return registry.get(type);
}

/**
 * Convenience function to register plugin
 */
export function registerPlugin(plugin: DiagramPlugin): void {
  registry.register(plugin);
}
