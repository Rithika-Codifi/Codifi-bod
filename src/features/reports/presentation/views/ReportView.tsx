import { BackLink, PageHeader } from '@/shared/layout';
import { ErrorState, MetaGrid, Skeleton, SkeletonList } from '@/shared/ui';

import { ChecksTable } from '../components/ChecksTable';
import { FailureCard } from '../components/FailureCard';
import { ReportActions } from '../components/ReportActions';
import { ReportHeader } from '../components/ReportHeader';
import { ResultCard } from '../components/ResultCard';
import { useReportViewModel } from '../viewmodels/useReportViewModel';

export default function ReportView() {
  const { state, onIntent } = useReportViewModel();

  if (state.status !== 'success') {
    return (
      <>
        <PageHeader className="flex flex-col gap-[12px] px-[16px] pt-[10px] pb-[18px]">
          <BackLink to="/" label="Overview" />
          <h1 className="m-0 font-serif text-[30px] leading-[1.05] font-normal">Test report</h1>
        </PageHeader>
        <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px]">
          {state.status === 'loading' ? (
            <div aria-busy="true" aria-label="Loading report" className="flex flex-col gap-[16px]">
              <Skeleton className="h-[180px] border border-border" />
              <Skeleton className="h-[170px] border border-border" />
              <SkeletonList rows={4} rowHeight={38} />
            </div>
          ) : (
            <ErrorState
              title={state.notFound ? 'Report not found' : 'Could not load'}
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
    <>
      <ReportHeader header={model.header} />
      <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-[16px]">
          <MetaGrid label="Run details" items={model.meta} />
          <ResultCard result={model.result} />
        </div>
        <div className="flex flex-col gap-[16px]">
          <section aria-label="Failures" className="flex flex-col gap-[12px]">
            <h2 className="mx-[2px] mt-[4px] mb-0 font-serif text-[20px] font-normal">
              Failures &amp; warnings
            </h2>
            {model.failures.map((f) => (
              <FailureCard key={f.id} failure={f} />
            ))}
          </section>
          <ChecksTable checks={model.checks} />
        </div>
      </div>
      <ReportActions
        retesting={state.retesting}
        onPrint={() => onIntent({ type: 'print' })}
        onShare={() => onIntent({ type: 'share' })}
        onRetest={() => onIntent({ type: 'retest' })}
      />
    </>
  );
}
