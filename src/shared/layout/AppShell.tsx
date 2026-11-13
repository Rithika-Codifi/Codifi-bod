import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

import { Toaster } from '@/shared/ui/Toast';

import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';
import { SideNav } from './SideNav';
import type { ThemeChoice } from './ThemeSwitch';

/** Route metadata (`handle`) read by the shell. */
export interface RouteHandle {
  /**
   * Show the bottom nav on mobile/tablet. Only the Overview route sets this; every other screen
   * hides it. The desktop side nav is always shown.
   */
  showBottomNav?: boolean;
}

export function AppShell({
  theme,
  onThemeChange,
}: {
  theme: ThemeChoice;
  onThemeChange: (t: ThemeChoice) => void;
}) {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;
  const showBottomNav = handle?.showBottomNav === true;

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 bg-dark px-[12px] py-[8px] font-mono text-[11px] text-on-dark uppercase focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <SideNav className="hidden lg:flex" theme={theme} onThemeChange={onThemeChange} />
      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <main id="main" className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-[1200px]">
          <Suspense fallback={<div aria-busy="true" className="flex-1" />}>
            <Outlet />
          </Suspense>
        </main>
        {showBottomNav && <BottomNav className="lg:hidden" />}
      </div>
      <Toaster />
    </div>
  );
}
