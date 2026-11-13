import { QueryClient } from '@tanstack/react-query';

import { QUERY_STALE_TIME_MS } from '@/core/config/constants';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: 1,
        refetchOnWindowFocus: true,
        // Use cached data (and the service worker's API cache) when offline.
        networkMode: 'offlineFirst',
      },
      mutations: { retry: 0 },
    },
  });
