export const reportQueryKeys = {
  all: ['reports'] as const,
  run: (runId: string) => [...reportQueryKeys.all, runId] as const,
};
