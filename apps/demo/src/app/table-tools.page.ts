import {Component} from '@angular/core';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {TABLE_EXAMPLE} from './webmcp-examples';
import {WebMcpPlayground} from './playground.component';

@Component({
  imports: [TuiAddonDoc, WebMcpPlayground],
  template: `
    <tui-doc-page header="Table tools" package="@taiga-ui-labs/webmcp">
      <ng-template pageTab>
        <p>
          Filter, sort, paginate, select and read a Taiga UI table through semantic WebMCP tools.
          The UI and agent share the same Angular signals.
        </p>
        <tui-doc-example id="table-tools" heading="Interactive employee table" [content]="example">
          <app-webmcp-playground />
        </tui-doc-example>
      </ng-template>
    </tui-doc-page>
  `,
})
export class TableToolsPage {
  protected readonly example = TABLE_EXAMPLE;
}
