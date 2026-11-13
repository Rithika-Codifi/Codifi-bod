export const overviewQueryKeys = {
  all: ['overview'] as const,
  snapshot: () => [...overviewQueryKeys.all, 'snapshot'] as const,
};
