import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderRoute } from '@/test/renderRoute';
import { testContainer } from '@/test/testContainer';

import type { RetestEtlJobs } from '../../domain';

import CustomerDetailView from './CustomerDetailView';

const path = '/customers/:customerId';

describe('CustomerDetailView', () => {
  it('shows a job as running while its retest is pending', async () => {
    let finish!: () => void;
    const execute = vi.fn(() => new Promise<void>((r) => (finish = r)));
    const container = testContainer({
      customerDetail: { retestEtlJobs: { execute } as unknown as RetestEtlJobs },
    });
    renderRoute(<CustomerDetailView />, { path, url: '/customers/cholamandalam', container });

    const etl = await screen.findByRole('region', { name: 'ETL processes' }, { timeout: 3000 });
    expect(within(etl).getByText('07:31 · File not found on exchange SFTP')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Retest Contract master · NSE F&O' }));
    expect(execute).toHaveBeenCalledWith('cholamandalam', ['cm-fo']);
    expect(within(etl).getByText('Retest in progress…')).toBeInTheDocument();
    expect(within(etl).getByText('Running')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retest Contract master · NSE F&O' })).toBeDisabled();

    expect(screen.queryByText('navigated')).not.toBeInTheDocument();

    finish();
    expect(await screen.findByText('Retest passed')).toBeInTheDocument();
  });

  it('opens the ETL job checks when a row is tapped', async () => {
    renderRoute(<CustomerDetailView />, {
      path,
      url: '/customers/cholamandalam',
      container: testContainer(),
    });
    await userEvent.click(
      await screen.findByRole(
        'button',
        { name: 'Contract master · NSE F&O, open checks' },
        { timeout: 3000 },
      ),
    );
    expect(screen.getByText('navigated')).toHaveAttribute(
      'data-pathname',
      '/customers/cholamandalam/etl/cm-fo',
    );
  });

  it('shows not found for an unknown customer', async () => {
    renderRoute(<CustomerDetailView />, { path, url: '/customers/nope', container: testContainer() });
    expect(await screen.findByText('Customer not found', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
  });
});
