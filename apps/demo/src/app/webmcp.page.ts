import {Component} from '@angular/core';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {WebMcpPlayground} from './playground.component';

@Component({
  imports: [TuiAddonDoc, WebMcpPlayground],
  template: `
    <tui-doc-page
      header="WebMCP"
      package="@taiga-ui-labs/webmcp"
    >
      <ng-template pageTab>
        <p>
          Semantic tools for AI agents using Taiga UI applications.
          Update Angular state rather than clicking DOM nodes.
        </p>
        <p>
          <strong>Experimental:</strong> Angular 22 WebMCP is not a stable browser standard.
          Register tools once in app/route providers and validate all inputs.
        </p>
        <tui-doc-example
          id="employees"
          heading="Employees · Search and selection"
          [content]="example"
        >
          <app-webmcp-playground />
        </tui-doc-example>
      </ng-template>
      <ng-template pageTab="API">
        <h2>Tool helpers</h2>
        <p><code>tuiWebMcpFilterTool</code> updates a controlled search string.</p>
        <p><code>tuiWebMcpSelectionTool</code> selects a permitted stable ID.</p>
        <p><code>tuiWebMcpReadTool</code> exposes explicit read-only application data.</p>
        <p>Each helper returns a descriptor for Angular's
          <code>provideExperimentalWebMcpTools</code>. Nothing is registered automatically.
        </p>
      </ng-template>
      <ng-template pageTab="Setup">
        <h2>Browser and security</h2>
        <p>
          This playground can be used manually in any supported Angular browser.
          Real AI agent access requires browser WebMCP support or a compatible polyfill.
        </p>
        <p>
          Tools are discoverable, not permission checks. Authorize access to data,
          validate all arguments, and require explicit user confirmation for mutations.
        </p>
        <p>
          See <a href="https://angular.dev/ai/webmcp" target="_blank" rel="noopener noreferrer">Angular WebMCP documentation</a>.
        </p>
      </ng-template>
    </tui-doc-page>
  `,
})
export class WebMcpPage {
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
