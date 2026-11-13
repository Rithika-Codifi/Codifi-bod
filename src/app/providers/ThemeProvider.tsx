import { useEffect, type ReactNode } from 'react';

import { useMediaQuery } from '@/shared/hooks';

import { useThemeStore } from './themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemeStore((s) => s.preference);
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#171512' : '#1C1A17');
  }, [theme]);

  return children;
}
