import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpSortOptions} from './types';

/** Changes a table's sort state using only application-approved columns. */
export function tuiWebMcpSortTool(config: TuiWebMcpSortOptions) {
  const columns = [...config.columns];

  if (!columns.length || columns.some((column) => !column) || new Set(columns).size !== columns.length) {
    throw new Error('columns must contain unique, non-empty names');
  }

  return {
    name: config.name,
    description: config.description,
    inputSchema: {
      type: 'object',
      properties: {
        column: {type: 'string', enum: columns},
        direction: {type: 'string', enum: ['asc', 'desc']},
      },
      required: ['column', 'direction'],
      additionalProperties: false,
    } as const,
    execute: ({column, direction}: {column: unknown; direction: unknown}) => {
      if (
        typeof column !== 'string' ||
        !columns.includes(column) ||
        (direction !== 'asc' && direction !== 'desc')
      ) {
        return tuiWebMcpTextResult('Invalid sort column or direction', true);
      }

      config.setSort({column, direction});
      return tuiWebMcpTextResult(`Sorted by ${column} (${direction})`);
    },
  };
}
