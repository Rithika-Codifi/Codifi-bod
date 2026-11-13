import { moduleChecksSeed } from '@/mocks/moduleChecks';

import { toModuleChecks } from '../mappers/moduleChecksMapper';

import { buildChecksReportPdf, reportFileName } from './PdfChecksReportExporter';

describe('PdfChecksReportExporter', () => {
  const report = toModuleChecks(moduleChecksSeed('cholamandalam', 'open-api', true));
  const now = new Date('2026-11-12T07:42:00+05:30');

  it('names the file after customer, module and IST date', () => {
    expect(reportFileName(report, now)).toBe('bod-report-cholamandalam-open-api-2026-11-12.pdf');
  });

  it('builds a PDF with the summary, failures and every check', async () => {
    const doc = await buildChecksReportPdf(report, now);
    const text = new TextDecoder('latin1').decode(doc.output('arraybuffer'));
    expect(text.startsWith('%PDF-')).toBe(true);
    for (const s of [
      'Open API checks',
      'FAILED',
      '2 failed',
      '1 warning',
      '31 passed',
      'Place order',
      'Logout',
    ]) {
      expect(text).toContain(s);
    }
  });
});
