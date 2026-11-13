import { timeIST } from '@/core/domain';

import type { Customer } from '../entities';
import type { CustomerRepository } from '../repositories/CustomerRepository';

import { GetCustomers, worstStatus } from './GetCustomers';

const c = (id: string, status: Customer['status']): Customer => ({
  id,
  code: id,
  name: id,
  status,
  etl: { ok: 8, total: 8 },
  api: { ok: 1, total: 1 },
  lastCheck: timeIST('07:00'),
});

const repo = (customers: Customer[]): CustomerRepository => ({
  getCustomers: () => Promise.resolve({ customers, updatedAt: timeIST('07:42') }),
});

describe('GetCustomers', () => {
  it('sorts fail → warn → pass and keeps order within a group', async () => {
    const result = await new GetCustomers(
      repo([c('p1', 'pass'), c('w1', 'warn'), c('f1', 'fail'), c('p2', 'pass'), c('f2', 'fail')]),
    ).execute();
    expect(result.customers.map((x) => x.id)).toEqual(['f1', 'f2', 'w1', 'p1', 'p2']);
    expect(result.updatedAt).toBe('07:42');
  });

  it('reports the worst status as overall', async () => {
    expect((await new GetCustomers(repo([c('a', 'pass'), c('b', 'warn')])).execute()).overall).toBe('warn');
    expect(worstStatus([c('a', 'pass'), c('b', 'fail'), c('c', 'warn')])).toBe('fail');
    expect(worstStatus([])).toBe('pass');
  });
});
