import axios, { type AxiosInstance } from 'axios';

import { HTTP_TIMEOUT_MS } from '@/core/config/constants';
import { env } from '@/core/config/env';

import { toAppError } from './errors';

export function createHttpClient(baseURL: string = env.apiBaseUrl): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: HTTP_TIMEOUT_MS,
    headers: { Accept: 'application/json' },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toAppError(error)),
  );

  return client;
}
