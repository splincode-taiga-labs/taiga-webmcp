import {computed, Injectable, signal} from '@angular/core';

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

  readonly filteredEmployees = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.employees.filter((employee) =>
      (employee.name + ' ' + employee.team).toLowerCase().includes(query),
    );
  });

  readonly selectedEmployee = computed(() =>
    this.employees.find((employee) => employee.id === this.selectedId()) ?? null,
  );
}
