import { AppShell } from '@/shared/layout';

import { useThemeStore } from './providers/themeStore';

/** Connects the shell to app-level UI state (theme). */
export function AppLayout() {
  const theme = useThemeStore((s) => s.preference);
  const setTheme = useThemeStore((s) => s.setPreference);
  return <AppShell theme={theme} onThemeChange={setTheme} />;
}
