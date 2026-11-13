import { render, screen } from '@testing-library/react';

import { App } from '@/app/App';

describe('App', () => {
  it('renders the shell with primary navigation on the overview route', async () => {
    render(<App />);
    const nav = await screen.findAllByRole('navigation', { name: 'Primary' });
    expect(nav.length).toBeGreaterThan(0);
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Overview' })[0]).toHaveAttribute('aria-current', 'page');
  });
});
