import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter, startWith} from 'rxjs';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {WebMcpPlayground} from './playground.component';
import {WebMcpSignalForm} from './signal-form.component';
import {webMcpTabIndex} from './docs-navigation';
import {SIGNAL_FORM_EXAMPLE, TABLE_EXAMPLE} from './webmcp-examples';

@Component({
  imports: [RouterOutlet, TuiAddonDoc, WebMcpPlayground, WebMcpSignalForm],
  template: `
    <tui-doc-page
      header="WebMCP"
      package="@taiga-ui-labs/webmcp"
      [(activeItemIndex)]="activeTab"
    >
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
    <router-outlet />
  `,
})
export class WebMcpPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly activeTab = signal(0);
  protected readonly example = TABLE_EXAMPLE;
  protected readonly formExample = SIGNAL_FORM_EXAMPLE;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.activeTab.set(webMcpTabIndex(this.route.firstChild?.snapshot.routeConfig?.path));
      });
  }
}
