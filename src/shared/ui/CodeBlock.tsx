import { cn } from '@/core/utils';

/** Dark log block that keeps line breaks. */
export function CodeBlock({ children, className }: { children: string; className?: string }) {
  return (
    <pre
      className={cn(
        'm-0 bg-code-bg px-[12px] py-[10px] font-mono text-[11px] leading-[1.55] break-words whitespace-pre-wrap text-code-text',
        className,
      )}
    >
      {children}
    </pre>
  );
}
