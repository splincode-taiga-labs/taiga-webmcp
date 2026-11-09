import {Component, EnvironmentInjector, inject, runInInjectionContext, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiInputChip, TuiMultiSelect} from '@taiga-ui/kit';

import {DemoState} from './demo-state';
import {MULTI_SELECTION_TOOL, READ_TEAM_OPTIONS_TOOL} from './demo-tools';

@Component({
  selector: 'app-webmcp-multi-select',
  imports: [FormsModule, TuiButton, TuiTextfield, TuiChevron, TuiInputChip, TuiMultiSelect],
  templateUrl: './multi-select.component.html',
})
export class WebMcpMultiSelect {
  private readonly injector = inject(EnvironmentInjector);
  protected readonly state = inject(DemoState);
  protected readonly idsInput = signal('team-platform, team-design');
  protected readonly result = signal('Run a tool to see its response.');

  protected select(): void {
    const ids = this.idsInput()
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const response = runInInjectionContext(this.injector, () =>
      MULTI_SELECTION_TOOL.execute({ids}),
    );
    this.result.set(response.content[0]?.text ?? '');
  }

  protected read(): void {
    const response = runInInjectionContext(this.injector, () => READ_TEAM_OPTIONS_TOOL.execute());
    this.result.set(response.content[0]?.text ?? '');
  }
}
