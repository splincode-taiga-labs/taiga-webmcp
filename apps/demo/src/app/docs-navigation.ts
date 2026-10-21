/** Navigation labels and routes share one source of truth with addon-doc. */
export const DOC_PAGES = [
  {title: 'WebMCP', section: 'Examples', route: '/webmcp'},
  {title: 'Table tools', section: 'Examples', route: '/table-tools'},
  {title: 'Signal Forms', section: 'Examples', route: '/signal-forms'},
] as const;

/** The addon-doc component generates case-sensitive tab links from pageTab labels. */
export const WEBMCP_TAB_PATHS = ['', 'API', 'Setup'] as const;

export function webMcpTabIndex(path: string | undefined): number {
  const index = WEBMCP_TAB_PATHS.findIndex((tab) => tab === (path ?? ''));

  return index === -1 ? 0 : index;
}
