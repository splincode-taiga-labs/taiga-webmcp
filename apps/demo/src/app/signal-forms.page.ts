import {Component} from '@angular/core';
import {TuiAddonDoc} from '@taiga-ui/addon-doc';

import {WebMcpSignalForm} from './signal-form.component';
import {SIGNAL_FORM_EXAMPLE} from './webmcp-examples';

@Component({
  imports: [TuiAddonDoc, WebMcpSignalForm],
  template: `
    <tui-doc-page header="Signal Forms" package="@taiga-ui-labs/webmcp">
      <ng-template pageTab>
        <p>
          Angular creates a native WebMCP tool from this Taiga UI Signal Form. Submissions validate
          the form and save a local draft, without a backend.
        </p>
        <tui-doc-example id="signal-forms" heading="Validated employee draft" [content]="example">
          <app-webmcp-signal-form />
        </tui-doc-example>
      </ng-template>
    </tui-doc-page>
  `,
})
export class SignalFormsPage {
  protected readonly example = SIGNAL_FORM_EXAMPLE;
}
