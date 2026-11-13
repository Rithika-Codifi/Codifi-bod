import { formatDuration, formatHeaderDateIST, formatIndianNumber, formatTimeIST } from './format';

describe('format', () => {
  const now = new Date('2026-11-12T07:42:05+05:30');

  it('formats Indian numbers', () => {
    expect(formatIndianNumber(124880)).toBe('1,24,880');
    expect(formatIndianNumber(30000)).toBe('30,000');
  });

  it('formats IST times', () => {
    expect(formatTimeIST(now)).toBe('07:42');
    expect(formatTimeIST(now, true)).toBe('07:42:05');
  });

  it('formats the header date', () => {
    expect(formatHeaderDateIST(now)).toBe('Thu · 12 Nov 2026 · 07:42 IST');
  });

  it('formats durations', () => {
    expect(formatDuration(228)).toBe('3m 48s');
    expect(formatDuration(42)).toBe('42s');
  });
});
