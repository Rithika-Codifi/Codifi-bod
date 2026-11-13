import { etlChecksSeed } from '@/mocks/etlChecks';
import { moduleChecksSeed } from '@/mocks/moduleChecks';

import { toModuleChecks } from './moduleChecksMapper';

describe('moduleChecksMapper', () => {
  it('maps the Open API seed', () => {
    const m = toModuleChecks(moduleChecksSeed('cholamandalam', 'open-api', false));
    expect(m).toMatchObject({
      customerShortName: 'Cholamandalam Sec.',
      name: 'Open API',
      source: { kind: 'module', id: 'open-api' },
      lastCheck: '07:38:12',
      morePassed: 21,
    });
    expect(m.checks).toHaveLength(13);
    expect(m.checks[0]).toEqual({
      id: 'place',
      name: 'Place order',
      method: 'POST',
      path: '/orders/regular',
      status: 'fail',
      checkedAt: '07:38:05',
      httpCode: 502,
      latencyMs: 30000,
      latencyNote: 'timeout',
      error: 'Expected 200, got 502 Bad Gateway. Upstream OMS gateway did not respond within 30 s.',
    });
    expect(m.checks.find((c) => c.id === 'cancel')?.method).toBe('DEL');
  });

  it('returns every passed check when expanded', () => {
    const m = toModuleChecks(moduleChecksSeed('cholamandalam', 'open-api', true));
    expect(m.checks).toHaveLength(34);
    expect(m.morePassed).toBe(0);
  });

  it('serves the Open API checks screen for an ETL job (design screen 4)', () => {
    const etl = toModuleChecks(etlChecksSeed('cholamandalam', 'cm-fo'));
    expect(etl).toEqual(toModuleChecks(moduleChecksSeed('cholamandalam', 'open-api', false)));
    expect(etl).toMatchObject({ name: 'Open API', customerShortName: 'Cholamandalam Sec.', morePassed: 21 });
    expect(() => etlChecksSeed('cholamandalam', 'nope')).toThrow();
  });
});
