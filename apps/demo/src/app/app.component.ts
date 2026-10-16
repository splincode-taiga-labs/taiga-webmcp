import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TuiDocMain} from '@taiga-ui/addon-doc';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiDocMain],
  template: '<tui-doc-main><router-outlet /></tui-doc-main>',
})
export class AppComponent {}
