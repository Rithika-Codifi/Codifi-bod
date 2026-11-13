import { useId } from 'react';

import { cn } from '@/core/utils';

import { SearchIcon } from './icons';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, label, className }: SearchInputProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex h-[46px] items-center gap-[10px] border border-border bg-surface px-[14px] focus-within:outline-2 focus-within:outline-accent',
        className,
      )}
    >
      <SearchIcon size={18} className="text-muted" />
      <span className="sr-only">{label}</span>
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-auto border-0 bg-transparent font-sans text-[14px] text-text outline-none"
      />
    </label>
  );
}
