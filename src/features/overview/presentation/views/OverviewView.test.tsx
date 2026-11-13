import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderRoute } from '@/test/renderRoute';
import { testContainer } from '@/test/testContainer';

import type { RetestAllFailed } from '../../domain';

import OverviewView from './OverviewView';

describe('OverviewView', () => {
  it('renders the snapshot and retests all failed with feedback', async () => {
    let finish!: (v: { queued: number }) => void;
    const execute = vi.fn(() => new Promise<{ queued: number }>((r) => (finish = r)));
    const container = testContainer({
      overview: { retestAllFailed: { execute } as unknown as RetestAllFailed },
    });
    renderRoute(<OverviewView />, { path: '/', url: '/', container });

    expect(await screen.findByText('Action needed', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText('48m left')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cholamandalam Securities/ })).toHaveAttribute(
      'href',
      '/customers/cholamandalam',
    );

    await userEvent.click(screen.getByRole('button', { name: /Retest all failed/ }));
    expect(screen.getByRole('button', { name: /Retesting/ })).toBeDisabled();
    finish({ queued: 9 });
    expect(await screen.findByText('Retest started for 9 failed checks')).toBeInTheDocument();
  });
});
