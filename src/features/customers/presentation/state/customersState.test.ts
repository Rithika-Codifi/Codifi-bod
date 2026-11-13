import { timeIST } from '@/core/domain';

import type { CustomersOverview } from '../../domain';

import { customersReducer, initialCustomersUiState, selectCustomers } from './customersState';

const data: CustomersOverview = {
  updatedAt: timeIST('07:42'),
  overall: 'fail',
  customers: [
    {
      id: 'chola',
      code: 'C4',
      name: 'Cholamandalam Securities',
      status: 'fail',
      etl: { ok: 6, total: 8 },
      api: { ok: 31, total: 34 },
      lastCheck: timeIST('07:38'),
    },
    {
      id: 'alice',
      code: 'C3',
      name: 'Alice Blue',
      status: 'warn',
      etl: { ok: 7, total: 8 },
      api: { ok: 38, total: 38 },
      lastCheck: timeIST('07:20'),
    },
    {
      id: 'iifl',
      code: 'C8',
      name: 'IIFL',
      status: 'pass',
      etl: { ok: 8, total: 8 },
      api: { ok: 44, total: 44 },
      lastCheck: timeIST('07:37'),
    },
  ],
};

describe('customersReducer', () => {
  it('updates query and filter immutably', () => {
    const s1 = customersReducer(initialCustomersUiState, { type: 'search', q: 'ali' });
    expect(s1).toEqual({ query: 'ali', filter: 'all' });
    expect(initialCustomersUiState.query).toBe('');
    const s2 = customersReducer(s1, { type: 'filter', status: 'warn' });
    expect(s2).toEqual({ query: 'ali', filter: 'warn' });
  });

  it('returns the same object for no-op and side-effect intents', () => {
    expect(customersReducer(initialCustomersUiState, { type: 'filter', status: 'all' })).toBe(
      initialCustomersUiState,
    );
    expect(customersReducer(initialCustomersUiState, { type: 'retry' })).toBe(initialCustomersUiState);
  });
});

describe('selectCustomers', () => {
  it('builds tabs with counts and header', () => {
    const v = selectCustomers(data, initialCustomersUiState, '');
    expect(v.tabs.map((t) => [t.key, t.count])).toEqual([
      ['all', 3],
      ['fail', 1],
      ['warn', 1],
      ['pass', 1],
    ]);
    expect(v.header).toEqual({ brokers: 3, updatedAt: '07:42', overall: 'fail' });
    expect(v.rows[0]).toMatchObject({ href: '/customers/chola', meta: 'ETL 6/8 · API 31/34', time: '07:38' });
    expect(v.rows[0]?.ratio).toBeCloseTo(37 / 42);
  });

  it('filters by status and debounced query (case-insensitive)', () => {
    expect(selectCustomers(data, { query: '', filter: 'pass' }, '').rows.map((r) => r.id)).toEqual(['iifl']);
    expect(selectCustomers(data, { query: 'ALICE', filter: 'all' }, 'ALICE').rows.map((r) => r.id)).toEqual([
      'alice',
    ]);
    expect(selectCustomers(data, { query: 'zzz', filter: 'all' }, 'zzz').rows).toEqual([]);
  });
});
