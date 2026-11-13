/** Wall-clock time in IST, stored as "HH:mm" or "HH:mm:ss". */
export type TimeIST = string & { readonly __brand: 'TimeIST' };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export function timeIST(value: string): TimeIST {
  if (!TIME_RE.test(value)) throw new Error(`Invalid IST time: ${value}`);
  return value as TimeIST;
}

export function minutesOf(t: TimeIST): number {
  const [h = 0, m = 0] = t.split(':').map(Number);
  return h * 60 + m;
}
