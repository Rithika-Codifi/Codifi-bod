import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDI } from '@/app/di';
import { isAppError } from '@/core/domain';
import { moduleChecksQueryKeys } from '@/features/module-checks';
import { overviewQueryKeys } from '@/features/overview';
import { toast } from '@/shared/ui';

import { selectReport, type ReportIntent, type ReportViewState } from '../state/reportState';

import { reportQueryKeys } from './reportQueryKeys';

const messageOf = (e: unknown) => (isAppError(e) ? e.message : 'Something went wrong.');

async function shareLink(title: string, text: string) {
  const url = window.location.href;
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.show('Link copied', { tone: 'success' });
  } catch {
    toast.show('Could not share this report', { tone: 'error' });
  }
}

export function useReportViewModel(): { state: ReportViewState; onIntent: (intent: ReportIntent) => void } {
  const { runId = 'latest' } = useParams();
  const { reports } = useDI();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: reportQueryKeys.run(runId),
    queryFn: () => reports.getTestRun.execute(runId),
  });
  const { refetch, data } = query;

  const retest = useMutation({
    mutationFn: () => reports.retestRun.execute(runId),
    onSuccess: ({ runId: next }) => {
      toast.show(`Retest started · Run #${next}`, { tone: 'success' });
      void queryClient.invalidateQueries({ queryKey: moduleChecksQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: overviewQueryKeys.all });
      if (data) navigate(`/customers/${data.customerId}/modules/${data.moduleId}`);
    },
    onError: (e) => toast.show(messageOf(e), { tone: 'error' }),
  });
  const { mutate } = retest;

  const model = useMemo(() => (data ? selectReport(data) : undefined), [data]);

  const onIntent = useCallback(
    (intent: ReportIntent) => {
      switch (intent.type) {
        case 'retry':
          void refetch();
          return;
        case 'print':
          window.print();
          return;
        case 'share':
          if (model) void shareLink(model.share.title, model.share.text);
          return;
        case 'retest':
          mutate();
          return;
      }
    },
    [refetch, mutate, model],
  );

  const state = useMemo<ReportViewState>(() => {
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
    return { status: 'success', model, retesting: retest.isPending };
  }, [query.isPending, query.isError, query.error, query.isFetching, model, retest.isPending]);

  return { state, onIntent };
}
