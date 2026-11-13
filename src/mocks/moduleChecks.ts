import type { StatusDto } from '@/core/network';
import type { ApiCheckDto, ModuleChecksDto } from '@/features/module-checks/data/dto/ModuleChecksDto';

import { customerDetailSeed } from './customerDetail';

const at = (hhmmss: string) => `2026-11-12T${hhmmss}+05:30`;

/** Short customer name used in back links ("Cholamandalam Sec."). */
export const customerShortName = (slug: string, name: string) =>
  slug === 'cholamandalam' ? 'Cholamandalam Sec.' : name;

type Row = [
  key: string,
  name: string,
  method: ApiCheckDto['method'],
  path: string,
  status: StatusDto,
  time: string,
  code: number,
  ms: number,
  note: string,
  error: string,
];

/** Exactly as docs/design/source/4-module-checks.html (Cholamandalam · Open API). */
const OPEN_API: Row[] = [
  [
    'place',
    'Place order',
    'POST',
    '/orders/regular',
    'FAILED',
    '07:38:05',
    502,
    30000,
    'timeout',
    'Expected 200, got 502 Bad Gateway. Upstream OMS gateway did not respond within 30 s.',
  ],
  [
    'modify',
    'Modify order',
    'PUT',
    '/orders/{id}',
    'FAILED',
    '07:38:06',
    502,
    30000,
    'timeout',
    'Depends on Place order — no open order to modify. Same upstream 502.',
  ],
  ['funds', 'Funds & limits', 'GET', '/funds/limits', 'WARNING', '07:38:07', 200, 1240, 'SLA 800', ''],
  ['login', 'Login & session', 'POST', '/session/login', 'PASSED', '07:38:02', 200, 140, '', ''],
  ['profile', 'User profile', 'GET', '/session/profile', 'PASSED', '07:38:03', 200, 96, '', ''],
  ['cancel', 'Cancel order', 'DELETE', '/orders/{id}', 'PASSED', '07:38:06', 200, 210, '', ''],
  ['obook', 'Order book', 'GET', '/orders', 'PASSED', '07:38:08', 200, 160, '', ''],
  ['tbook', 'Trade book', 'GET', '/trades', 'PASSED', '07:38:08', 200, 150, '', ''],
  ['pos', 'Positions', 'GET', '/positions', 'PASSED', '07:38:09', 200, 172, '', ''],
  ['hold', 'Holdings', 'GET', '/holdings', 'PASSED', '07:38:09', 200, 188, '', ''],
  ['quote', 'Market quote', 'GET', '/quotes', 'PASSED', '07:38:10', 200, 74, '', ''],
  ['ws', 'WebSocket market feed', 'WS', '/feed', 'PASSED', '07:38:11', 101, 58, 'first tick', ''],
  ['gtt', 'GTT orders', 'POST', '/gtt', 'PASSED', '07:38:12', 200, 230, '', ''],
];

/** The 21 passed checks behind "Show 21 more passed checks". */
const MORE_PASSED: [string, string, ApiCheckDto['method'], string, number][] = [
  ['basket', 'Basket orders', 'POST', '/orders/basket', 182],
  ['ohist', 'Order history', 'GET', '/orders/{id}/history', 120],
  ['amo', 'AMO orders', 'POST', '/orders/amo', 205],
  ['bo', 'Bracket order', 'POST', '/orders/bo', 214],
  ['co', 'Cover order', 'POST', '/orders/co', 198],
  ['margin', 'Margin calculator', 'POST', '/margins/orders', 133],
  ['ochain', 'Option chain', 'GET', '/option-chain', 166],
  ['candles', 'Historical candles', 'GET', '/charts/history', 142],
  ['index', 'Index list', 'GET', '/indices', 61],
  ['search', 'Scrip search', 'GET', '/instruments/search', 88],
  ['wl', 'Watchlist', 'GET', '/watchlists', 92],
  ['alerts', 'Price alerts', 'GET', '/alerts', 101],
  ['ledger', 'Ledger', 'GET', '/reports/ledger', 176],
  ['bank', 'Bank details', 'GET', '/session/banks', 84],
  ['payin', 'Pay-in status', 'GET', '/funds/payin', 119],
  ['pledge', 'Pledge request', 'POST', '/holdings/pledge', 224],
  ['ipo', 'IPO list', 'GET', '/ipo', 97],
  ['mf', 'Mutual funds', 'GET', '/mf/holdings', 154],
  ['pwd', 'Change password', 'PUT', '/session/password', 131],
  ['exit', 'Exit position', 'POST', '/positions/exit', 207],
  ['logout', 'Logout', 'DELETE', '/session', 52],
];

const toDto = ([key, name, method, path, status, time, code, ms, note, error]: Row): ApiCheckDto => ({
  key,
  name,
  method,
  path,
  status,
  checked_at: at(time),
  http_code: code,
  latency_ms: ms,
  latency_note: note,
  error: error || null,
});

export function moduleChecksSeed(slug: string, moduleKey: string, allPassed: boolean): ModuleChecksDto {
  const detail = customerDetailSeed(slug);
  const module = detail.modules.find((m) => m.key === moduleKey);
  if (!module) throw Object.assign(new Error('Not found'), { status: 404 });
  const base = {
    customer_slug: slug,
    customer_short_name: customerShortName(slug, detail.name),
    subject_kind: 'MODULE' as const,
    subject_key: module.key,
    subject_name: module.name,
    last_check_at: at('07:38:12'),
    avg_latency_ms: 182,
    latest_run_id: detail.latest_run_id,
  };
  const extra = MORE_PASSED.map(([key, name, method, path, ms], i): Row => [
    key,
    name,
    method,
    path,
    'PASSED',
    `07:38:${String(13 + (i % 40)).padStart(2, '0')}`,
    200,
    ms,
    '',
    '',
  ]);

  if (slug === 'cholamandalam' && moduleKey === 'open-api') {
    const rows = allPassed ? [...OPEN_API, ...extra] : OPEN_API;
    return { ...base, checks: rows.map(toDto), more_passed: allPassed ? 0 : extra.length };
  }

  // Other modules: synthesise checks that add up to the module summary.
  const total = module.passed + module.warnings + module.failures;
  const pool = [...OPEN_API, ...extra];
  const rows: Row[] = Array.from({ length: total }, (_, i) => {
    const r = pool[i % pool.length] as Row;
    const status: StatusDto =
      i < module.failures ? 'FAILED' : i < module.failures + module.warnings ? 'WARNING' : 'PASSED';
    const key = `${moduleKey}-${i + 1}`;
    const name = `${module.name} · ${r[1]}`;
    if (status === 'FAILED')
      return [
        key,
        name,
        r[2],
        r[3],
        status,
        '07:38:05',
        500,
        2400,
        'error',
        'Unexpected 500 from upstream service.',
      ];
    if (status === 'WARNING') return [key, name, r[2], r[3], status, '07:38:07', 200, 1100, 'SLA 800', ''];
    return [
      key,
      name,
      r[2],
      r[3],
      status,
      r[5],
      r[2] === 'WS' ? 101 : 200,
      r[7] > 1000 ? 180 : r[7],
      r[2] === 'WS' ? 'first tick' : '',
      '',
    ];
  });
  const visible = allPassed
    ? rows
    : rows.filter((r, i) => r[4] !== 'PASSED' || i < module.failures + module.warnings + 10);
  return { ...base, checks: visible.map(toDto), more_passed: rows.length - visible.length };
}
