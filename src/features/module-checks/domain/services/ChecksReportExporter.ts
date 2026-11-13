import type { ModuleChecks } from '../entities';

/** Turns a checks report into a downloadable file. Implemented in the data layer (PDF). */
export interface ChecksReportExporter {
  /** Builds the file and hands it to the browser as a download; resolves with the file name. */
  download(report: ModuleChecks, generatedAt: Date): Promise<string>;
}
