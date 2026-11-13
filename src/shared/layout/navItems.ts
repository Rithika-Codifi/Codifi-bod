import type { ComponentType } from 'react';

import { GridIcon, UsersIcon } from '@/shared/ui/icons';
// import { ReportIcon } from '@/shared/ui/icons'; // disabled for now (Reports tab)

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  /** Active only on an exact match. */
  end: boolean;
  /** Path prefix that marks the item active, when it differs from `to`. */
  match?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Overview', icon: GridIcon, end: true },
  { to: '/customers', label: 'Customers', icon: UsersIcon, end: false },
  // disabled for now — /reports/:runId and every report link keep working.
  // { to: '/reports/latest', label: 'Reports', icon: ReportIcon, end: false, match: '/reports' },
];

export function isNavActive(item: NavItem, pathname: string): boolean {
  const base = item.match ?? item.to;
  return item.end ? pathname === base : pathname === base || pathname.startsWith(`${base}/`);
}
