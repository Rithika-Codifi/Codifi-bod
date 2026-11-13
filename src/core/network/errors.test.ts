import { AxiosError, AxiosHeaders } from 'axios';

import { toAppError } from './errors';

const withStatus = (status: number) =>
  new AxiosError('x', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    data: null,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('toAppError', () => {
  it('maps timeouts', () => {
    expect(toAppError(new AxiosError('t', 'ECONNABORTED')).kind).toBe('timeout');
  });
  it('maps missing response to network', () => {
    expect(toAppError(new AxiosError('n', 'ERR_NETWORK')).kind).toBe('network');
  });
  it('maps http statuses', () => {
    expect(toAppError(withStatus(404)).kind).toBe('not-found');
    expect(toAppError(withStatus(502))).toMatchObject({ kind: 'http', status: 502 });
  });
  it('maps unknown errors', () => {
    expect(toAppError(new Error('boom'))).toEqual({ kind: 'unknown', message: 'boom' });
  });
});
