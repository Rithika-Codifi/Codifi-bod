import { MOCK_DELAY_MS } from '@/core/config/constants';

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockLatency = () =>
  delay(MOCK_DELAY_MS.min + Math.round(Math.random() * (MOCK_DELAY_MS.max - MOCK_DELAY_MS.min)));
