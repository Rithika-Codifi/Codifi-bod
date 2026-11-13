import { lazy } from 'react';

export const ReportView = lazy(() => import('./presentation/views/ReportView'));
export { reportQueryKeys } from './presentation/viewmodels/reportQueryKeys';
export type { TestRun } from './domain';
