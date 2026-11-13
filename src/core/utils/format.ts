import { IST_TIME_ZONE } from '@/core/config/constants';

const indian = new Intl.NumberFormat('en-IN');

/** 124880 → "1,24,880" */
export const formatIndianNumber = (n: number): string => indian.format(n);

/** Date → "07:42" (or "07:42:05" with seconds) in IST. */
export function formatTimeIST(date: Date, withSeconds = false): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: IST_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: false,
  }).format(date);
}

/** Date → "Thu · 12 Nov 2026 · 07:42 IST" */
export function formatHeaderDateIST(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST_TIME_ZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('weekday')} · ${get('day')} ${get('month')} ${get('year')} · ${formatTimeIST(date)} IST`;
}

/** 228 → "3m 48s" */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
