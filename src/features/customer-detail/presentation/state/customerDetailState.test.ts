import { toCustomerDetail } from '@/features/customer-detail/data';
import { customerDetailSeed } from '@/mocks/customerDetail';

import { selectCustomerDetail } from './customerDetailState';

const detail = toCustomerDetail(customerDetailSeed('cholamandalam'));

describe('selectCustomerDetail', () => {
  it('builds header copy and stats as in the design', () => {
    const m = selectCustomerDetail(detail, new Set());
    expect(m.header.segments).toBe('NSE · BSE · MCX · Web · Mobile · API');
    expect(m.header.strip).toEqual([
      { label: 'ETL', value: 6, suffix: '/8' },
      { label: 'Modules', value: 7, suffix: '/9' },
      { label: 'Last run', value: '07:38' },
    ]);
    expect(m.header.reportHref).toBe('/reports/4812');
    expect(m.header.retestJobIds).toEqual(['cm-fo', 'limits']);
    expect(m.modules[0]).toMatchObject({
      count: '31/34',
      status: 'fail',
      href: '/customers/cholamandalam/modules/open-api',
    });
    expect(m.etl[1]).toMatchObject({ status: 'fail', metaIsError: true });
  });

  it('overlays running jobs optimistically', () => {
    const m = selectCustomerDetail(detail, new Set(['cm-fo']));
    expect(m.etl[1]).toMatchObject({
      status: 'running',
      meta: 'Retest in progress…',
      running: true,
      metaIsError: false,
    });
    expect(m.header.retestJobIds).toEqual(['limits']);
  });
});
