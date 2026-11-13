import type { StatusDto } from '@/core/network';
import type {
  CustomerDetailDto,
  EtlJobDto,
  ModuleSummaryDto,
} from '@/features/customer-detail/data/dto/CustomerDetailDto';

import { customersSeed } from './customers';

const at = (hhmm: string) => `2026-11-12T${hhmm}:00+05:30`;

const job = (key: string, name: string, status: StatusDto, time: string, message: string): EtlJobDto => ({
  key,
  name,
  status,
  finished_at: at(time),
  message,
});

const mod = (
  key: string,
  name: string,
  passed: number,
  warnings: number,
  failures: number,
  note: string,
): ModuleSummaryDto => ({
  key,
  name,
  passed,
  warnings,
  failures,
  note,
});

/** ETL jobs exactly as docs/design/source/3-customer-detail.html (Cholamandalam). */
const cholaJobs = (): EtlJobDto[] => [
  job('cm-nse', 'Contract master · NSE CM', 'PASSED', '06:02', '2,418 scrips loaded'),
  job('cm-fo', 'Contract master · NSE F&O', 'FAILED', '07:31', 'File not found on exchange SFTP'),
  job('cm-bse', 'Contract master · BSE', 'PASSED', '06:04', '5,906 scrips loaded'),
  job('cm-mcx', 'Contract master · MCX', 'PASSED', '06:05', '812 contracts loaded'),
  job('user', 'User master upload', 'PASSED', '06:15', '1,24,880 users synced'),
  job('limits', 'Client limits & margin', 'WARNING', '06:40', '312 rows rejected (invalid UCC)'),
  job('hold', 'Holdings upload', 'PASSED', '06:22', '3,41,509 records'),
  job('bhav', 'Bhavcopy / previous close', 'PASSED', '05:48', 'NSE, BSE, MCX'),
];

const cholaModules = (): ModuleSummaryDto[] => [
  mod('open-api', 'Open API', 31, 1, 2, 'Place / modify order returning 502'),
  mod('rms', 'Risk management (RMS)', 9, 1, 0, 'Limits partly loaded — see ETL'),
  mod('oms', 'Order management (OMS)', 24, 0, 0, 'All exchange gateways logged in'),
  mod('market-data', 'Market data feed', 12, 0, 0, 'Tick latency 140 ms avg'),
  mod('web', 'Web trading', 18, 0, 0, 'Login, watchlist, order flow OK'),
  mod('mobile', 'Mobile trading', 18, 0, 0, 'Android & iOS builds checked'),
  mod('back-office', 'Back-office sync', 6, 0, 0, 'Trades & ledger sync OK'),
  mod('payments', 'Payments (pay-in / pay-out)', 5, 0, 0, 'Gateway & UPI callbacks OK'),
  mod('notifications', 'Notifications', 4, 0, 0, 'SMS, email, push OK'),
];

/** Detail seed: exact design data for Cholamandalam, consistent synthetic data for the others. */
export function customerDetailSeed(slug: string): CustomerDetailDto {
  const c = customersSeed.customers.find((x) => x.slug === slug);
  if (!c) throw Object.assign(new Error('Not found'), { status: 404 });
  const base = {
    slug: c.slug,
    name: c.name,
    status: c.status,
    segments: ['NSE', 'BSE', 'MCX', 'Web', 'Mobile', 'API'],
    last_run_at: c.last_check_at,
    latest_run_id: slug === 'cholamandalam' ? '4812' : `${4800 + Number(c.code.slice(-3))}`,
  };
  if (slug === 'cholamandalam') return { ...base, etl_jobs: cholaJobs(), modules: cholaModules() };

  // Others: same jobs/modules, all healthy, then degrade to match the list counts.
  const jobs = cholaJobs().map((j) => ({ ...j, status: 'PASSED' as StatusDto }));
  jobs[1] = job('cm-fo', 'Contract master · NSE F&O', 'PASSED', '06:03', '41,272 contracts loaded');
  jobs[5] = job('limits', 'Client limits & margin', 'PASSED', '06:40', 'All rows loaded');
  const etlFailing = c.etl_total - c.etl_passed;
  if (etlFailing > 0)
    jobs[5] = job('limits', 'Client limits & margin', 'WARNING', '06:40', 'Upload delayed by 18 min');
  const modules = cholaModules().map((m) => ({
    ...m,
    passed: m.passed + m.warnings + m.failures,
    warnings: 0,
    failures: 0,
  }));
  const apiFailing = c.api_total - c.api_passed;
  modules[0] = mod(
    'open-api',
    'Open API',
    c.api_passed,
    c.status === 'WARNING' ? apiFailing : 0,
    c.status === 'FAILED' ? apiFailing : 0,
    apiFailing ? 'Some checks failing — open for details' : 'All endpoints healthy',
  );
  if (apiFailing === 0) modules[0] = { ...modules[0], note: 'All endpoints healthy' };
  return { ...base, etl_jobs: jobs, modules };
}
