import { lazy } from 'react';

export const OverviewView = lazy(() => import('./presentation/views/OverviewView'));
export { overviewQueryKeys } from './presentation/viewmodels/overviewQueryKeys';
export type { Overview } from './domain';
