import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderRoute } from '@/test/renderRoute';
import { testContainer } from '@/test/testContainer';

import ModuleChecksView from './ModuleChecksView';

const rows = () =>
  within(screen.getByRole('region', { name: 'API checks' })).getAllByRole('button', { name: /^Retest / });

describe('ModuleChecksView', () => {
  it('filters checks and loads every passed check on demand', async () => {
    renderRoute(<ModuleChecksView />, {
      path: '/customers/:customerId/modules/:moduleId',
      url: '/customers/cholamandalam/modules/open-api',
      container: testContainer(),
    });
    expect(
      await screen.findByText('Last check 07:38:12 · avg 182 ms', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(rows()).toHaveLength(13);
    expect(
      screen.getByText(
        'Expected 200, got 502 Bad Gateway. Upstream OMS gateway did not respond within 30 s.',
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Failed · 2' }));
    expect(rows()).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /more passed checks/ })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'All · 34' }));
    await userEvent.click(screen.getByRole('button', { name: 'Show 21 more passed checks' }));
    await vi.waitFor(() => expect(rows()).toHaveLength(34), { timeout: 3000 });
  });

  it('shows the Open API checks screen when opened from an ETL row', async () => {
    renderRoute(<ModuleChecksView />, {
      path: '/customers/:customerId/etl/:etlId',
      url: '/customers/cholamandalam/etl/cm-fo',
      container: testContainer(),
    });
    expect(
      await screen.findByRole('heading', { name: /Open API\s+checks/ }, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cholamandalam Sec.' })).toHaveAttribute(
      'href',
      '/customers/cholamandalam',
    );
    expect(screen.getByText('Module')).toBeInTheDocument();
    expect(screen.getByText('Last check 07:38:12 · avg 182 ms')).toBeInTheDocument();
    expect(rows()).toHaveLength(13);
    expect(screen.getByRole('button', { name: 'Show 21 more passed checks' })).toBeInTheDocument();
  });
});
