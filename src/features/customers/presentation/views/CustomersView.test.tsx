import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AppProviders } from '@/app/providers';
import { timeIST } from '@/core/domain';
import { testContainer } from '@/test/testContainer';

import type { CustomersOverview, GetCustomers } from '../../domain';

import CustomersView from './CustomersView';

const data: CustomersOverview = {
  updatedAt: timeIST('07:42'),
  overall: 'fail',
  customers: [
    {
      id: 'cholamandalam',
      code: 'CUST-004',
      name: 'Cholamandalam Securities',
      status: 'fail',
      etl: { ok: 6, total: 8 },
      api: { ok: 31, total: 34 },
      lastCheck: timeIST('07:38'),
    },
    {
      id: 'alice-blue',
      code: 'CUST-003',
      name: 'Alice Blue',
      status: 'warn',
      etl: { ok: 7, total: 8 },
      api: { ok: 38, total: 38 },
      lastCheck: timeIST('07:20'),
    },
    {
      id: 'iifl',
      code: 'CUST-008',
      name: 'IIFL',
      status: 'pass',
      etl: { ok: 8, total: 8 },
      api: { ok: 44, total: 44 },
      lastCheck: timeIST('07:37'),
    },
  ],
};

function renderView(execute: () => Promise<CustomersOverview>) {
  const container = testContainer({ customers: { getCustomers: { execute } as unknown as GetCustomers } });
  return render(
    <AppProviders container={container}>
      <MemoryRouter>
        <CustomersView />
      </MemoryRouter>
    </AppProviders>,
  );
}

const rows = () => within(screen.getByRole('region', { name: 'Customer list' })).queryAllByRole('link');

describe('CustomersView', () => {
  it('renders header, tabs and rows sorted as provided', async () => {
    renderView(() => Promise.resolve(data));
    expect(await screen.findByText('3 brokers · updated 07:42')).toBeInTheDocument();
    expect(rows().map((r) => r.getAttribute('href'))).toEqual([
      '/customers/cholamandalam',
      '/customers/alice-blue',
      '/customers/iifl',
    ]);
    expect(screen.getByText('ETL 6/8 · API 31/34')).toBeInTheDocument();
  });

  it('filters by status tab and by debounced search, with an empty state', async () => {
    renderView(() => Promise.resolve(data));
    await screen.findByText('IIFL');

    await userEvent.click(screen.getByRole('button', { name: /Warning/ }));
    expect(rows()).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: /All/ }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'zzz');
    expect(await screen.findByText('No customers match this filter.')).toBeInTheDocument();
  });

  it('shows an error with retry', async () => {
    const execute = vi
      .fn<() => Promise<CustomersOverview>>()
      .mockRejectedValueOnce({ kind: 'network', message: 'Network unavailable.' })
      .mockRejectedValueOnce({ kind: 'network', message: 'Network unavailable.' })
      .mockResolvedValue(data);
    renderView(execute);
    expect(await screen.findByText('Network unavailable.', {}, { timeout: 4000 })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Retry/ }));
    await waitFor(() => expect(screen.getByText('IIFL')).toBeInTheDocument());
  });
});
