import type { CustomerListDto } from '../dto/CustomerDto';

import { toCustomerList } from './customerMapper';

describe('customerMapper', () => {
  it('maps the list DTO to entities with IST times', () => {
    const dto: CustomerListDto = {
      updated_at: '2026-11-12T02:12:00Z',
      customers: [
        {
          slug: 'cholamandalam',
          code: 'CUST-004',
          name: 'Cholamandalam Securities',
          status: 'FAILED',
          etl_passed: 6,
          etl_total: 8,
          api_passed: 31,
          api_total: 34,
          last_check_at: '2026-11-12T07:38:00+05:30',
        },
      ],
    };
    expect(toCustomerList(dto)).toEqual({
      updatedAt: '07:42',
      customers: [
        {
          id: 'cholamandalam',
          code: 'CUST-004',
          name: 'Cholamandalam Securities',
          status: 'fail',
          etl: { ok: 6, total: 8 },
          api: { ok: 31, total: 34 },
          lastCheck: '07:38',
        },
      ],
    });
  });

  it('maps every status', () => {
    const base = {
      slug: 'x',
      code: 'x',
      name: 'x',
      etl_passed: 0,
      etl_total: 0,
      api_passed: 0,
      api_total: 0,
    };
    const at = '2026-11-12T07:00:00+05:30';
    const list = toCustomerList({
      updated_at: at,
      customers: (['FAILED', 'WARNING', 'PASSED', 'RUNNING'] as const).map((status) => ({
        ...base,
        status,
        last_check_at: at,
      })),
    });
    expect(list.customers.map((c) => c.status)).toEqual(['fail', 'warn', 'pass', 'running']);
  });
});
