import { timeIST, type Status, type TimeIST } from '@/core/domain';
import { formatTimeIST } from '@/core/utils';

/** Status as sent by the API. */
export type StatusDto = 'FAILED' | 'WARNING' | 'PASSED' | 'RUNNING';

const STATUS: Record<StatusDto, Status> = {
  FAILED: 'fail',
  WARNING: 'warn',
  PASSED: 'pass',
  RUNNING: 'running',
};

export const statusFromDto = (s: StatusDto): Status => STATUS[s];

/** ISO 8601 timestamp → IST wall-clock time ("07:38", or "07:38:05" with seconds). */
export const istTimeFromIso = (iso: string, withSeconds = false): TimeIST =>
  timeIST(formatTimeIST(new Date(iso), withSeconds));
