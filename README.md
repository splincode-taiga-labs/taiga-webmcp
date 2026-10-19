# Taiga WebMCP

Experimental **@taiga-ui-labs/webmcp** helpers for applications built with Angular 22 and Taiga UI. This is a community project under [splincode-taiga-labs](https://github.com/splincode-taiga-labs), not an official Taiga UI release.

## Why

Expose **semantic operations** to browser AI agents, not low-level UI interactions. The application owns its state, authorization rules, and tool names. This addon provides small, opt-in helpers. Angular itself registers WebMCP tools and controls their lifetime.

## Development

Requires Node.js 24.15.0+ (or a compatible Angular 22 Node version).

```bash
npm install
npm run format:check
npm test
npm run build:lib
npm start
```

Open http://localhost:4200/#/webmcp to see the **@taiga-ui/addon-doc** demo. The playground simulates direct tool invocations, so you can try it without an AI agent. With native WebMCP support (or a polyfill), browser agents can discover the same registered tools.

`npm run build:demo` builds the documentation site for static hosting.

## Formatting

This repository uses Prettier 3.9.10 for TypeScript, Angular templates, JSON, CSS, Markdown, and GitHub Actions YAML. Run `npm run format` to format supported files and `npm run format:check` to verify them. CI enforces the formatting check.

## API

- `tuiWebMcpFilterTool({name, description, setQuery, maxLength?})`: validates a string and updates a controlled filter.
- `tuiWebMcpSelectionTool({name, description, options, select})`: checks the selected stable ID against the latest allowed options.
- `tuiWebMcpReadTool({name, description, read})`: serializes an explicit, read-only snapshot.
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
