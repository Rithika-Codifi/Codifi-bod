import { customerDetailSeed } from '@/mocks/customerDetail';

import { toCustomerDetail } from './customerDetailMapper';

describe('customerDetailMapper', () => {
  it('maps the Cholamandalam seed', () => {
    const d = toCustomerDetail(customerDetailSeed('cholamandalam'));
    expect(d.segments.join(' · ')).toBe('NSE · BSE · MCX · Web · Mobile · API');
    expect(d.lastRun).toBe('07:38');
    expect(d.etl[1]).toEqual({
      id: 'cm-fo',
      name: 'Contract master · NSE F&O',
      status: 'fail',
      meta: '07:31 · File not found on exchange SFTP',
    });
    expect(d.etl[4]?.meta).toBe('06:15 · 1,24,880 users synced');
    expect(d.modules[0]).toMatchObject({ id: 'open-api', passed: 31, warnings: 1, failures: 2 });
  });

  it('shows the message alone when a job has no finish time', () => {
    const dto = customerDetailSeed('cholamandalam');
    dto.etl_jobs = dto.etl_jobs.map((j, i) =>
      i === 0 ? { ...j, finished_at: null, message: 'Retest in progress…' } : j,
    );
    expect(toCustomerDetail(dto).etl[0]?.meta).toBe('Retest in progress…');
  });
});
