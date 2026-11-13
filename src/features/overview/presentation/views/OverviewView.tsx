import { ErrorState } from '@/shared/ui';

import { AttentionList } from '../components/AttentionList';
import { HeroCard } from '../components/HeroCard';
import { OverviewHeader } from '../components/OverviewHeader';
import { OverviewSkeleton } from '../components/OverviewSkeleton';
import { WindowCard } from '../components/WindowCard';
import { useOverviewViewModel } from '../viewmodels/useOverviewViewModel';

export default function OverviewView() {
  const { state, onIntent } = useOverviewViewModel();
  const model = state.status === 'success' ? state.model : undefined;

  return (
    <>
      <OverviewHeader
        date={model?.header.date}
        alerts={model?.header.alerts}
        refreshing={state.status === 'success' && state.refreshing}
        onRefresh={() => onIntent({ type: 'refresh' })}
      />
      <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] lg:grid lg:grid-cols-2 lg:items-start">
        {state.status === 'loading' && <OverviewSkeleton />}
        {state.status === 'error' && (
          <ErrorState
            className="lg:col-span-2"
            message={state.message}
            retrying={state.retrying}
            onRetry={() => onIntent({ type: 'retry' })}
          />
        )}
        {state.status === 'success' && model && (
          <>
            <div className="flex flex-col gap-[16px]">
              <HeroCard hero={model.hero} />
              <WindowCard
                window={model.window}
                canRetest={model.canRetest}
                retesting={state.retesting}
                onRetest={() => onIntent({ type: 'retestAllFailed' })}
              />
            </div>
            <div className="flex flex-col gap-[16px]">
              <AttentionList items={model.attention} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
