import { BackLink, PageHeader } from '@/shared/layout';
import {
  Card,
  ChevronDownIcon,
  EmptyState,
  ErrorState,
  FilterChips,
  Skeleton,
  SkeletonList,
  Spinner,
} from '@/shared/ui';

import { CheckRow } from '../components/CheckRow';
import { ModuleChecksHeader } from '../components/ModuleChecksHeader';
import { useModuleChecksViewModel } from '../viewmodels/useModuleChecksViewModel';

export default function ModuleChecksView() {
  const { state, onIntent } = useModuleChecksViewModel();

  if (state.status !== 'success') {
    return (
      <>
        <PageHeader className="flex flex-col gap-[14px] px-[16px] pt-[10px] pb-[18px]">
          <BackLink to=".." label="Back" />
          {state.status === 'loading' && (
            <div aria-busy="true" aria-label="Loading checks" className="flex flex-col gap-[14px]">
              <Skeleton className="h-[32px] w-[60%]" />
              <Skeleton className="h-[26px]" />
              <Skeleton className="h-[46px]" />
            </div>
          )}
        </PageHeader>
        <div className="px-[16px] pt-[16px] pb-[24px]">
          {state.status === 'loading' ? (
            <SkeletonList rows={8} rowHeight={72} />
          ) : (
            <ErrorState
              title={state.notFound ? 'Module not found' : 'Could not load'}
              message={state.message}
              retrying={state.retrying}
              onRetry={state.notFound ? undefined : () => onIntent({ type: 'retry' })}
            />
          )}
        </div>
      </>
    );
  }

  const { model } = state;
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
      <ModuleChecksHeader
        header={model.header}
        retesting={state.retestingFailed}
        downloading={state.downloading}
        onRetestFailed={() => onIntent({ type: 'retestFailed' })}
        onDownloadReport={() => onIntent({ type: 'downloadReport' })}
      />
      <div className="flex flex-col">
        <FilterChips
          label="Filter checks"
          value={state.filter}
          onChange={(status) => onIntent({ type: 'filter', status })}
          chips={model.chips}
          className="px-[16px] pt-[14px] pb-[4px]"
        />
        <div className="px-[16px] pt-[10px] pb-[24px]">
          <Card aria-label="API checks" className="flex flex-col">
            {model.rows.map((row) => (
              <CheckRow
                key={row.id}
                row={row}
                onRetest={(checkId) => onIntent({ type: 'retestCheck', checkId })}
              />
            ))}
            {model.rows.length === 0 && <EmptyState>No checks match this filter.</EmptyState>}
            {model.showMore && (
              <button
                type="button"
                onClick={() => onIntent({ type: 'showMore' })}
                disabled={state.loadingMore}
                className="flex h-[52px] items-center justify-center gap-[8px] border-0 bg-surface font-mono text-[11px] font-bold tracking-[0.1em] text-text uppercase"
              >
                {model.showMore}
                {state.loadingMore ? <Spinner size={14} /> : <ChevronDownIcon size={14} strokeWidth={2} />}
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
