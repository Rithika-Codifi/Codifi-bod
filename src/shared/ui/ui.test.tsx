import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';
import { FilterChips } from './FilterChips';
import { FilterTabs } from './FilterTabs';
import { SegmentedBar } from './SegmentedBar';
import { StatusBadge } from './StatusBadge';
import { toast, useToastStore } from './toastStore';

describe('StatusBadge', () => {
  it('renders the status label with status tokens', () => {
    render(<StatusBadge status="fail" />);
    const badge = screen.getByText('Failed');
    expect(badge).toHaveClass('border-fail', 'bg-fail-tint', 'text-fail-ink');
  });
});

describe('SegmentedBar', () => {
  it('always orders failed, warning, passed', () => {
    render(
      <SegmentedBar
        segments={[
          { status: 'pass', n: 31 },
          { status: 'warn', n: 1 },
          { status: 'fail', n: 2 },
        ]}
      />,
    );
    expect(screen.getByRole('img').textContent).toBe('2131');
  });

  it('hides zero segments and shows counts', () => {
    render(
      <SegmentedBar
        segments={[
          { status: 'pass', n: 14 },
          { status: 'warn', n: 3 },
          { status: 'fail', n: 0 },
        ]}
      />,
    );
    const bar = screen.getByRole('img', { name: '3 warning, 14 passed' });
    expect(bar.children).toHaveLength(2);
  });
});

describe('FilterTabs', () => {
  it('marks the active tab and reports changes', async () => {
    const onChange = vi.fn();
    render(
      <FilterTabs
        label="Filter by status"
        value="all"
        onChange={onChange}
        tabs={[
          { key: 'all', label: 'All', count: 17 },
          { key: 'fail', label: 'Failed', count: 2, status: 'fail' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: /All/ })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: /Failed/ }));
    expect(onChange).toHaveBeenCalledWith('fail');
  });
});

describe('FilterChips', () => {
  it('renders "LABEL · N" chips', () => {
    render(
      <FilterChips
        label="Filter checks"
        value="all"
        onChange={() => {}}
        chips={[{ key: 'all', label: 'All', count: 34 }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'All · 34' })).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('is disabled and busy while loading', () => {
    render(<Button loading>Retest failed</Button>);
    const btn = screen.getByRole('button', { name: /Retest failed/ });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});

describe('toast', () => {
  it('shows and auto-dismisses', () => {
    vi.useFakeTimers();
    toast.show('Retest queued', { durationMs: 1000 });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(useToastStore.getState().toasts).toHaveLength(0);
    vi.useRealTimers();
  });
});
