export interface TuiWebMcpResult {
  readonly content: ReadonlyArray<{readonly type: 'text'; readonly text: string}>;
  readonly isError?: boolean;
}

export interface TuiWebMcpFilterOptions {
  /** Unique within the current page. */
  readonly name: string;
  readonly description: string;
  /** Update the same state that drives your Taiga UI input/table. */
  readonly setQuery: (query: string) => void;
  readonly maxLength?: number;
}

export interface TuiWebMcpSelectionOption {
  readonly id: string;
  readonly label: string;
}

export interface TuiWebMcpSelectionOptions {
  /** Unique within the current page. */
  readonly name: string;
  readonly description: string;
  /** Read allowed values when the tool executes, not at registration time. */
  readonly options: () => readonly TuiWebMcpSelectionOption[];
  readonly select: (id: string) => void;
}

export interface TuiWebMcpReadOptions {
  readonly name: string;
  readonly description: string;
  /** Only expose data the current user is authorized to access. */
  readonly read: () => unknown;
}

export type TuiWebMcpSortDirection = 'asc' | 'desc';

export interface TuiWebMcpSortState {
  readonly column: string;
  readonly direction: TuiWebMcpSortDirection;
}

export interface TuiWebMcpSortOptions {
  readonly name: string;
  readonly description: string;
  /** Only explicitly approved columns may be exposed to agents. */
  readonly columns: readonly string[];
  readonly setSort: (sort: TuiWebMcpSortState) => void;
}

export interface TuiWebMcpPaginationState {
  /** Zero-based page index, matching Taiga UI TablePagination. */
  readonly page: number;
  readonly size: number;
}

export interface TuiWebMcpPaginationOptions {
  readonly name: string;
  readonly description: string;
  readonly pageSizes: readonly number[];
  /** Read the filtered total on each invocation, never reuse stale bounds. */
  readonly getTotal: () => number;
  readonly setPagination: (pagination: TuiWebMcpPaginationState) => void;
}
