import type { StatusDto } from '@/core/network';
import type { CustomerListDto } from '@/features/customers/data/dto/CustomerDto';

const at = (hhmm: string) => `2026-11-12T${hhmm}:00+05:30`;

/** Seed identical to docs/design/source/2-customers.html. */
const raw: [
  name: string,
  slug: string,
  code: string,
  status: StatusDto,
  etl: string,
  api: string,
  time: string,
][] = [
  ['Cholamandalam Securities', 'cholamandalam', 'CUST-004', 'FAILED', '6/8', '31/34', '07:38'],
  ['Nirmal Bang', 'nirmal-bang', 'CUST-012', 'FAILED', '8/8', '40/44', '07:36'],
  ['Alice Blue', 'alice-blue', 'CUST-003', 'WARNING', '7/8', '38/38', '07:20'],
  ['Goodwill', 'goodwill', 'CUST-005', 'WARNING', '8/8', '35/36', '07:34'],
  ['Findoc', 'findoc', 'CUST-015', 'WARNING', '7/8', '29/29', '06:44'],
  ['Trustline Securities', 'trustline', 'CUST-001', 'PASSED', '8/8', '42/42', '07:39'],
  ['Aditya Birla Money (ABML)', 'abml', 'CUST-002', 'PASSED', '8/8', '36/36', '07:39'],
  ['GoPocket', 'gopocket', 'CUST-006', 'PASSED', '8/8', '30/30', '07:38'],
  ['Jainam Broking', 'jainam', 'CUST-007', 'PASSED', '8/8', '34/34', '07:38'],
  ['IIFL', 'iifl', 'CUST-008', 'PASSED', '8/8', '44/44', '07:37'],
  ['Integrated', 'integrated', 'CUST-009', 'PASSED', '8/8', '31/31', '07:37'],
  ['Rmoney', 'rmoney', 'CUST-010', 'PASSED', '8/8', '28/28', '07:37'],
  ['Muthoot Securities', 'muthoot', 'CUST-011', 'PASSED', '8/8', '26/26', '07:36'],
  ['Religare Broking', 'religare', 'CUST-013', 'PASSED', '8/8', '40/40', '07:36'],
  ['Bajaj Broking', 'bajaj', 'CUST-014', 'PASSED', '8/8', '38/38', '07:35'],
  ['Indira Securities', 'indira', 'CUST-016', 'PASSED', '8/8', '33/33', '07:35'],
  ['Jio BlackRock Broking', 'jio-blackrock', 'CUST-017', 'PASSED', '8/8', '36/36', '07:34'],
];

const ratio = (s: string) => s.split('/').map(Number) as [number, number];

export const customersSeed: CustomerListDto = {
  updated_at: at('07:42'),
  customers: raw.map(([name, slug, code, status, etl, api, time]) => {
    const [etlOk, etlTotal] = ratio(etl);
    const [apiOk, apiTotal] = ratio(api);
    return {
      slug,
      code,
      name,
      status,
      etl_passed: etlOk,
      etl_total: etlTotal,
      api_passed: apiOk,
      api_total: apiTotal,
      last_check_at: at(time),
    };
  }),
};
