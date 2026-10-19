import type {TuiWebMcpResult} from './types';

/** Standard text payload understood by WebMCP agents. */
export function tuiWebMcpTextResult(text: string, isError = false): TuiWebMcpResult {
  return isError
    ? {content: [{type: 'text', text}], isError: true}
    : {content: [{type: 'text', text}]};
}
