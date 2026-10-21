import {describe, expect, it} from 'vitest';

import {DOC_PAGES, WEBMCP_TAB_PATHS, webMcpTabIndex} from './docs-navigation';

describe('WebMCP documentation navigation', () => {
  it('keeps links unique and includes independent examples', () => {
    const routes = DOC_PAGES.map((page) => page.route);
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes).toEqual(['/webmcp', '/table-tools', '/signal-forms']);
  });

  it('supports direct links and browser history for API and Setup', () => {
    expect(WEBMCP_TAB_PATHS).toEqual(['', 'API', 'Setup']);
    expect(webMcpTabIndex(undefined)).toBe(0);
    expect(webMcpTabIndex('API')).toBe(1);
    expect(webMcpTabIndex('Setup')).toBe(2);
    expect(webMcpTabIndex('unknown')).toBe(0);
    expect(webMcpTabIndex('')).toBe(0);
  });
});
