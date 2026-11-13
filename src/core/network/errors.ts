import { isAxiosError } from 'axios';

import type { AppError } from '@/core/domain';

export function toAppError(e: unknown): AppError {
  if (isAxiosError(e)) {
    if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
      return { kind: 'timeout', message: 'The request timed out. Try again.' };
    }
    if (!e.response) {
      return { kind: 'network', message: 'Network unavailable. Check your connection.' };
    }
    const status = e.response.status;
    if (status === 404) return { kind: 'not-found', status, message: 'Not found.' };
    if (status === 401 || status === 403) return { kind: 'unauthorized', status, message: 'Not authorised.' };
    return { kind: 'http', status, message: `Server error (${status}).` };
  }
  return { kind: 'unknown', message: e instanceof Error ? e.message : 'Something went wrong.' };
}
