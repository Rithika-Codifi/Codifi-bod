import { BackLink, PageHeader } from '@/shared/layout';
import { ErrorState, Skeleton, SkeletonList } from '@/shared/ui';

import { CustomerDetailHeader } from '../components/CustomerDetailHeader';
import { EtlList } from '../components/EtlList';
import { ModuleList } from '../components/ModuleList';
import { useCustomerDetailViewModel } from '../viewmodels/useCustomerDetailViewModel';

export default function CustomerDetailView() {
  const { state, onIntent } = useCustomerDetailViewModel();

  if (state.status !== 'success') {
    return (
      <>
        <PageHeader className="flex flex-col gap-[14px] px-[16px] pt-[10px] pb-[18px]">
          <BackLink to="/customers" label="Customers" />
          {state.status === 'loading' && (
            <div aria-busy="true" aria-label="Loading customer" className="flex flex-col gap-[14px]">
              <Skeleton className="h-[31px] w-[70%]" />
              <Skeleton className="h-[69px]" />
              <Skeleton className="h-[46px]" />
            </div>
          )}
        </PageHeader>
        <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px]">
          {state.status === 'loading' ? (
            <SkeletonList rows={8} rowHeight={64} />
          ) : (
            <ErrorState
              title={state.notFound ? 'Customer not found' : 'Could not load'}
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
      <CustomerDetailHeader
        header={model.header}
        retesting={state.retestingFailed}
        downloading={state.downloading}
        onDownloadReport={() => onIntent({ type: 'downloadReport' })}
        onRetestFailed={() => onIntent({ type: 'retestFailed' })}
      />
      <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px]">
        <EtlList
          rows={model.etl}
          onOpen={(jobId) => onIntent({ type: 'openEtl', jobId })}
          onRetest={(jobId) => onIntent({ type: 'retestJob', jobId })}
        />
        <ModuleList rows={model.modules} />
      </div>
    </div>
  );
}
