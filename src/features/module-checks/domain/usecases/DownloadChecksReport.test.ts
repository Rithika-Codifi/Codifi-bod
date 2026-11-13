import { timeIST } from '@/core/domain';

import type { ApiCheck, ModuleChecks } from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';
import type { ChecksReportExporter } from '../services/ChecksReportExporter';

import { DownloadChecksReport } from './DownloadChecksReport';

const check = (id: string, status: ApiCheck['status']): ApiCheck => ({
  id,
  name: id,
  method: 'GET',
  path: '/',
  status,
  checkedAt: timeIST('07:38:05'),
  httpCode: 200,
  latencyMs: 1,
  latencyNote: '',
  error: '',
});

const report: ModuleChecks = {
  customerId: 'cholamandalam',
  customerShortName: 'Cholamandalam Sec.',
  source: { kind: 'module', id: 'open-api' },
  name: 'Open API',
  lastCheck: timeIST('07:38:12'),
  avgLatencyMs: 182,
  latestRunId: '4812',
  checks: [check('p', 'pass'), check('f', 'fail'), check('w', 'warn')],
  morePassed: 0,
};

describe('DownloadChecksReport', () => {
  it('fetches every check (all passed included) and exports failures first', async () => {
    const getModuleChecks = vi.fn().mockResolvedValue(report);
    const getEtlChecks = vi.fn().mockResolvedValue(report);
    const repo = { getModuleChecks, getEtlChecks, retestChecks: vi.fn() } as ModuleChecksRepository;
    const download = vi.fn<ChecksReportExporter['download']>().mockResolvedValue('file.pdf');
    const now = new Date('2026-11-12T07:42:00+05:30');

    await expect(
      new DownloadChecksReport(repo, { download }).execute(
        'cholamandalam',
        { kind: 'module', id: 'open-api' },
        now,
      ),
    ).resolves.toBe('file.pdf');
    expect(getModuleChecks).toHaveBeenCalledWith('cholamandalam', 'open-api', { allPassed: true });
    expect(download.mock.calls[0]?.[0].checks.map((c) => c.id)).toEqual(['f', 'w', 'p']);

    await new DownloadChecksReport(repo, { download }).execute(
      'cholamandalam',
      { kind: 'etl', id: 'cm-fo' },
      now,
    );
    expect(getEtlChecks).toHaveBeenCalledWith('cholamandalam', 'cm-fo', { allPassed: true });
  });
});
