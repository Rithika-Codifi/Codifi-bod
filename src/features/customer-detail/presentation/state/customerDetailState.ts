import type { Status } from '@/core/domain';

import {
  etlPassed,
  moduleStatus,
  moduleTotal,
  modulesHealthy,
  retestableJobIds,
  type CustomerDetail,
} from '../../domain';

export type CustomerDetailIntent =
  | { type: 'retestFailed' }
  | { type: 'retestJob'; jobId: string }
  /** Open the ETL job's checks screen (/customers/:id/etl/:etlId). */
  | { type: 'openEtl'; jobId: string }
  | { type: 'retry' };

export interface EtlRowModel {
  readonly id: string;
  readonly name: string;
  readonly status: Status;
  readonly meta: string;
  readonly metaIsError: boolean;
  readonly running: boolean;
}

export interface ModuleRowModel {
  readonly id: string;
  readonly href: string;
  readonly name: string;
  readonly count: string;
  readonly status: Status;
  readonly passed: number;
  readonly warnings: number;
  readonly failures: number;
  readonly note: string;
}

/** Pure projection: server detail + jobs currently being retested → view model. */
export function selectCustomerDetail(d: CustomerDetail, runningJobIds: ReadonlySet<string>) {
  const etl: EtlRowModel[] = d.etl.map((j) => {
    const running = runningJobIds.has(j.id);
    const status: Status = running ? 'running' : j.status;
    return {
      id: j.id,
      name: j.name,
      status,
      meta: running ? 'Retest in progress…' : j.meta,
      metaIsError: status === 'fail',
      running,
    };
  });
  const modules: ModuleRowModel[] = d.modules.map((m) => ({
    id: m.id,
    href: `/customers/${d.id}/modules/${m.id}`,
    name: m.name,
    count: `${m.passed}/${moduleTotal(m)}`,
    status: moduleStatus(m),
    passed: m.passed,
    warnings: m.warnings,
    failures: m.failures,
    note: m.note,
  }));
  const pendingRetest = retestableJobIds(d).filter((id) => !runningJobIds.has(id));
  return {
    header: {
      name: d.name,
      status: d.status,
      segments: d.segments.join(' · '),
      strip: [
        { label: 'ETL', value: etlPassed(d), suffix: `/${d.etl.length}` },
        { label: 'Modules', value: modulesHealthy(d), suffix: `/${d.modules.length}` },
        { label: 'Last run', value: d.lastRun },
      ],
      reportHref: `/reports/${d.latestRunId}`,
      retestJobIds: pendingRetest,
    },
    etl,
    modules,
  };
}

export type CustomerDetailModel = ReturnType<typeof selectCustomerDetail>;

export type CustomerDetailViewState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'error';
      readonly message: string;
      readonly retrying: boolean;
      readonly notFound: boolean;
    }
  | { readonly status: 'success'; readonly model: CustomerDetailModel; readonly retestingFailed: boolean };
