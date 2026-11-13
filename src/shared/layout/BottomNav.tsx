import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/core/utils';

import { isNavActive, NAV_ITEMS } from './navItems';

export function BottomNav({ className }: { className?: string }) {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, minmax(0, 1fr))` }}
      className={cn(
        'sticky bottom-0 z-20 mt-auto grid border-t border-border bg-surface-muted pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-[64px] flex-col items-center justify-center gap-[4px] border-t-2',
              active ? 'border-accent bg-highlight text-text' : 'border-transparent text-muted',
            )}
          >
            <Icon size={20} />
            <span className={cn('font-mono text-[10.5px] tracking-[0.1em] uppercase', active && 'font-bold')}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
