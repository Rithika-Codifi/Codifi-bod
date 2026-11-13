import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDI } from '@/app/di';
import { isAppError } from '@/core/domain';
import { customersQueryKeys } from '@/features/customers';
import { overviewQueryKeys } from '@/features/overview';
import { toast } from '@/shared/ui';

import {
  selectCustomerDetail,
  type CustomerDetailIntent,
  type CustomerDetailViewState,
} from '../state/customerDetailState';

import { customerDetailQueryKeys } from './customerDetailQueryKeys';

const messageOf = (e: unknown) => (isAppError(e) ? e.message : 'Something went wrong.');

export function useCustomerDetailViewModel(): {
  state: CustomerDetailViewState;
  onIntent: (intent: CustomerDetailIntent) => void;
} {
  const { customerId = '' } = useParams();
  const navigate = useNavigate();
  const { customerDetail, moduleChecks } = useDI();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: customerDetailQueryKeys.detail(customerId),
    queryFn: () => customerDetail.getCustomerDetail.execute(customerId),
  });
  const { refetch } = query;

  const retest = useMutation({
    mutationKey: customerDetailQueryKeys.retest(customerId),
    mutationFn: (jobIds: string[]) => customerDetail.retestEtlJobs.execute(customerId, jobIds),
    onSuccess: (_, jobIds) =>
      toast.show(jobIds.length === 1 ? 'Retest passed' : `Retest passed for ${jobIds.length} jobs`, {
        tone: 'success',
      }),
    onError: (e) => toast.show(messageOf(e), { tone: 'error' }),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: customerDetailQueryKeys.detail(customerId) }),
        queryClient.invalidateQueries({ queryKey: customersQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: overviewQueryKeys.all }),
      ]),
  });
  const { mutate } = retest;

  // Downloads the customer's Open API checks report as a PDF.
  const download = useMutation({
    mutationFn: () => moduleChecks.downloadReport.execute(customerId, { kind: 'module', id: 'open-api' }),
    onSuccess: () => toast.show('Report downloaded', { tone: 'success' }),
    onError: (e) => toast.show(messageOf(e), { tone: 'error' }),
  });
  const { mutate: startDownload } = download;

  // Optimistic "running" state: every job in a pending retest renders as running.
  const pending = useMutationState({
    filters: { mutationKey: customerDetailQueryKeys.retest(customerId), status: 'pending' },
    select: (m) => m.state.variables as string[] | undefined,
  });
  const running = useMemo(() => new Set(pending.flatMap((ids) => ids ?? [])), [pending]);

  const model = useMemo(
    () => (query.data ? selectCustomerDetail(query.data, running) : undefined),
    [query.data, running],
  );

  const onIntent = useCallback(
    (intent: CustomerDetailIntent) => {
      switch (intent.type) {
        case 'retry':
          void refetch();
          return;
        case 'retestFailed':
          if (model && model.header.retestJobIds.length > 0) mutate([...model.header.retestJobIds]);
          return;
        case 'downloadReport':
          startDownload();
          return;
        case 'openEtl':
          navigate(`/customers/${customerId}/etl/${intent.jobId}`);
          return;
        case 'retestJob':
          if (!running.has(intent.jobId)) mutate([intent.jobId]);
          return;
      }
    },
    [refetch, mutate, startDownload, model, running, navigate, customerId],
  );

  const state = useMemo<CustomerDetailViewState>(() => {
    if (query.isPending) return { status: 'loading' };
    if (query.isError || !model) {
      const e = query.error;
      return {
        status: 'error',
        message: messageOf(e),
        retrying: query.isFetching,
        notFound: isAppError(e) && e.kind === 'not-found',
      };
    }
    return {
      status: 'success',
      model,
      retestingFailed: retest.isPending && running.size > 0,
      downloading: download.isPending,
    };
  }, [
    query.isPending,
    query.isError,
    query.error,
    query.isFetching,
    model,
    retest.isPending,
    running,
    download.isPending,
  ]);

  return { state, onIntent };
}
