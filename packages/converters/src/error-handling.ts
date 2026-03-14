/**
 * Enhanced error handling for AIGP operations
 */

export class AIGPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AIGPError';
  }
}

export class ValidationError extends AIGPError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ParseError extends AIGPError {
  constructor(message: string, details?: any) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
  }
}

export class ConversionError extends AIGPError {
  constructor(message: string, details?: any) {
    super(message, 'CONVERSION_ERROR', details);
    this.name = 'ConversionError';
  }
}

export class PerformanceError extends AIGPError {
  constructor(message: string, details?: any) {
    super(message, 'PERFORMANCE_ERROR', details);
    this.name = 'PerformanceError';
  }
}

export interface ErrorContext {
  operation: string;
  input?: any;
  timestamp: string;
  stack?: string;
}

export interface ErrorReport {
  error: AIGPError;
  context: ErrorContext;
  suggestions: string[];
}

/**
 * Create detailed error report with suggestions
 */
export function createErrorReport(
  error: Error,
  operation: string,
  input?: any
): ErrorReport {
  const aigpError = error instanceof AIGPError
    ? error
    : new AIGPError(error.message, 'UNKNOWN_ERROR');

  const context: ErrorContext = {
    operation,
    input: input ? sanitizeInput(input) : undefined,
    timestamp: new Date().toISOString(),
    stack: error.stack
  };

  const suggestions = generateSuggestions(aigpError, context);

  return {
    error: aigpError,
    context,
    suggestions
  };
}

/**
 * Validate AIGP document structure and provide helpful error messages
 */
export function validateWithContext(
  data: unknown,
  context: string
): { valid: boolean; errors?: ErrorReport[] } {
  try {
    const errors: ErrorReport[] = [];

    if (!data) {
      errors.push(createErrorReport(
        new ValidationError('Data is null or undefined'),
        `validate:${context}`,
        data
      ));
      return { valid: false, errors };
    }

    if (typeof data !== 'object') {
      errors.push(createErrorReport(
        new ValidationError('Data must be an object'),
        `validate:${context}`,
        data
      ));
      return { valid: false, errors };
    }

    // Check required fields
    const required = ['schema', 'version', 'type', 'metadata', 'graph'];
    for (const field of required) {
      if (!(field in data)) {
        errors.push(createErrorReport(
          new ValidationError(`Missing required field: ${field}`),
          `validate:${context}`,
          data
        ));
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [createErrorReport(error as Error, `validate:${context}`, data)]
    };
  }
}

/**
 * Safe parsing with error recovery
 */
export function safeParse<T>(
  input: string,
  parser: (input: string) => T,
  fallback: T
): { success: boolean; data: T; error?: ErrorReport } {
  try {
    const data = parser(input);
    return { success: true, data };
  } catch (error) {
    const report = createErrorReport(
      error as Error,
      'parse',
      { inputLength: input.length }
    );
    return { success: false, data: fallback, error: report };
  }
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw new AIGPError(
          `Operation failed after ${maxRetries} retries`,
          'RETRY_EXHAUSTED',
          { originalError: lastError.message, attempts: maxRetries + 1 }
        );
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Collect and aggregate multiple errors
 */
export class ErrorCollector {
  private errors: ErrorReport[] = [];

  add(error: Error, operation: string, input?: any) {
    this.errors.push(createErrorReport(error, operation, input));
  }

  addReport(report: ErrorReport) {
    this.errors.push(report);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): ErrorReport[] {
    return this.errors;
  }

  getSummary(): string {
    if (this.errors.length === 0) return 'No errors';

    const errorTypes = new Map<string, number>();
    this.errors.forEach(report => {
      const code = report.error.code;
      errorTypes.set(code, (errorTypes.get(code) || 0) + 1);
    });

    const summary = Array.from(errorTypes.entries())
      .map(([code, count]) => `${code}: ${count}`)
      .join(', ');

    return `${this.errors.length} errors - ${summary}`;
  }

  clear() {
    this.errors = [];
  }
}

// Helper functions

function sanitizeInput(input: any): any {
  if (typeof input === 'string' && input.length > 1000) {
    return `${input.substring(0, 1000)}... (truncated)`;
  }
  if (typeof input === 'object') {
    return {
      type: input.constructor?.name || 'Object',
      keys: Object.keys(input).slice(0, 10)
    };
  }
  return input;
}

function generateSuggestions(error: AIGPError, context: ErrorContext): string[] {
  const suggestions: string[] = [];

  switch (error.code) {
    case 'VALIDATION_ERROR':
      suggestions.push('Check the AIGP schema documentation');
      suggestions.push('Validate your JSON structure');
      if (error.message.includes('required field')) {
        suggestions.push('Ensure all required fields are present: schema, version, type, metadata, graph');
      }
      break;

    case 'PARSE_ERROR':
      suggestions.push('Verify the input format is correct');
      suggestions.push('Check for syntax errors');
      if (context.input) {
        suggestions.push('Try validating the input JSON');
      }
      break;

    case 'CONVERSION_ERROR':
      suggestions.push('Ensure the source format is supported');
      suggestions.push('Check converter compatibility');
      suggestions.push('Try converting to an intermediate format (e.g., Mermaid)');
      break;

    case 'PERFORMANCE_ERROR':
      suggestions.push('Consider optimizing the diagram (reduce nodes/edges)');
      suggestions.push('Use pagination for large diagrams');
      suggestions.push('Enable performance mode in settings');
      break;

    default:
      suggestions.push('Check the error message for details');
      suggestions.push('Refer to the documentation');
      suggestions.push('Report the issue if it persists');
  }

  return suggestions;
}

/**
 * Log error with context
 */
export function logError(report: ErrorReport, level: 'error' | 'warn' | 'info' = 'error') {
  const message = `[${report.error.code}] ${report.error.message}`;
  const details = {
    operation: report.context.operation,
    timestamp: report.context.timestamp,
    suggestions: report.suggestions
  };

  switch (level) {
    case 'error':
      console.error(message, details);
      break;
    case 'warn':
      console.warn(message, details);
      break;
    case 'info':
      console.info(message, details);
      break;
  }
}

/**
 * Format error for user display
 */
export function formatErrorForUser(report: ErrorReport): string {
  let output = `❌ ${report.error.message}\n\n`;

  if (report.suggestions.length > 0) {
    output += '💡 Suggestions:\n';
    report.suggestions.forEach(suggestion => {
      output += `   • ${suggestion}\n`;
    });
  }

  return output;
}
