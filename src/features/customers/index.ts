import { lazy } from 'react';

export const CustomersView = lazy(() => import('./presentation/views/CustomersView'));
export { customersQueryKeys } from './presentation/viewmodels/customersQueryKeys';
export type { Customer, CustomersOverview } from './domain';
