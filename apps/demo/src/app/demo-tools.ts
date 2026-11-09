import {inject} from '@angular/core';
import {
  tuiWebMcpFilterTool,
  tuiWebMcpMultiSelectionTool,
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

export const MULTI_SELECTION_TOOL = tuiWebMcpMultiSelectionTool({
  name: 'selectDemoTeams',
  description:
    'Replace the selected teams by stable IDs. Use readDemoTeamOptions for the allowed IDs.',
  options: () => inject(DemoState).teamOptions,
  select: (ids) => inject(DemoState).selectedTeamIds.set([...ids]),
  maxSelection: 3,
});

export const READ_TEAM_OPTIONS_TOOL = tuiWebMcpReadTool({
  name: 'readDemoTeamOptions',
  description: 'List available team IDs and the currently selected IDs.',
  read: () => {
    const state = inject(DemoState);
    return {options: state.teamOptions, selectedIds: state.selectedTeamIds()};
  },
});
