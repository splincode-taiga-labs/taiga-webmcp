import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpSelectionOptions} from './types';

/** Select a stable ID that is currently allowed, not a potentially ambiguous label. */
export function tuiWebMcpSelectionTool(config: TuiWebMcpSelectionOptions) {
  return {
    name: config.name,
    description: config.description,
    inputSchema: {
      type: 'object',
      properties: {id: {type: 'string'}},
      required: ['id'],
      additionalProperties: false,
    } as const,
    execute: ({id}: {id: unknown}) => {
      if (typeof id !== 'string') {
        return tuiWebMcpTextResult('Invalid selection ID', true);
      }

      const option = config.options().find((item) => item.id === id);

      if (!option) {
        return tuiWebMcpTextResult('Selection is not available', true);
      }

      config.select(option.id);
      return tuiWebMcpTextResult('Selected: ' + option.label);
    },
  };
}
