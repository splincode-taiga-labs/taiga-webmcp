import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpPaginationOptions} from './types';

/** Navigates a zero-based page index, consistent with Taiga UI TablePagination. */
export function tuiWebMcpPaginationTool(config: TuiWebMcpPaginationOptions) {
  const pageSizes = [...config.pageSizes];

  if (
    !pageSizes.length ||
    pageSizes.some((size) => !Number.isSafeInteger(size) || size <= 0) ||
    new Set(pageSizes).size !== pageSizes.length
  ) {
    throw new Error('pageSizes must contain unique positive integers');
  }

  return {
    name: config.name,
    description: config.description,
    inputSchema: {
      type: 'object',
      properties: {
        page: {type: 'integer', minimum: 0},
        size: {type: 'integer', enum: pageSizes},
      },
      required: ['page', 'size'],
      additionalProperties: false,
    } as const,
    execute: ({page, size}: {page: unknown; size: unknown}) => {
      if (
        typeof page !== 'number' ||
        typeof size !== 'number' ||
        !Number.isSafeInteger(page) ||
        !Number.isSafeInteger(size) ||
        !pageSizes.includes(size) ||
        page < 0
      ) {
        return tuiWebMcpTextResult('Invalid page index or size', true);
      }

      const total = config.getTotal();

      if (!Number.isSafeInteger(total) || total < 0) {
        return tuiWebMcpTextResult('Invalid total item count', true);
      }

      const lastPage = Math.max(0, Math.ceil(total / size) - 1);

      if (page > lastPage) {
        return tuiWebMcpTextResult(`Page out of range (last page: ${lastPage})`, true);
      }

      config.setPagination({page, size});
      return tuiWebMcpTextResult(`Showing page ${page} (size ${size}; total ${total})`);
    },
  };
}
