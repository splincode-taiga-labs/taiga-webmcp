import {Component, inject, EnvironmentInjector, runInInjectionContext, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiInput} from '@taiga-ui/core';

import {DemoState} from './demo-state';
import {FILTER_TOOL, READ_TOOL, SELECT_TOOL} from './demo-tools';

@Component({
  selector: 'app-webmcp-playground',
  imports: [FormsModule, TuiButton, TuiInput],
  templateUrl: './playground.component.html',
})
export class WebMcpPlayground {
  private readonly injector = inject(EnvironmentInjector);
  protected readonly state = inject(DemoState);
  protected readonly filterInput = signal('Ada');
  protected readonly selectionInput = signal('emp-101');
  protected readonly result = signal('Run a tool to see its response.');

  protected filter(): void {
    const response = runInInjectionContext(this.injector, () =>
      FILTER_TOOL.execute({query: this.filterInput()}),
    );
    this.result.set(response.content[0]?.text ?? '');
  }

  protected select(): void {
    const response = runInInjectionContext(this.injector, () =>
      SELECT_TOOL.execute({id: this.selectionInput()}),
    );
    this.result.set(response.content[0]?.text ?? '');
  }

  protected read(): void {
    const response = runInInjectionContext(this.injector, () => READ_TOOL.execute());
    this.result.set(response.content[0]?.text ?? '');
  }
}
