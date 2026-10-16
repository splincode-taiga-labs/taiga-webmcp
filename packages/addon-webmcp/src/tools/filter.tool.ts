import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpFilterOptions} from './types';

/**
 * Exposes a semantic search/filter operation, never an artificial DOM click.
 * Pass the returned descriptor to Angular's provideExperimentalWebMcpTools.
 */
export function tuiWebMcpFilterTool(config: TuiWebMcpFilterOptions) {
  const maxLength = config.maxLength ?? 120;

  if (!Number.isSafeInteger(maxLength) || maxLength < 1) {
    throw new RangeError('maxLength must be a positive integer');
  }

  return {
    name: config.name,
    description: config.description,
    inputSchema: {
      type: 'object',
      properties: {query: {type: 'string', maxLength}},
      required: ['query'],
      additionalProperties: false,
    } as const,
    execute: ({query}: {query: unknown}) => {
      // JSON Schema alone is not a security boundary; validate at runtime.
      if (typeof query !== 'string' || query.length > maxLength) {
        return tuiWebMcpTextResult('Invalid query', true);
      }

      config.setQuery(query);
      return tuiWebMcpTextResult('Filter updated');
    },
  };
}
