import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/core/utils';
import { Logo } from '@/shared/ui/icons';

import { isNavActive, NAV_ITEMS } from './navItems';
import { ThemeSwitch, type ThemeChoice } from './ThemeSwitch';

export interface SideNavProps {
  className?: string;
  theme: ThemeChoice;
  onThemeChange: (theme: ThemeChoice) => void;
}

export function SideNav({ className, theme, onThemeChange }: SideNavProps) {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className={cn(
        'sticky top-0 h-dvh w-[232px] flex-none flex-col border-r border-border bg-surface-muted',
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-[10px] border-b border-border px-[20px] py-[16px]">
        <Logo />
        <span className="font-serif text-[20px] leading-[1.1]">BOD Monitor</span>
      </Link>
      <ul className="flex flex-col py-[8px]">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-[48px] items-center gap-[12px] border-l-2 px-[18px]',
                  active ? 'border-accent bg-highlight text-text' : 'border-transparent text-muted',
                )}
              >
                <Icon size={20} />
                <span
                  className={cn('font-mono text-[10.5px] tracking-[0.1em] uppercase', active && 'font-bold')}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto px-[20px] pb-[20px]">
        <span className="mb-[8px] block font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          Theme
        </span>
        <ThemeSwitch value={theme} onChange={onThemeChange} />
      </div>
    </nav>
  );
}
