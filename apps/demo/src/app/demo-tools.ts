import {inject} from '@angular/core';
import {
  tuiWebMcpFilterTool,
  tuiWebMcpPaginationTool,
  tuiWebMcpReadTool,
  tuiWebMcpSelectionTool,
  tuiWebMcpSortTool,
} from '@taiga-ui-labs/webmcp';

import {DemoState} from './demo-state';

export const FILTER_TOOL = tuiWebMcpFilterTool({
  name: 'filterDemoEmployees',
  description: 'Filter the visible employee list by name or team.',
  setQuery: (query) => inject(DemoState).setQuery(query),
});

export const SELECT_TOOL = tuiWebMcpSelectionTool({
  name: 'selectDemoEmployee',
  description: 'Select an employee from the current page using their stable ID.',
  options: () =>
    inject(DemoState)
      .visibleEmployees()
      .map(({id, name}) => ({id, label: name})),
  select: (id) => inject(DemoState).selectedId.set(id),
});

export const SORT_TOOL = tuiWebMcpSortTool({
  name: 'sortDemoEmployees',
  description: 'Sort the employee table by name or team, ascending or descending.',
  columns: ['name', 'team'],
  setSort: (sort) => inject(DemoState).setSort(sort),
});

export const PAGINATION_TOOL = tuiWebMcpPaginationTool({
  name: 'paginateDemoEmployees',
  description: 'Change the zero-based page of employees and the page size.',
  pageSizes: [2, 4],
  getTotal: () => inject(DemoState).filteredEmployees().length,
  setPagination: (pagination) => inject(DemoState).setPagination(pagination),
});

export const READ_TOOL = tuiWebMcpReadTool({
  name: 'readDemoEmployees',
  description: 'Read the current sort, page and visible employees (not private data).',
  read: () => {
    const state = inject(DemoState);
    return {
      query: state.query(),
      sort: {column: state.sortColumn(), direction: state.sortDirection()},
      pagination: {page: state.page(), size: state.size(), total: state.filteredEmployees().length},
      employees: state.visibleEmployees(),
    };
  },
});
