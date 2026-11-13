import { lazy } from 'react';

export const ModuleChecksView = lazy(() => import('./presentation/views/ModuleChecksView'));
export { moduleChecksQueryKeys } from './presentation/viewmodels/moduleChecksQueryKeys';
export type { ApiCheck, ModuleChecks } from './domain';
