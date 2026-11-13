import type { ReactNode, SVGProps } from 'react';

/** Icons copied verbatim from docs/design/source (24×24 viewBox). */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

function Svg({ size = 20, strokeWidth = 1.8, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const GridIcon = (p: IconProps) => (
  <Svg strokeLinecap={undefined} {...p}>
    <rect x="4" y="4" width="7" height="7" />
    <rect x="13" y="4" width="7" height="7" />
    <rect x="4" y="13" width="7" height="7" />
    <rect x="13" y="13" width="7" height="7" />
  </Svg>
);

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M18 14.5c1.8.8 3 2.9 3 5.5" />
  </Svg>
);

export const ReportIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h7" />
    <path d="M9 17h5" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg size={22} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg size={16} strokeWidth={2} {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg size={14} strokeWidth={2} {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg size={18} {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v5h-5" />
  </Svg>
);

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 21h4" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg size={18} strokeLinejoin={undefined} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
);

export const DownloadIcon = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M12 4v11" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 20h14" />
  </Svg>
);

export const ShareIcon = (p: IconProps) => (
  <Svg size={16} {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.2 10.8l7.6-3.6" />
    <path d="M8.2 13.2l7.6 3.6" />
  </Svg>
);

/* Status glyphs (white, drawn inside StatusIcon). */
export const CrossGlyph = (p: IconProps) => (
  <Svg strokeLinejoin={undefined} {...p}>
    <path d="M7 7l10 10" />
    <path d="M17 7L7 17" />
  </Svg>
);

export const BangGlyph = ({ large, ...p }: IconProps & { large?: boolean }) => (
  <Svg strokeLinejoin={undefined} {...p}>
    {large ? (
      <>
        <path d="M12 6v8" />
        <path d="M12 18.5v.01" />
      </>
    ) : (
      <>
        <path d="M12 5v9" />
        <path d="M12 19v.01" />
      </>
    )}
  </Svg>
);

export const CheckGlyph = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <rect x="0" y="0" width="30" height="30" className="fill-logo-bg" />
      <circle cx="8" cy="15" r="3.2" className="fill-logo-red" />
      <circle cx="15" cy="15" r="3.2" className="fill-logo-amber" />
      <circle cx="22" cy="15" r="3.2" className="fill-logo-green" />
    </svg>
  );
}
