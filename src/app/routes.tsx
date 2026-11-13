import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { CustomerDetailView } from '@/features/customer-detail';
import { CustomersView } from '@/features/customers';
import { ModuleChecksView } from '@/features/module-checks';
import { OverviewView } from '@/features/overview';
import { ReportView } from '@/features/reports';
import { type RouteHandle } from '@/shared/layout';

import { AppLayout } from './AppLayout';

const NotFoundView = lazy(() => import('./NotFoundView'));
const UiGallery = import.meta.env.DEV ? lazy(() => import('./dev/UiGallery')) : null;

/** BottomNav is shown on Overview only; every other screen hides it. */
const withBottomNav: RouteHandle = { showBottomNav: true };
const noBottomNav: RouteHandle = { showBottomNav: false };

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewView />, handle: withBottomNav },
      { path: 'customers', element: <CustomersView />, handle: noBottomNav },
      { path: 'customers/:customerId', element: <CustomerDetailView />, handle: noBottomNav },
      // The checks screen is shared by modules and ETL jobs (source = { kind, id } from the params).
      { path: 'customers/:customerId/modules/:moduleId', element: <ModuleChecksView />, handle: noBottomNav },
      { path: 'customers/:customerId/etl/:etlId', element: <ModuleChecksView />, handle: noBottomNav },
      { path: 'reports/:runId', element: <ReportView />, handle: noBottomNav },
      ...(UiGallery ? [{ path: '__ui', element: <UiGallery />, handle: noBottomNav }] : []),
      { path: '*', element: <NotFoundView />, handle: noBottomNav },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);
