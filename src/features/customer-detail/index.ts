import { lazy } from 'react';

export const CustomerDetailView = lazy(() => import('./presentation/views/CustomerDetailView'));
export { customerDetailQueryKeys } from './presentation/viewmodels/customerDetailQueryKeys';
export type { CustomerDetail } from './domain';
