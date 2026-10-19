import {describe, expect, it, vi} from 'vitest';

import {tuiWebMcpFilterTool} from './filter.tool';
import {tuiWebMcpReadTool} from './read.tool';
import {tuiWebMcpSelectionTool} from './selection.tool';

describe('WebMCP tools', () => {
  it('updates the application filter state', () => {
    const setQuery = vi.fn();
    const tool = tuiWebMcpFilterTool({name: 'filter', description: 'Filter', setQuery});

    expect(tool.execute({query: 'Ada'}).isError).toBeUndefined();
    expect(setQuery).toHaveBeenCalledWith('Ada');
  });

  it('rejects non-string and excessive input before mutation', () => {
    const setQuery = vi.fn();
    const tool = tuiWebMcpFilterTool({name: 'filter', description: 'Filter', maxLength: 3, setQuery});

    expect(tool.execute({query: 5}).isError).toBe(true);
    expect(tool.execute({query: 'abcd'}).isError).toBe(true);
    expect(setQuery).not.toHaveBeenCalled();
  });

  it('rejects invalid maxLength options', () => {
    expect(() => tuiWebMcpFilterTool({name: 'x', description: 'x', maxLength: 0, setQuery: vi.fn()})).toThrow(RangeError);
  });

  it('only selects an allowed stable ID and refreshes options each invocation', () => {
    const select = vi.fn();
    let values = [{id: '1', label: 'Ada'}];
    const tool = tuiWebMcpSelectionTool({name: 'select', description: 'Select', options: () => values, select});

    expect(tool.execute({id: '2'}).isError).toBe(true);
    values = [{id: '2', label: 'Grace'}];
    expect(tool.execute({id: '2'}).content[0]?.text).toBe('Selected: Grace');
    expect(select).toHaveBeenCalledExactlyOnceWith('2');
  });

  it('returns only an application-approved snapshot', () => {
    const read = vi.fn(() => ({count: 2}));
    const tool = tuiWebMcpReadTool({name: 'read', description: 'Read', read});

    expect(tool.execute().content[0]?.text).toBe('{"count":2}');
    expect(read).toHaveBeenCalledOnce();
  });
});
