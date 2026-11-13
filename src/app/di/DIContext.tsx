import { createContext, useContext, type ReactNode } from 'react';

import type { Container } from './container';

const DIContext = createContext<Container | null>(null);

export function DIProvider({ container, children }: { container: Container; children: ReactNode }) {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDI(): Container {
  const container = useContext(DIContext);
  if (!container) throw new Error('useDI must be used inside <DIProvider>');
  return container;
}
