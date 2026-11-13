import type { StatusDto } from '@/core/network';
import type { TestRunDto } from '@/features/reports/data/dto/TestRunDto';

import { customerDetailSeed } from './customerDetail';
import { customersSeed } from './customers';
import { moduleChecksSeed } from './moduleChecks';

const at = (t: string) => `2026-11-12T${t.length === 5 ? `${t}:00` : t}+05:30`;

/** Run #4812 exactly as docs/design/source/5-report.html. */
const RUN_4812: TestRunDto = {
  id: '4812',
  customer_slug: 'cholamandalam',
  customer_name: 'Cholamandalam Securities',
  module_key: 'open-api',
  module_name: 'Open API',
  suite: 'open-api-sanity',
  trigger: 'SCHEDULED',
  scheduled_at: at('07:35'),
  started_at: at('07:35:31'),
  finished_at: at('07:38:12'),
  environment: 'Production',
  status: 'FAILED',
  passed: 31,
  warnings: 1,
  failures: 2,
  history: [
    { run_id: '4797', started_at: at('05:45'), status: 'PASSED' },
    { run_id: '4801', started_at: at('06:30'), status: 'PASSED' },
    { run_id: '4806', started_at: at('07:00'), status: 'WARNING' },
    { run_id: '4812', started_at: at('07:35'), status: 'FAILED' },
  ],
  issues: [
    {
      key: 'place',
      status: 'FAILED',
      name: 'Place order',
      method: 'POST',
      path: '/orders/regular',
      at: at('07:38:05'),
      message:
        'Expected HTTP 200 with an order id. The request timed out after 30 s and the gateway returned 502.',
      log: '> POST /orders/regular\n  symbol=SBIN-EQ qty=1 type=LIMIT\n< 502 Bad Gateway  (30,004 ms)\n  upstream: oms-gw-02 no response',
      hint: 'Likely cause: OMS gateway session for NSE CM not up',
    },
    {
      key: 'modify',
      status: 'FAILED',
      name: 'Modify order',
      method: 'PUT',
      path: '/orders/{id}',
      at: at('07:38:06'),
      message:
        'Skipped dependency: no open order from the Place order step, and the same upstream 502 was returned.',
      log: '> PUT /orders/{id}\n< 502 Bad Gateway  (30,001 ms)',
      hint: 'Retest after Place order passes',
    },
    {
      key: 'funds',
      status: 'WARNING',
      name: 'Funds & limits',
      method: 'GET',
      path: '/funds/limits',
      at: at('07:38:07'),
      message: 'Response was correct but slower than the 800 ms target.',
      log: '< 200 OK  (1,240 ms)\n  312 clients missing limits',
      hint: 'Linked to ETL: client limits upload had rejected rows',
    },
  ],
  checks: (
    [
      ['Login & session', 140, 'PASSED'],
      ['User profile', 96, 'PASSED'],
      ['Place order', 30000, 'FAILED'],
      ['Modify order', 30000, 'FAILED'],
      ['Cancel order', 210, 'PASSED'],
      ['Order book', 160, 'PASSED'],
      ['Positions', 172, 'PASSED'],
      ['Holdings', 188, 'PASSED'],
      ['Funds & limits', 1240, 'WARNING'],
      ['WebSocket feed', 58, 'PASSED'],
    ] as [string, number, StatusDto][]
  ).map(([name, latency_ms, status]) => ({ name, latency_ms, status })),
};

/** Run #4812 for Cholamandalam; other customers' latest runs are derived from their Open API checks. */
export function testRunSeed(runId: string): TestRunDto {
  if (runId === 'latest' || runId === '4812') return structuredClone(RUN_4812);
  const customer = customersSeed.customers.find((c) => customerDetailSeed(c.slug).latest_run_id === runId);
  if (!customer) throw Object.assign(new Error('Not found'), { status: 404 });
  const m = moduleChecksSeed(customer.slug, 'open-api', true);
  const n = (s: StatusDto) => m.checks.filter((c) => c.status === s).length;
  const status: StatusDto = n('FAILED') ? 'FAILED' : n('WARNING') ? 'WARNING' : 'PASSED';
  return {
    ...structuredClone(RUN_4812),
    id: runId,
    customer_slug: customer.slug,
    customer_name: customer.name,
    status,
    passed: n('PASSED'),
    warnings: n('WARNING'),
    failures: n('FAILED'),
    history: RUN_4812.history.map((h, i, all) =>
      i === all.length - 1 ? { ...h, run_id: runId, status } : h,
    ),
    issues: m.checks
      .filter((c) => c.status !== 'PASSED')
      .map((c) => ({
        key: c.key,
        status: c.status,
        name: c.name,
        method: c.method === 'DELETE' ? 'DEL' : c.method,
        path: c.path,
        at: c.checked_at ?? at('07:38:12'),
        message: c.error ?? `Slower than the target (${c.latency_ms} ms).`,
        log: `< ${c.http_code}  (${c.latency_ms.toLocaleString('en-IN')} ms)`,
        hint: 'Retest after the upstream recovers',
      })),
    checks: m.checks.slice(0, 10).map((c) => ({ name: c.name, latency_ms: c.latency_ms, status: c.status })),
  };
}
