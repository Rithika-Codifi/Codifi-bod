export const customersQueryKeys = {
  all: ['customers'] as const,
  list: () => [...customersQueryKeys.all, 'list'] as const,
};
