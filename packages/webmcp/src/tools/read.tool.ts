import {tuiWebMcpTextResult} from './result';
import type {TuiWebMcpReadOptions} from './types';

/** Application-controlled, read-only snapshot. Never serialize component internals. */
export function tuiWebMcpReadTool(config: TuiWebMcpReadOptions) {
  return {
    name: config.name,
    description: config.description,
    annotations: {readOnlyHint: true},
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    } as const,
    execute: () => tuiWebMcpTextResult(JSON.stringify(config.read())),
  };
}
