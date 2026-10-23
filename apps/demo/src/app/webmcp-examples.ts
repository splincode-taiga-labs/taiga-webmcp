export const SIGNAL_FORM_EXAMPLE = {
  TypeScript: `import {signal} from '@angular/core';
import {email, form, minLength, required, validate} from '@angular/forms/signals';

// In your component:
model = signal({fullName: '', email: '', team: ''});
employeeForm = form(
  this.model,
  (path) => {
    required(path.fullName);
    minLength(path.fullName, 2);
    required(path.email);
    email(path.email);
    required(path.team);
    validate(path.team, ({value}) =>
      ['Platform', 'Infrastructure', 'Design Systems'].includes(value())
        ? null
        : {kind: 'teamNotAllowed', message: 'Choose an allowed team.'},
    );
  },
  {
    experimentalWebMcpTool: {
      name: 'saveDemoEmployeeDraft',
      description: 'Validate and save a local employee draft.',
    },
    submission: {action: (field) => { this.lastSaved.set(field().value()); return Promise.resolve(); }},
  },
);

// In application providers:
provideExperimentalWebMcpForms();`,
  HTML: `<form [formRoot]="employeeForm">
  <tui-textfield>
    <input tuiInput [formField]="employeeForm.fullName" />
  </tui-textfield>
  <tui-textfield>
    <input tuiInput type="email" [formField]="employeeForm.email" />
  </tui-textfield>
  <tui-textfield tuiChevron>
    <input tuiSelect [formField]="employeeForm.team" />
    <tui-data-list-wrapper *tuiDropdown [items]="teams" />
  </tui-textfield>
  <button tuiButton type="submit">Save draft</button>
</form>`,
};

export const TABLE_EXAMPLE = {
  TypeScript: `import {provideExperimentalWebMcpTools, inject} from '@angular/core';
import {tuiWebMcpFilterTool} from '@taiga-ui-labs/webmcp';

provideExperimentalWebMcpTools([
  tuiWebMcpFilterTool({
    name: 'filterEmployees',
    description: 'Filter employees by name',
    setQuery: (query) => inject(EmployeesState).query.set(query),
  }),
]);`,
  HTML: `<tui-textfield>
  <input tuiInput [ngModel]="state.query()"
    (ngModelChange)="state.query.set($event)" />
</tui-textfield>`,
};
