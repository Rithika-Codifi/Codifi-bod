import { Card, EmptyState, ErrorState, FilterTabs, SearchInput, SkeletonList } from '@/shared/ui';

import { CustomerRow } from '../components/CustomerRow';
import { CustomersHeader } from '../components/CustomersHeader';
import { useCustomersViewModel } from '../viewmodels/useCustomersViewModel';

const PLACEHOLDER_TABS = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'fail', label: 'Failed', count: 0, status: 'fail' },
  { key: 'warn', label: 'Warning', count: 0, status: 'warn' },
  { key: 'pass', label: 'Passed', count: 0, status: 'pass' },
] as const;

export default function CustomersView() {
  const { state, onIntent } = useCustomersViewModel();
  const header = state.status === 'success' || state.status === 'empty' ? state.header : undefined;

  return (
    <>
      <CustomersHeader brokers={header?.brokers} updatedAt={header?.updatedAt} overall={header?.overall} />

      <div className="flex flex-col gap-[12px] px-[16px] pt-[14px] pb-[6px]">
        <SearchInput
          value={state.query}
          onChange={(q) => onIntent({ type: 'search', q })}
          placeholder="Search customer"
          label="Search customers"
        />
        <FilterTabs
          label="Filter by status"
          value={state.filter}
          onChange={(status) => onIntent({ type: 'filter', status })}
          tabs={state.status === 'success' ? [...state.tabs] : [...PLACEHOLDER_TABS]}
        />
        <div className="flex justify-between font-mono text-[11px] tracking-[0.08em] text-subtle uppercase">
          <span>Sorted by severity</span>
          <span>Last check</span>
        </div>
      </div>

      {state.status === 'loading' && <SkeletonList rows={8} className="mx-[16px] mb-[24px]" />}

      {state.status === 'error' && (
        <ErrorState
          className="mx-[16px] mb-[24px]"
          message={state.message}
          retrying={state.retrying}
          onRetry={() => onIntent({ type: 'retry' })}
        />
      )}

      {state.status === 'empty' && (
        <Card className="mx-[16px] mb-[24px]">
          <EmptyState>No customers are being monitored yet.</EmptyState>
        </Card>
      )}

      {state.status === 'success' && (
        <Card
          aria-label="Customer list"
          className="mx-[16px] mb-[24px] flex flex-col md:grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
        >
          {state.rows.map((row) => (
            <CustomerRow key={row.id} row={row} />
          ))}
          {state.rows.length === 0 && (
            <EmptyState className="md:col-span-2">No customers match this filter.</EmptyState>
          )}
        </Card>
      )}
    </>
  );
}
