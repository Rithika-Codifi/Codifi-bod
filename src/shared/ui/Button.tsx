import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/core/utils';

import { Spinner } from './Spinner';

const VARIANT = {
  primary: 'border-0 bg-dark text-on-dark hover:text-on-dark',
  secondary: 'border border-dark bg-surface text-text hover:text-text',
  /** Secondary on transparent background (header actions). */
  outline: 'border border-dark bg-transparent text-text hover:text-text',
} as const;

const SIZE = {
  /** Header/card action pairs: 46px, 11.5px, 0.1em. */
  md: 'h-[46px] gap-[8px] text-[11.5px] tracking-[0.1em]',
  /** Bottom action bar: 48px, 11px, 0.08em. */
  bar: 'h-[48px] gap-[6px] text-[11px] tracking-[0.08em]',
} as const;

interface CommonProps {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  icon?: ReactNode;
  loading?: boolean;
  /** Stretch in a full-width pair (flex: 1 1 0). */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}

const classes = ({ variant = 'primary', size = 'md', fill, className }: CommonProps) =>
  cn(
    'box-border flex items-center justify-center font-mono font-bold uppercase disabled:cursor-not-allowed',
    VARIANT[variant],
    SIZE[size],
    fill && 'flex-[1_1_0]',
    className,
  );

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    icon,
    loading,
    fill,
    className,
    children,
    type = 'button',
    disabled,
    ...rest
  } = props;
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes({ variant, size, fill, className, children })}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : icon}
      {children}
    </button>
  );
}

export function LinkButton(props: CommonProps & { to: string }) {
  const { to, icon, children } = props;
  return (
    <Link to={to} className={classes(props)}>
      {icon}
      {children}
    </Link>
  );
}

/** 44×44 transparent icon button (refresh, bell, per-row retest). */
export function IconButton({
  label,
  className,
  children,
  type = 'button',
  ...rest
}: { label: string; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'relative flex size-[44px] flex-none items-center justify-center border-0 bg-transparent text-text',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
