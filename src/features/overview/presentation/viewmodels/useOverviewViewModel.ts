import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useDI } from '@/app/di';
import { isAppError } from '@/core/domain';
import { customersQueryKeys } from '@/features/customers';
import { toast } from '@/shared/ui';

import { selectOverview, type OverviewIntent, type OverviewViewState } from '../state/overviewState';

import { overviewQueryKeys } from './overviewQueryKeys';

const messageOf = (e: unknown) => (isAppError(e) ? e.message : 'Something went wrong.');

export function useOverviewViewModel(): {
  state: OverviewViewState;
  onIntent: (intent: OverviewIntent) => void;
} {
  const { overview } = useDI();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: overviewQueryKeys.snapshot(),
    queryFn: () => overview.getOverview.execute(),
  });
  const { refetch } = query;

  const retest = useMutation({
    mutationFn: () => overview.retestAllFailed.execute(),
    onSuccess: ({ queued }) => {
      toast.show(`Retest started for ${queued} failed checks`, { tone: 'success' });
      void queryClient.invalidateQueries({ queryKey: overviewQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: customersQueryKeys.all });
    },
    onError: (e) => toast.show(messageOf(e), { tone: 'error' }),
  });
  const { mutate } = retest;

  const onIntent = useCallback(
    (intent: OverviewIntent) => {
      switch (intent.type) {
        case 'refresh':
        case 'retry':
          void refetch();
          return;
        case 'retestAllFailed':
          mutate();
          return;
      }
    },
    [refetch, mutate],
  );

  const state = useMemo<OverviewViewState>(() => {
    if (query.isPending) return { status: 'loading' };
    if (query.isError)
      return { status: 'error', message: messageOf(query.error), retrying: query.isFetching };
    return {
      status: 'success',
      model: selectOverview(query.data),
      refreshing: query.isFetching,
      retesting: retest.isPending,
    };
  }, [query.isPending, query.isError, query.error, query.isFetching, query.data, retest.isPending]);

  return { state, onIntent };
}
