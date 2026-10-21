import {Component} from '@angular/core';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {WebMcpPlayground} from './playground.component';
import {WebMcpSignalForm} from './signal-form.component';

@Component({
  imports: [TuiAddonDoc, WebMcpPlayground, WebMcpSignalForm],
  template: `
    <tui-doc-page header="WebMCP" package="@taiga-ui-labs/webmcp">
      <ng-template pageTab>
        <p>
          Semantic tools for AI agents using Taiga UI applications. Update Angular state rather than
          clicking DOM nodes.
        </p>
        <p>
          <strong>Experimental:</strong> Angular 22 WebMCP is not a stable browser standard.
          Register tools once in app/route providers and validate all inputs.
        </p>
        <tui-doc-example
          id="employees"
          heading="Employees · Search, sorting, pagination and selection"
          [content]="example"
        >
          <app-webmcp-playground />
        </tui-doc-example>
        <tui-doc-example
          id="signal-form"
          heading="Signal Forms · Native WebMCP submission"
          [content]="formExample"
        >
          <app-webmcp-signal-form />
        </tui-doc-example>
      </ng-template>
      <ng-template pageTab="API">
        <h2>Tool helpers</h2>
        <p><code>tuiWebMcpFilterTool</code> updates a controlled search string.</p>
        <p><code>tuiWebMcpSelectionTool</code> selects a permitted stable ID.</p>
        <p><code>tuiWebMcpReadTool</code> exposes explicit read-only application data.</p>
        <p><code>tuiWebMcpSortTool</code> sorts only approved columns.</p>
        <p><code>tuiWebMcpPaginationTool</code> validates page bounds and sizes.</p>
        <p>
          <code>provideExperimentalWebMcpForms</code> and <code>experimentalWebMcpTool</code> are
          native Angular APIs. Use them to expose validated Signal Forms rather than wrapping every
          input.
        </p>
        <p>
          Each helper returns a descriptor for Angular's
          <code>provideExperimentalWebMcpTools</code>. Nothing is registered automatically.
        </p>
      </ng-template>
      <ng-template pageTab="Setup">
        <h2>Browser and security</h2>
        <p>
          This playground uses TuiTable, TuiTablePagination, TuiInput and TuiSelect. It can be used
          manually in any supported Angular browser. Real AI agent access requires browser WebMCP
          support or a compatible polyfill.
        </p>
        <p>
          The Signal Forms example stores drafts in memory only; a real application must authorize
          and validate mutations on the server.
        </p>
        <p>
          Tools are discoverable, not permission checks. Authorize access to data, validate all
          arguments, and require explicit user confirmation for mutations.
        </p>
        <p>
          See
          <a href="https://angular.dev/ai/webmcp" target="_blank" rel="noopener noreferrer"
            >Angular WebMCP documentation</a
          >.
        </p>
      </ng-template>
    </tui-doc-page>
  `,
})
export class WebMcpPage {
  protected readonly formExample = {
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

  protected readonly example = {
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
}
