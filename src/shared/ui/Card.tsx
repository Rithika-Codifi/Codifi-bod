import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/core/utils';

/** White card, 1px border, square corners, no shadow. */
export function Card({
  as: Tag = 'section',
  className,
  children,
  ...rest
}: {
  as?: 'section' | 'div' | 'article';
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn('border border-border bg-surface', className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Serif section title + mono label on the right. Padding comes from the screen. */
export function SectionHeader({
  title,
  right,
  layout = 'between',
  rightClassName = 'text-subtle',
  className,
  as: Heading = 'h2',
}: {
  title: ReactNode;
  right?: ReactNode;
  /** 'between' = right label pushed to the edge; 'inline' = label next to the title (10px gap). */
  layout?: 'between' | 'inline';
  rightClassName?: string;
  className?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <div
      className={cn(
        'flex items-baseline',
        layout === 'between' ? 'justify-between' : 'gap-[10px]',
        className,
      )}
    >
      <Heading className="m-0 font-serif text-[20px] font-normal">{title}</Heading>
      {right != null && <span className={cn('font-mono text-[11px]', rightClassName)}>{right}</span>}
    </div>
  );
}

/** Mono uppercase label used across cards. */
export function Label({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono uppercase', className)}>{children}</span>;
}
