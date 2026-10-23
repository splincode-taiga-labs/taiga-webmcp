# Taiga WebMCP

Experimental **@taiga-ui-labs/webmcp** helpers for applications built with Angular 22 and Taiga UI. This is a community project under [splincode-taiga-labs](https://github.com/splincode-taiga-labs), not an official Taiga UI release.

## Why

Expose **semantic operations** to browser AI agents, not low-level UI interactions. The application owns its state, authorization rules, and tool names. This addon provides small, opt-in helpers. Angular itself registers WebMCP tools and controls their lifetime.

## Development

Requires Node.js 24.15.0+ (or a compatible Angular 22 Node version).

```bash
npm install
npm run format:check
npm run lint
npm test
npm run build:lib
npm run build:demo
npx playwright install chromium
npm run test:e2e
npm start
```

Open http://localhost:4200/#/webmcp to see the **@taiga-ui/addon-doc** demo. Use the sidebar to open independent **Table tools** (`#/table-tools`) and **Signal Forms** (`#/signal-forms`) examples. The WebMCP page tabs have navigable deep links (`#/webmcp/API`, `#/webmcp/Setup`), including browser history support. The playground simulates direct tool invocations, so you can try it without an AI agent. With native WebMCP support (or a polyfill), browser agents can discover the same registered tools.

`npm run build:demo` builds the documentation site for static hosting. The demo copies SVG icons from the `@taiga-ui/icons` package into `assets/taiga-ui/icons` and ships its own local logo; both work when hosted under the GitHub Pages repository subpath without relying on an external CDN.

## Formatting

This repository uses Prettier 3.9.10 for TypeScript, Angular templates, JSON, CSS, Markdown, and GitHub Actions YAML. Run `npm run format` to format supported files and `npm run format:check` to verify them. CI enforces the formatting check. ESLint applies Angular rules and type-aware TypeScript rules with TypeScript's project service, independently of Prettier. Run `npm run lint` to check code and `npm run lint:fix` for safe automatic fixes. Type-aware rules check promise handling and unsafe uses of types without adding another compilation step.

## API

- `tuiWebMcpFilterTool({name, description, setQuery, maxLength?})`: validates a string and updates a controlled filter.
- `tuiWebMcpSelectionTool({name, description, options, select})`: checks the selected stable ID against the latest allowed options.
- `tuiWebMcpReadTool({name, description, read})`: serializes an explicit, read-only snapshot.
- `tuiWebMcpSortTool({name, description, columns, setSort})`: sorts using approved column names and `asc`/`desc` directions.
- `tuiWebMcpPaginationTool({name, description, pageSizes, getTotal, setPagination})`: validates zero-based page indices and allowed sizes against the current item count.
- `tuiWebMcpTextResult(text, isError?)`: creates a text tool response.

Example:

```ts
import {inject, provideExperimentalWebMcpTools} from '@angular/core';
import {tuiWebMcpFilterTool} from '@taiga-ui-labs/webmcp';

export const providers = [
  provideExperimentalWebMcpTools([
    tuiWebMcpFilterTool({
      name: 'filterEmployees',
      description: 'Filter the employee list by name.',
      setQuery: (query) => inject(EmployeesState).query.set(query),
    }),
  ]),
];
```

The corresponding Taiga UI input binds to the same state. In real applications, locate tools at app/route injector scope. For route-level tools enable `withAutoCleanupInjectors()`.

## Signal Forms integration

The demo includes a separate **Signal Forms + Taiga UI** example using `tuiInput`, `tuiSelect`, `FormField`, and `FormRoot`. Angular's experimental WebMCP integration generates `saveDemoEmployeeDraft` automatically from the form fields, validates inputs (including an allowed team list), and invokes the same submission action as the UI. No extra library helper is necessary. The demonstration saves only an in-memory draft, never contacts a server, and should not be confused with a production authorization boundary.

```ts
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';

// In application providers:
provideExperimentalWebMcpForms();
```

Add `experimentalWebMcpTool` and a `submission.action` to a Signal Form. Only one instance of the opted-in form should be mounted at a time, and real write operations require server-side authorization and, when consequential, actual human confirmation.

## Taiga UI table integration

The interactive `@taiga-ui/addon-doc` playground uses actual `TuiTable` and `TuiTablePagination` from `@taiga-ui/addon-table`. Search, sorting, selection and pagination act on the **same Angular signals**, whether invoked from the UI or an AI agent. Names and page sizes are explicitly allowlisted, and pagination is bounded by the live filtered count.

For forms, Angular Signal Forms can already expose forms directly with `provideExperimentalWebMcpForms()` and `experimentalWebMcpTool` on `form()`. Use that built-in integration rather than creating a separate tool for each input.

## Safety and compatibility

- The WebMCP browser specification and Angular WebMCP APIs are **experimental**.
- Runtime argument validation is essential even when an input schema is declared.
- Tools are not an authorization mechanism. Apply server-side access control.
- Never expose sensitive component state or data automatically.
- For consequential operations use an explicit user-confirmation flow.
- Angular Signal Forms already support implicit WebMCP tools; use the native Angular integration rather than duplicating form serialization.
- Publishing to the `@taiga-ui-labs` npm scope requires the corresponding npm organization permissions; the package is **not published** yet.

## References

- [Angular WebMCP](https://angular.dev/ai/webmcp)
- [Taiga UI addon-doc](https://github.com/taiga-family/taiga-ui/tree/main/projects/addon-doc)

Licensed under Apache-2.0.

## Browser WebMCP integration tests

Playwright 1.64+ runs Chromium with the experimental `--enable-features=WebMCP` flag. Alongside documentation smoke checks, the E2E suite discovers application-registered tools through `page.webmcp.tools()` and calls them through `page.webmcp.callTool()`. The tests assert that filter, sort, pagination and selection update the real Taiga UI and that Signal Forms tools are removed when the form is unmounted.

This tests the **browser's WebMCP API** and Angular's registration lifecycle, not just direct execution of descriptor callbacks. The browser API remains experimental and may require updates as specifications evolve. Do not enable the experimental feature by default in production clients.

## Browser smoke tests

`npm run test:e2e` runs Chromium against the **production build** in `dist/demo/browser`. Playwright starts a local static server at `127.0.0.1:4173`. The tests check deep-linkable API/Setup tabs, browser history, sidebar examples, logo/icon loading, tool output overflow, and mobile layout. CI installs Chromium and retains Playwright artifacts when failures occur.

Run `npm run build:demo` before `npm run test:e2e`; these tests are not included in the unit-test command `npm test`.
