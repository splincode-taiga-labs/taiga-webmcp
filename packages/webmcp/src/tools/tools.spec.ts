import {describe, expect, it, vi} from 'vitest';

import {tuiWebMcpFilterTool} from './filter.tool';
import {tuiWebMcpPaginationTool} from './pagination.tool';
import {tuiWebMcpSortTool} from './sort.tool';
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
    const tool = tuiWebMcpFilterTool({
      name: 'filter',
      description: 'Filter',
      maxLength: 3,
      setQuery,
    });

    expect(tool.execute({query: 5}).isError).toBe(true);
    expect(tool.execute({query: 'abcd'}).isError).toBe(true);
    expect(setQuery).not.toHaveBeenCalled();
  });

  it('rejects invalid maxLength options', () => {
    expect(() =>
      tuiWebMcpFilterTool({name: 'x', description: 'x', maxLength: 0, setQuery: vi.fn()}),
    ).toThrow(RangeError);
  });

  it('only selects an allowed stable ID and refreshes options each invocation', () => {
    const select = vi.fn();
    let values = [{id: '1', label: 'Ada'}];
    const tool = tuiWebMcpSelectionTool({
      name: 'select',
      description: 'Select',
      options: () => values,
      select,
    });

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
  it('sorts only whitelisted columns in supported directions', () => {
    const setSort = vi.fn();
    const tool = tuiWebMcpSortTool({
      name: 'sort',
      description: 'Sort employees',
      columns: ['name', 'team'],
      setSort,
    });

    expect(tool.execute({column: 'name', direction: 'desc'}).isError).toBeUndefined();
    expect(setSort).toHaveBeenCalledExactlyOnceWith({column: 'name', direction: 'desc'});
    expect(tool.execute({column: 'salary', direction: 'asc'}).isError).toBe(true);
    expect(tool.execute({column: 'name', direction: 'up'}).isError).toBe(true);
    expect(tool.execute({column: null, direction: 'asc'}).isError).toBe(true);
    expect(setSort).toHaveBeenCalledTimes(1);
  });

  it('rejects empty or ambiguous sorting allowlists', () => {
    const config = {name: 'sort', description: 'Sort', setSort: vi.fn()};
    expect(() => tuiWebMcpSortTool({...config, columns: []})).toThrow();
    expect(() => tuiWebMcpSortTool({...config, columns: ['name', 'name']})).toThrow();
  });

  it('navigates zero-based pages with allowed sizes', () => {
    const setPagination = vi.fn();
    const tool = tuiWebMcpPaginationTool({
      name: 'paginate',
      description: 'Change page',
      pageSizes: [2, 4],
      getTotal: () => 5,
      setPagination,
    });

    expect(tool.execute({page: 2, size: 2}).isError).toBeUndefined();
    expect(setPagination).toHaveBeenCalledExactlyOnceWith({page: 2, size: 2});
    expect(tool.execute({page: -1, size: 2}).isError).toBe(true);
    expect(tool.execute({page: 1.5, size: 2}).isError).toBe(true);
    expect(tool.execute({page: 0, size: 3}).isError).toBe(true);
    expect(tool.execute({page: 3, size: 2}).isError).toBe(true);
    expect(tool.execute({page: 1, size: NaN}).isError).toBe(true);
    expect(setPagination).toHaveBeenCalledTimes(1);
  });

  it('uses fresh totals and permits page 0 of an empty result', () => {
    let total = 0;
    const setPagination = vi.fn();
    const tool = tuiWebMcpPaginationTool({
      name: 'paginate',
      description: 'Change page',
      pageSizes: [2],
      getTotal: () => total,
      setPagination,
    });

    expect(tool.execute({page: 0, size: 2}).isError).toBeUndefined();
    expect(tool.execute({page: 1, size: 2}).isError).toBe(true);
    total = 5;
    expect(tool.execute({page: 2, size: 2}).isError).toBeUndefined();
    total = -1;
    expect(tool.execute({page: 0, size: 2}).isError).toBe(true);
    expect(setPagination).toHaveBeenCalledTimes(2);
  });

  it('rejects invalid pagination configuration', () => {
    const config = {
      name: 'paginate',
      description: 'Change page',
      getTotal: () => 0,
      setPagination: vi.fn(),
    };
    expect(() => tuiWebMcpPaginationTool({...config, pageSizes: []})).toThrow();
    expect(() => tuiWebMcpPaginationTool({...config, pageSizes: [2, 2]})).toThrow();
    expect(() => tuiWebMcpPaginationTool({...config, pageSizes: [0]})).toThrow();
    expect(() => tuiWebMcpPaginationTool({...config, pageSizes: [1.5]})).toThrow();
  });
});
