import type { Status } from '@/core/domain';

import { healthRatio, type Customer, type CustomersOverview } from '../../domain';

export type StatusFilter = 'all' | 'fail' | 'warn' | 'pass';

export type CustomersIntent =
  { type: 'search'; q: string } | { type: 'filter'; status: StatusFilter } | { type: 'retry' };

/** UI-only state (server data lives in TanStack Query). */
export interface CustomersUiState {
  readonly query: string;
  readonly filter: StatusFilter;
}

export const initialCustomersUiState: CustomersUiState = { query: '', filter: 'all' };

export function customersReducer(state: CustomersUiState, intent: CustomersIntent): CustomersUiState {
  switch (intent.type) {
    case 'search':
      return state.query === intent.q ? state : { ...state, query: intent.q };
    case 'filter':
      return state.filter === intent.status ? state : { ...state, filter: intent.status };
    default:
      return state;
  }
}

export interface CustomerRowModel {
  readonly id: string;
  /** Route to the customer detail screen (navigation is plain links). */
  readonly href: string;
  readonly name: string;
  readonly status: Status;
  readonly meta: string;
  readonly ratio: number;
  readonly time: string;
}

export interface FilterTabModel {
  readonly key: StatusFilter;
  readonly label: string;
  readonly count: number;
  readonly status?: Status;
}

export interface CustomersHeaderModel {
  readonly brokers: number;
  readonly updatedAt: string;
  readonly overall: Status;
}

export type CustomersViewState =
  | { readonly status: 'loading'; readonly query: string; readonly filter: StatusFilter }
  | {
      readonly status: 'error';
      readonly query: string;
      readonly filter: StatusFilter;
      readonly message: string;
      readonly retrying: boolean;
    }
  | {
      readonly status: 'empty';
      readonly query: string;
      readonly filter: StatusFilter;
      readonly header: CustomersHeaderModel;
    }
  | {
      readonly status: 'success';
      readonly query: string;
      readonly filter: StatusFilter;
      readonly header: CustomersHeaderModel;
      readonly tabs: readonly FilterTabModel[];
      readonly rows: readonly CustomerRowModel[];
    };

const toRow = (c: Customer): CustomerRowModel => ({
  id: c.id,
  href: `/customers/${c.id}`,
  name: c.name,
  status: c.status,
  meta: `ETL ${c.etl.ok}/${c.etl.total} · API ${c.api.ok}/${c.api.total}`,
  ratio: healthRatio(c),
  time: c.lastCheck,
});

/** Pure projection of server data + UI state into what the view renders. */
export function selectCustomers(data: CustomersOverview, ui: CustomersUiState, debouncedQuery: string) {
  const count = (s: Status) => data.customers.filter((c) => c.status === s).length;
  const q = debouncedQuery.trim().toLowerCase();
  const rows = data.customers
    .filter(
      (c) => (ui.filter === 'all' || c.status === ui.filter) && (!q || c.name.toLowerCase().includes(q)),
    )
    .map(toRow);
  const tabs: FilterTabModel[] = [
    { key: 'all', label: 'All', count: data.customers.length },
    { key: 'fail', label: 'Failed', count: count('fail'), status: 'fail' },
    { key: 'warn', label: 'Warning', count: count('warn'), status: 'warn' },
    { key: 'pass', label: 'Passed', count: count('pass'), status: 'pass' },
  ];
  const header: CustomersHeaderModel = {
    brokers: data.customers.length,
    updatedAt: data.updatedAt,
    overall: data.overall,
  };
  return { header, tabs, rows };
}
