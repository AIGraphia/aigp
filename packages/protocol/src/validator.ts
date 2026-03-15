/**
 * Validator for AIGraph documents
 */

import { AIGraphDocumentSchema, AIGraphDocument } from './schema.js';
import { ZodError } from 'zod';

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  document?: AIGraphDocument;
}

export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Validate an AIGraph document
 */
export function validate(data: unknown): ValidationResult {
  try {
    const document = AIGraphDocumentSchema.parse(data);
    return {
      valid: true,
      document,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return {
        valid: false,
        errors,
      };
    }
    throw error;
  }
}

/**
 * Validate and throw on error
 */
export function validateOrThrow(data: unknown): AIGraphDocument {
  return AIGraphDocumentSchema.parse(data);
}

/**
 * Check if data is a valid AIGraph document (type guard)
 */
export function isAIGraphDocument(data: unknown): data is AIGraphDocument {
  return AIGraphDocumentSchema.safeParse(data).success;
}

/**
 * Validate specific diagram type
 */
export function validateDiagramType(document: AIGraphDocument, expectedType: string): ValidationResult {
  if (document.type !== expectedType) {
    return {
      valid: false,
      errors: [{
        path: 'type',
        message: `Expected diagram type '${expectedType}', got '${document.type}'`,
      }],
    };
  }
  return { valid: true, document };
}

/**
 * Validate graph structure (nodes, edges, groups)
 */
export function validateGraphStructure(document: AIGraphDocument): ValidationResult {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(document.graph.nodes.map(n => n.id));

  // Check for duplicate node IDs
  if (nodeIds.size !== document.graph.nodes.length) {
    errors.push({
      path: 'graph.nodes',
      message: 'Duplicate node IDs found',
    });
  }

  // Validate edge references
  for (const edge of document.graph.edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push({
        path: `graph.edges.${edge.id}.source`,
        message: `Edge references non-existent source node: ${edge.source}`,
      });
    }
    if (!nodeIds.has(edge.target)) {
      errors.push({
        path: `graph.edges.${edge.id}.target`,
        message: `Edge references non-existent target node: ${edge.target}`,
      });
    }
  }

  // Validate group references
  if (document.graph.groups) {
    for (const group of document.graph.groups) {
      for (const nodeId of group.nodeIds) {
        if (!nodeIds.has(nodeId)) {
          errors.push({
            path: `graph.groups.${group.id}.nodeIds`,
            message: `Group references non-existent node: ${nodeId}`,
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, document };
}

/**
 * Full validation (schema + structure)
 */
export function validateFull(data: unknown): ValidationResult {
  const schemaResult = validate(data);
  if (!schemaResult.valid || !schemaResult.document) {
    return schemaResult;
  }

  return validateGraphStructure(schemaResult.document);
}
