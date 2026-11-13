export const customerDetailQueryKeys = {
  all: ['customer-detail'] as const,
  detail: (customerId: string) => [...customerDetailQueryKeys.all, customerId] as const,
  retest: (customerId: string) => [...customerDetailQueryKeys.all, customerId, 'retest'] as const,
};
