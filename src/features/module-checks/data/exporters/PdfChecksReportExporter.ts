import type { jsPDF as JsPdf } from 'jspdf';

import type { Status } from '@/core/domain';
import { formatHeaderDateIST } from '@/core/utils';

import {
  countChecks,
  latencyLabel,
  moduleChecksStatus,
  type ChecksReportExporter,
  type ModuleChecks,
} from '../../domain';

type Rgb = [number, number, number];

const LABEL: Record<Status, string> = { fail: 'FAILED', warn: 'WARNING', pass: 'PASSED', running: 'RUNNING' };

/** Light-theme design tokens, read from tokens.css (no colours are hard-coded here). */
function readPalette() {
  const probe = document.createElement('div');
  probe.dataset.theme = 'light';
  probe.hidden = true;
  document.body.appendChild(probe);
  const css = getComputedStyle(probe);
  const rgb = (name: string): Rgb => {
    const hex = css.getPropertyValue(name).trim().replace('#', '');
    const n = Number.parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
    return Number.isNaN(n) ? [0, 0, 0] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const palette = {
    text: rgb('--text'),
    muted: rgb('--muted'),
    border: rgb('--border'),
    sunken: rgb('--surface-sunken'),
    ink: {
      fail: rgb('--fail-ink'),
      warn: rgb('--warn-ink'),
      pass: rgb('--pass-ink'),
      running: rgb('--running-ink'),
    },
    solid: { fail: rgb('--fail'), warn: rgb('--warn'), pass: rgb('--pass'), running: rgb('--running') },
    tint: {
      fail: rgb('--fail-tint'),
      warn: rgb('--warn-tint'),
      pass: rgb('--pass-tint'),
      running: rgb('--running-tint'),
    },
  };
  probe.remove();
  return palette;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function reportFileName(report: ModuleChecks, generatedAt: Date): string {
  const day = generatedAt.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  return `bod-report-${slug(report.customerId)}-${slug(report.name)}-${day}.pdf`;
}

/** Builds the report document (A4, portrait). Exported for tests. */
export async function buildChecksReportPdf(report: ModuleChecks, generatedAt: Date): Promise<JsPdf> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const c = readPalette();
  const counts = countChecks(report);
  const status = moduleChecksStatus(counts);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 40;
  const width = doc.internal.pageSize.getWidth() - left * 2;
  let y = 48;

  doc
    .setFont('helvetica', 'normal')
    .setFontSize(9)
    .setTextColor(...c.muted);
  doc.text(`BOD MONITOR · ${report.customerShortName.toUpperCase()}`, left, y);
  doc.text(formatHeaderDateIST(generatedAt).toUpperCase(), left + width, y, { align: 'right' });

  y += 28;
  doc
    .setFont('times', 'normal')
    .setFontSize(24)
    .setTextColor(...c.text);
  doc.text(`${report.name} checks`, left, y);

  // Overall status badge
  const badge = LABEL[status];
  doc.setFont('courier', 'bold').setFontSize(10);
  const bw = doc.getTextWidth(badge) + 16;
  doc
    .setDrawColor(...c.solid[status])
    .setFillColor(...c.tint[status])
    .rect(left + width - bw, y - 16, bw, 20, 'FD');
  doc.setTextColor(...c.ink[status]).text(badge, left + width - bw + 8, y - 2);

  y += 18;
  doc
    .setFont('helvetica', 'normal')
    .setFontSize(10)
    .setTextColor(...c.muted);
  doc.text(
    `Last check ${report.lastCheck} · avg ${report.avgLatencyMs} ms · Run #${report.latestRunId}`,
    left,
    y,
  );

  // Summary bar: failed, warning, passed
  y += 16;
  const parts = (['fail', 'warn', 'pass'] as const).filter((s) => counts[s] > 0);
  let x = left;
  for (const s of parts) {
    const w = (counts[s] / counts.total) * width;
    doc.setFillColor(...c.solid[s]).rect(x, y, w, 16, 'F');
    if (w > 18) {
      doc.setFont('courier', 'bold').setFontSize(9).setTextColor(255, 255, 255);
      doc.text(String(counts[s]), x + w / 2, y + 11.5, { align: 'center' });
    }
    x += w;
  }
  y += 30;
  doc
    .setFont('courier', 'normal')
    .setFontSize(10)
    .setTextColor(...c.text);
  const pct = counts.total ? ((counts.pass / counts.total) * 100).toFixed(1) : '0.0';
  doc.text(
    `${counts.fail} failed · ${counts.warn} warning · ${counts.pass} passed · of ${counts.total} · ${pct}% pass`,
    left,
    y,
  );

  // Failures & warnings
  const issues = report.checks.filter((k) => k.status === 'fail' || k.status === 'warn');
  if (issues.length > 0) {
    y += 28;
    doc
      .setFont('times', 'normal')
      .setFontSize(15)
      .setTextColor(...c.text)
      .text('Failures & warnings', left, y);
    y += 8;
    for (const k of issues) {
      const detail = k.error || (k.status === 'warn' ? `Slower than target: ${latencyLabel(k)}` : '');
      const lines = doc
        .setFont('courier', 'normal')
        .setFontSize(9)
        .splitTextToSize(detail, width - 20) as string[];
      const h = 44 + lines.length * 11;
      if (y + h > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = 48;
      }
      doc
        .setDrawColor(...c.border)
        .setFillColor(255, 255, 255)
        .rect(left, y, width, h, 'FD');
      doc.setFillColor(...c.solid[k.status]).rect(left, y, width, 3, 'F');
      doc
        .setFont('helvetica', 'bold')
        .setFontSize(11)
        .setTextColor(...c.text)
        .text(k.name, left + 10, y + 18);
      doc
        .setFont('courier', 'bold')
        .setFontSize(8)
        .setTextColor(...c.ink[k.status]);
      doc.text(LABEL[k.status], left + width - 10, y + 18, { align: 'right' });
      doc
        .setFont('courier', 'normal')
        .setFontSize(9)
        .setTextColor(...c.muted);
      doc.text(
        `${k.method} ${k.path} · ${k.checkedAt ?? 'just now'} · HTTP ${k.httpCode || '—'}`,
        left + 10,
        y + 32,
      );
      doc.setTextColor(...c.text).text(lines, left + 10, y + 46);
      y += h + 8;
    }
  }

  // All checks
  autoTable(doc, {
    startY: y + 16,
    margin: { left, right: left },
    head: [['Check', 'Request', 'Time', 'HTTP', 'Latency', 'Result']],
    body: report.checks.map((k) => [
      k.name,
      `${k.method} ${k.path}`,
      k.checkedAt ?? 'just now',
      k.httpCode ? String(k.httpCode) : '—',
      latencyLabel(k),
      LABEL[k.status],
    ]),
    styles: {
      font: 'courier',
      fontSize: 8,
      textColor: c.text,
      lineColor: c.border,
      lineWidth: 0.5,
      cellPadding: 5,
    },
    headStyles: { fillColor: c.sunken, textColor: c.muted, fontStyle: 'normal' },
    columnStyles: { 0: { font: 'helvetica' }, 5: { fontStyle: 'bold', halign: 'right' } },
    didParseCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 5) return;
      const s = report.checks[data.row.index]?.status;
      if (s) data.cell.styles.textColor = c.ink[s];
    },
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc
      .setPage(i)
      .setFont('helvetica', 'normal')
      .setFontSize(8)
      .setTextColor(...c.muted);
    doc.text(`Page ${i} of ${pages}`, left + width, doc.internal.pageSize.getHeight() - 20, {
      align: 'right',
    });
  }
  return doc;
}

/** Builds the PDF in the browser and saves it straight to the user's downloads. */
export class PdfChecksReportExporter implements ChecksReportExporter {
  async download(report: ModuleChecks, generatedAt: Date): Promise<string> {
    const doc = await buildChecksReportPdf(report, generatedAt);
    const fileName = reportFileName(report, generatedAt);
    doc.save(fileName);
    return fileName;
  }
}
