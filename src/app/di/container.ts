import type { AxiosInstance } from 'axios';

import { env } from '@/core/config/env';
import { createHttpClient } from '@/core/network';
import {
  CustomerDetailMockDataSource,
  CustomerDetailRemoteDataSource,
  CustomerDetailRepositoryImpl,
} from '@/features/customer-detail/data';
import { GetCustomerDetail, RetestEtlJobs } from '@/features/customer-detail/domain';
import {
  CustomerRepositoryImpl,
  CustomersMockDataSource,
  CustomersRemoteDataSource,
} from '@/features/customers/data';
import { GetCustomers } from '@/features/customers/domain';
import {
  ModuleChecksMockDataSource,
  ModuleChecksRemoteDataSource,
  ModuleChecksRepositoryImpl,
} from '@/features/module-checks/data';
import { GetEtlChecks, GetModuleChecks, RetestChecks } from '@/features/module-checks/domain';
import {
  OverviewMockDataSource,
  OverviewRemoteDataSource,
  OverviewRepositoryImpl,
} from '@/features/overview/data';
import { GetOverview, RetestAllFailed } from '@/features/overview/domain';
import { ReportMockDataSource, ReportRemoteDataSource, ReportRepositoryImpl } from '@/features/reports/data';
import { GetTestRun, RetestRun } from '@/features/reports/domain';

/**
 * Composition root. Each feature registers its use cases here; the data source (mock | http)
 * is picked from VITE_USE_MOCK. Views never construct repositories or use cases themselves.
 */
export interface Container {
  readonly mode: 'mock' | 'http';
  readonly http: AxiosInstance;
  readonly customers: {
    readonly getCustomers: GetCustomers;
  };
  readonly customerDetail: {
    readonly getCustomerDetail: GetCustomerDetail;
    readonly retestEtlJobs: RetestEtlJobs;
  };
  readonly moduleChecks: {
    readonly getModuleChecks: GetModuleChecks;
    readonly getEtlChecks: GetEtlChecks;
    readonly retestChecks: RetestChecks;
  };
  readonly overview: {
    readonly getOverview: GetOverview;
    readonly retestAllFailed: RetestAllFailed;
  };
  readonly reports: {
    readonly getTestRun: GetTestRun;
    readonly retestRun: RetestRun;
  };
}

export function createContainer(useMock: boolean = env.useMock): Container {
  const http = createHttpClient();

  const customersRepo = new CustomerRepositoryImpl(
    useMock ? new CustomersMockDataSource() : new CustomersRemoteDataSource(http),
  );

  const overviewRepo = new OverviewRepositoryImpl(
    useMock ? new OverviewMockDataSource() : new OverviewRemoteDataSource(http),
  );

  const customerDetailRepo = new CustomerDetailRepositoryImpl(
    useMock ? new CustomerDetailMockDataSource() : new CustomerDetailRemoteDataSource(http),
  );

  const moduleChecksRepo = new ModuleChecksRepositoryImpl(
    useMock ? new ModuleChecksMockDataSource() : new ModuleChecksRemoteDataSource(http),
  );

  const reportRepo = new ReportRepositoryImpl(
    useMock ? new ReportMockDataSource() : new ReportRemoteDataSource(http),
  );

  return {
    mode: useMock ? 'mock' : 'http',
    http,
    customers: {
      getCustomers: new GetCustomers(customersRepo),
    },
    customerDetail: {
      getCustomerDetail: new GetCustomerDetail(customerDetailRepo),
      retestEtlJobs: new RetestEtlJobs(customerDetailRepo),
    },
    moduleChecks: {
      getModuleChecks: new GetModuleChecks(moduleChecksRepo),
      getEtlChecks: new GetEtlChecks(moduleChecksRepo),
      retestChecks: new RetestChecks(moduleChecksRepo),
    },
    overview: {
      getOverview: new GetOverview(overviewRepo),
      retestAllFailed: new RetestAllFailed(overviewRepo),
    },
    reports: {
      getTestRun: new GetTestRun(reportRepo),
      retestRun: new RetestRun(reportRepo),
    },
  };
}
