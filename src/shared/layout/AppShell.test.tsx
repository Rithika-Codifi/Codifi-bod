import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { AppShell } from './AppShell';

const renderShell = (url: string, showBottomNav = true) => {
  const router = createMemoryRouter(
    [
      {
        element: <AppShell theme="light" onThemeChange={() => {}} />,
        children: [{ path: '*', element: <h1>screen</h1>, handle: { showBottomNav } }],
      },
    ],
    { initialEntries: [url] },
  );
  return render(<RouterProvider router={router} />);
};

describe('AppShell', () => {
  it('marks the active section in both navs', () => {
    renderShell('/customers/cholamandalam');
    for (const link of screen.getAllByRole('link', { name: 'Customers' }))
      expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('has no Reports tab (disabled for now)', () => {
    renderShell('/');
    expect(screen.queryByRole('link', { name: 'Reports' })).not.toBeInTheDocument();
  });

  it('hides the bottom nav unless the route opts in', () => {
    renderShell('/reports/4812', false);
    expect(screen.getAllByRole('navigation', { name: 'Primary' })).toHaveLength(1);
  });

  it('shows the offline banner while offline', () => {
    renderShell('/');
    expect(screen.queryByText(/Offline/)).not.toBeInTheDocument();
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    act(() => void window.dispatchEvent(new Event('offline')));
    expect(screen.getByText('Offline · showing last synced data')).toBeInTheDocument();
    onLine.mockRestore();
  });
});
