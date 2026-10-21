import {computed, Injectable, signal} from '@angular/core';
import type {TuiWebMcpPaginationState, TuiWebMcpSortState} from '@taiga-ui-labs/webmcp';

export interface Employee {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

@Injectable({providedIn: 'root'})
export class DemoState {
  readonly employees: readonly Employee[] = [
    {id: 'emp-101', name: 'Ada Lovelace', team: 'Platform'},
    {id: 'emp-102', name: 'Grace Hopper', team: 'Platform'},
    {id: 'emp-103', name: 'Alan Turing', team: 'Infrastructure'},
    {id: 'emp-104', name: 'Margaret Hamilton', team: 'Design Systems'},
  ];
  readonly query = signal('');
  readonly selectedId = signal<string | null>(null);
  readonly sortColumn = signal<'name' | 'team'>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly page = signal(0);
  readonly size = signal(2);

  readonly filteredEmployees = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.employees.filter((employee) =>
      (employee.name + ' ' + employee.team).toLowerCase().includes(query),
    );
  });

  readonly sortedEmployees = computed(() => {
    const key = this.sortColumn();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    return [...this.filteredEmployees()].sort(
      (left, right) =>
        direction * left[key].localeCompare(right[key]) || left.id.localeCompare(right.id),
    );
  });

  readonly visibleEmployees = computed(() => {
    const start = this.page() * this.size();
    return this.sortedEmployees().slice(start, start + this.size());
  });

  readonly selectedEmployee = computed(
    () => this.employees.find((employee) => employee.id === this.selectedId()) ?? null,
  );

  setQuery(query: string): void {
    this.query.set(query);
    this.page.set(0);
  }

  setSort({column, direction}: TuiWebMcpSortState): void {
    if (column !== 'name' && column !== 'team') {
      return;
    }

    this.sortColumn.set(column);
    this.sortDirection.set(direction);
    this.page.set(0);
  }

  setPagination({page, size}: TuiWebMcpPaginationState): void {
    this.page.set(page);
    this.size.set(size);
  }
}
