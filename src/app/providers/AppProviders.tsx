import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { createContainer, DIProvider, type Container } from '@/app/di';

import { createQueryClient } from './queryClient';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children, container }: { children: ReactNode; container?: Container }) {
  const [queryClient] = useState(createQueryClient);
  const [di] = useState(() => container ?? createContainer());
  return (
    <DIProvider container={di}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </DIProvider>
  );
}
