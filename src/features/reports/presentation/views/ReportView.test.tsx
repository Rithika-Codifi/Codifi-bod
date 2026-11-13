import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderRoute } from '@/test/renderRoute';
import { testContainer } from '@/test/testContainer';

import ReportView from './ReportView';

describe('ReportView', () => {
  it('renders run #4812 and copies the link when Web Share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderRoute(<ReportView />, {
      path: '/reports/:runId',
      url: '/reports/4812',
      container: testContainer(),
    });

    expect(await screen.findByText('34 checks · 91.2% pass', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText('Run #4812')).toBeInTheDocument();
    expect(screen.getByText('Showing 10 of 34')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(11);

    await userEvent.click(screen.getByRole('button', { name: /Share/ }));
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByText('Link copied')).toBeInTheDocument();
  });

  it('prints for PDF', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderRoute(<ReportView />, {
      path: '/reports/:runId',
      url: '/reports/latest',
      container: testContainer(),
    });
    await userEvent.click(await screen.findByRole('button', { name: /PDF/ }, { timeout: 3000 }));
    expect(print).toHaveBeenCalled();
  });
});
