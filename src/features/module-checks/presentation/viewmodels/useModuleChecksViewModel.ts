import {
  keepPreviousData,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { useDI } from '@/app/di';
import { isAppError } from '@/core/domain';
import { customerDetailQueryKeys } from '@/features/customer-detail';
import { customersQueryKeys } from '@/features/customers';
import { overviewQueryKeys } from '@/features/overview';
import { toast } from '@/shared/ui';

import type { CheckSource } from '../../domain';
import {
  initialModuleChecksUiState,
  moduleChecksReducer,
  selectModuleChecks,
  type ModuleChecksIntent,
  type ModuleChecksViewState,
} from '../state/moduleChecksState';

import { moduleChecksQueryKeys } from './moduleChecksQueryKeys';

const messageOf = (e: unknown) => (isAppError(e) ? e.message : 'Something went wrong.');

export function useModuleChecksViewModel(): {
  state: ModuleChecksViewState;
  onIntent: (intent: ModuleChecksIntent) => void;
} {
  const { customerId = '', moduleId, etlId } = useParams();
  // One screen for module checks and ETL job checks; the route decides the source.
  const source = useMemo<CheckSource>(
    () => (etlId ? { kind: 'etl', id: etlId } : { kind: 'module', id: moduleId ?? '' }),
    [etlId, moduleId],
  );
  const { moduleChecks } = useDI();
  const queryClient = useQueryClient();
  const [ui, dispatch] = useReducer(moduleChecksReducer, initialModuleChecksUiState);

  const query = useQuery({
    queryKey: moduleChecksQueryKeys.list(customerId, source, ui.allPassed),
    queryFn: () =>
      source.kind === 'etl'
        ? moduleChecks.getEtlChecks.execute(customerId, source.id, { allPassed: ui.allPassed })
        : moduleChecks.getModuleChecks.execute(customerId, source.id, { allPassed: ui.allPassed }),
    placeholderData: keepPreviousData,
  });
  const { refetch } = query;

  const retest = useMutation({
    mutationKey: moduleChecksQueryKeys.retest(customerId, source),
    mutationFn: (ids: string[]) => moduleChecks.retestChecks.execute(customerId, source, ids),
    onSuccess: (_, ids) =>
      toast.show(ids.length === 1 ? 'Retest passed' : `Retest passed for ${ids.length} checks`, {
        tone: 'success',
      }),
    onError: (e) => toast.show(messageOf(e), { tone: 'error' }),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: moduleChecksQueryKeys.subject(customerId, source) }),
        queryClient.invalidateQueries({ queryKey: customerDetailQueryKeys.detail(customerId) }),
        queryClient.invalidateQueries({ queryKey: customersQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: overviewQueryKeys.all }),
      ]),
  });
  const { mutate } = retest;

  const pending = useMutationState({
    filters: { mutationKey: moduleChecksQueryKeys.retest(customerId, source), status: 'pending' },
    select: (m) => m.state.variables as string[] | undefined,
  });
  const running = useMemo(() => new Set(pending.flatMap((ids) => ids ?? [])), [pending]);

  const model = useMemo(
    () => (query.data ? selectModuleChecks(query.data, ui, running) : undefined),
    [query.data, ui, running],
  );

  const onIntent = useCallback(
    (intent: ModuleChecksIntent) => {
      switch (intent.type) {
        case 'retry':
          void refetch();
          return;
        case 'retestFailed':
          if (model && model.header.retestIds.length > 0) mutate([...model.header.retestIds]);
          return;
        case 'retestCheck':
          if (!running.has(intent.checkId)) mutate([intent.checkId]);
          return;
        default:
          dispatch(intent);
      }
    },
    [refetch, mutate, model, running],
  );

  const state = useMemo<ModuleChecksViewState>(() => {
    const filter = ui.filter;
    if (query.isPending) return { status: 'loading', filter };
    if (query.isError || !model) {
      const e = query.error;
      return {
        status: 'error',
        filter,
        message: messageOf(e),
        retrying: query.isFetching,
        notFound: isAppError(e) && e.kind === 'not-found',
      };
    }
    return {
      status: 'success',
      filter,
      model,
      retestingFailed: retest.isPending && running.size > 0,
      loadingMore: query.isPlaceholderData,
    };
  }, [
    ui.filter,
    query.isPending,
    query.isError,
    query.error,
    query.isFetching,
    query.isPlaceholderData,
    model,
    retest.isPending,
    running,
  ]);

  return { state, onIntent };
}
