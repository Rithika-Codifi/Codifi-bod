import { createContainer, type Container } from '@/app/di';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K] };

/** Mock-mode container with per-feature overrides for tests. */
export function testContainer(overrides: DeepPartial<Container> = {}): Container {
  const base = createContainer(true);
  const merged = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    const current = (base as unknown as Record<string, unknown>)[key];
    merged[key] =
      value && typeof value === 'object' && current && typeof current === 'object'
        ? { ...current, ...value }
        : value;
  }
  return merged as unknown as Container;
}
