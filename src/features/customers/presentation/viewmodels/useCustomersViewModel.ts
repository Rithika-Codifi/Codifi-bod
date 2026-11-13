import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useReducer } from 'react';

import { useDI } from '@/app/di';
import { SEARCH_DEBOUNCE_MS } from '@/core/config/constants';
import { isAppError } from '@/core/domain';
import { useDebounce } from '@/shared/hooks';

import {
  customersReducer,
  initialCustomersUiState,
  selectCustomers,
  type CustomersIntent,
  type CustomersViewState,
} from '../state/customersState';

import { customersQueryKeys } from './customersQueryKeys';

export function useCustomersViewModel(): {
  state: CustomersViewState;
  onIntent: (intent: CustomersIntent) => void;
} {
  const { customers } = useDI();
  const [ui, dispatch] = useReducer(customersReducer, initialCustomersUiState);
  const debouncedQuery = useDebounce(ui.query, SEARCH_DEBOUNCE_MS);

  const query = useQuery({
    queryKey: customersQueryKeys.list(),
    queryFn: () => customers.getCustomers.execute(),
  });
  const { refetch } = query;

  const onIntent = useCallback(
    (intent: CustomersIntent) => {
      switch (intent.type) {
        case 'retry':
          void refetch();
          return;
        default:
          dispatch(intent);
      }
    },
    [refetch],
  );

  const state = useMemo<CustomersViewState>(() => {
    const base = { query: ui.query, filter: ui.filter };
    if (query.isPending) return { status: 'loading', ...base };
    if (query.isError) {
      const message = isAppError(query.error) ? query.error.message : 'Something went wrong.';
      return { status: 'error', ...base, message, retrying: query.isFetching };
    }
    const view = selectCustomers(query.data, ui, debouncedQuery);
    if (query.data.customers.length === 0) return { status: 'empty', ...base, header: view.header };
    return { status: 'success', ...base, ...view };
  }, [query.isPending, query.isError, query.error, query.isFetching, query.data, ui, debouncedQuery]);

  return { state, onIntent };
}
