import {inject} from '@angular/core';
import {
  tuiWebMcpFilterTool,
  tuiWebMcpReadTool,
  tuiWebMcpSelectionTool,
} from '@taiga-ui-labs/webmcp';

import {DemoState} from './demo-state';

/**
 * Tools operate on application state.
 * Angular registers each tool at the app injector, not once per DOM component.
 */
export const FILTER_TOOL = tuiWebMcpFilterTool({
  name: 'filterDemoEmployees',
  description: 'Filter the visible employee list by name or team.',
  setQuery: (query) => inject(DemoState).query.set(query),
});

export const SELECT_TOOL = tuiWebMcpSelectionTool({
  name: 'selectDemoEmployee',
  description: 'Select an employee from the visible list using their stable ID.',
  options: () =>
    inject(DemoState)
      .filteredEmployees()
      .map(({id, name}) => ({id, label: name})),
  select: (id) => inject(DemoState).selectedId.set(id),
});

export const READ_TOOL = tuiWebMcpReadTool({
  name: 'readDemoEmployees',
  description: 'Read the currently visible employee names and IDs.',
  read: () =>
    inject(DemoState)
      .filteredEmployees()
      .map(({id, name, team}) => ({id, name, team})),
});
