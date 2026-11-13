import type { OverviewDto } from '@/features/overview/data/dto/OverviewDto';

const at = (hhmm: string) => `2026-11-12T${hhmm}:00+05:30`;

/** Seed identical to docs/design/source/1-overview.html. */
export const overviewSeed: OverviewDto = {
  as_of: at('07:42'),
  customers: { passed: 12, warning: 3, failed: 2 },
  window: {
    start: at('05:30'),
    cutoff: at('08:30'),
    scale_end: at('09:00'),
    market_note: 'MCX opens 09:00 · NSE 09:15',
    runs_done: 3,
    runs_total: 4,
    last_run_at: at('07:38'),
    next_run_at: at('08:00'),
  },
  stats: {
    failed_checks: 9,
    failed_etl: 3,
    failed_api: 6,
    warnings: 14,
    warnings_note: 'Delays · slow APIs',
    etl_done: 130,
    etl_total: 136,
    avg_run_seconds: 228,
  },
  attention: [
    {
      customer_slug: 'cholamandalam',
      customer_name: 'Cholamandalam Securities',
      status: 'FAILED',
      text: 'Contract master (NSE F&O) upload failed · +2 more',
      at: at('07:31'),
    },
    {
      customer_slug: 'nirmal-bang',
      customer_name: 'Nirmal Bang',
      status: 'FAILED',
      text: 'Order routing: NSE CM gateway login rejected',
      at: at('07:36'),
    },
    {
      customer_slug: 'alice-blue',
      customer_name: 'Alice Blue',
      status: 'WARNING',
      text: 'User master upload delayed by 18 min',
      at: at('07:20'),
    },
    {
      customer_slug: 'goodwill',
      customer_name: 'Goodwill',
      status: 'WARNING',
      text: 'Market feed latency 1.2 s (SLA 500 ms)',
      at: at('07:34'),
    },
    {
      customer_slug: 'findoc',
      customer_name: 'Findoc',
      status: 'WARNING',
      text: 'Client limits upload: 312 rows rejected',
      at: at('06:44'),
    },
  ],
  unread_alerts: 5,
};
