import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpMultiSelectionOptions} from './types';

/**
 * Replaces a multiselection by stable IDs rather than by labels or DOM events.
 * All IDs must be currently allowed: invalid selections never partially apply.
 */
export function tuiWebMcpMultiSelectionTool(config: TuiWebMcpMultiSelectionOptions) {
  const maxSelection = config.maxSelection ?? 100;

  if (!Number.isSafeInteger(maxSelection) || maxSelection < 1) {
    throw new RangeError('maxSelection must be a positive safe integer');
  }

  return {
    name: config.name,
    description: config.description,
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {type: 'string'},
          uniqueItems: true,
          maxItems: maxSelection,
        },
      },
      required: ['ids'],
      additionalProperties: false,
    } as const,
    execute: ({ids}: {ids: unknown}) => {
      if (!Array.isArray(ids) || ids.length > maxSelection) {
        return tuiWebMcpTextResult('Invalid selection IDs', true);
      }

      const selectedIds: string[] = [];

      for (const id of ids) {
        if (typeof id !== 'string' || !id) {
          return tuiWebMcpTextResult('Invalid selection IDs', true);
        }

        selectedIds.push(id);
      }

      if (new Set(selectedIds).size !== selectedIds.length) {
        return tuiWebMcpTextResult('Duplicate selection IDs', true);
      }

      const options = config.options();
      const allowedIds = new Set(options.map(({id}) => id));

      if (
        allowedIds.size !== options.length ||
        options.some(({id}) => !id) ||
        selectedIds.some((id) => !allowedIds.has(id))
      ) {
        return tuiWebMcpTextResult('Selection is not available', true);
      }

      config.select(selectedIds);
      return tuiWebMcpTextResult(`Selected ${selectedIds.length} items`);
    },
  };
}
