import {Component} from '@angular/core';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {WebMcpMultiSelect} from './multi-select.component';
import {MULTI_SELECT_EXAMPLE} from './webmcp-examples';

@Component({
  imports: [TuiAddonDoc, WebMcpMultiSelect],
  template: `
    <tui-doc-page header="MultiSelect" package="@taiga-ui-labs/webmcp">
      <ng-template pageTab>
        <p>
          Select several allowed values by their stable IDs. The same state drives a native Taiga UI
          MultiSelect and WebMCP tools.
        </p>
        <tui-doc-example id="multi-select" heading="Teams · Multiple selection" [content]="example">
          <app-webmcp-multi-select />
        </tui-doc-example>
      </ng-template>
    </tui-doc-page>
  `,
})
export class MultiSelectPage {
  protected readonly example = MULTI_SELECT_EXAMPLE;
}
