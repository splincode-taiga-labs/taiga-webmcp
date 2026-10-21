import {type ApplicationConfig, provideExperimentalWebMcpTools} from '@angular/core';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {
  provideRouter,
  withAutoCleanupInjectors,
  withHashLocation,
  type Routes,
} from '@angular/router';
import {
  TUI_DOC_DEFAULT_TABS,
  TUI_DOC_LOGO,
  TUI_DOC_PAGES,
  TUI_DOC_TITLE,
} from '@taiga-ui/addon-doc';
import {provideTaiga} from '@taiga-ui/core';
import {provideHighlightOptions} from 'ngx-highlightjs';

import {FILTER_TOOL, PAGINATION_TOOL, READ_TOOL, SELECT_TOOL, SORT_TOOL} from './demo-tools';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'webmcp'},
  {
    path: 'webmcp',
    data: {title: 'WebMCP'},
    loadComponent: () => import('./webmcp.page').then((m) => m.WebMcpPage),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation(), withAutoCleanupInjectors()),
    provideTaiga(),
    provideExperimentalWebMcpForms(),
    // Keep descriptors in separate providers for precise JSON Schema inference.
    provideExperimentalWebMcpTools([FILTER_TOOL]),
    provideExperimentalWebMcpTools([SELECT_TOOL]),
    provideExperimentalWebMcpTools([READ_TOOL]),
    provideExperimentalWebMcpTools([SORT_TOOL]),
    provideExperimentalWebMcpTools([PAGINATION_TOOL]),
    {
      provide: TUI_DOC_PAGES,
      useValue: [{title: 'WebMCP', section: 'Examples', route: '/webmcp'}],
    },
    {provide: TUI_DOC_TITLE, useValue: 'Taiga WebMCP · '},
    {provide: TUI_DOC_LOGO, useValue: 'assets/webmcp-logo.svg'},
    {provide: TUI_DOC_DEFAULT_TABS, useValue: ['Examples', 'API', 'Setup']},
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        html: () => import('highlight.js/lib/languages/xml'),
      },
    }),
  ],
};
