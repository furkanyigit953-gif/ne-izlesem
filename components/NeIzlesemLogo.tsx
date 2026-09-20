'use client';

type NeIzlesemLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function NeIzlesemLogo({
  compact = false,
  className = '',
}: NeIzlesemLogoProps) {
  const id = compact ? 'neizlesem-compact' : 'neizlesem-full';

  return (
    <svg
      viewBox={compact ? '0 0 72 72' : '0 0 330 86'}
      className={className}
      role="img"
      aria-label="Ne İzlesem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-text`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22f5d0" />
          <stop offset="28%" stopColor="#20b8ff" />
          <stop offset="52%" stopColor="#7566ff" />
          <stop offset="76%" stopColor="#e75be8" />
          <stop offset="100%" stopColor="#ffb52e" />
        </linearGradient>

        <linearGradient id={`${id}-film`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18f1d0" />
          <stop offset="48%" stopColor="#267eff" />
          <stop offset="100%" stopColor="#c73cff" />
        </linearGradient>

        <linearGradient id={`${id}-play`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2b0" />
          <stop offset="45%" stopColor="#ffbd55" />
          <stop offset="100%" stopColor="#ff7b22" />
        </linearGradient>

        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {compact ? (
        <g transform="translate(5 4)">
          <path
            d="M31 3C20 3 12 11 12 22v26c0 6-2 10-7 14 11-2 19-8 19-20V24c0-8 3-13 7-16Z"
            fill={`url(#${id}-film)`}
            filter={`url(#${id}-glow)`}
          />
          <path
            d="M38 3c12 1 19 9 19 21v25c0 6 2 10 7 13-12-1-20-8-20-20V24c0-8-2-14-6-17Z"
            fill={`url(#${id}-film)`}
            opacity=".82"
            filter={`url(#${id}-glow)`}
          />
          <g fill="#050811" opacity=".95">
            <rect x="14" y="11" width="6" height="5" rx="1" transform="skewX(-7)" />
            <rect x="14" y="20" width="6" height="5" rx="1" transform="skewX(-7)" />
            <rect x="14" y="29" width="6" height="5" rx="1" transform="skewX(-7)" />
            <rect x="43" y="11" width="6" height="5" rx="1" transform="skewX(7)" />
            <rect x="43" y="20" width="6" height="5" rx="1" transform="skewX(7)" />
            <rect x="43" y="29" width="6" height="5" rx="1" transform="skewX(7)" />
          </g>
          <path
            d="M29 20 43 28 29 36Z"
            fill={`url(#${id}-play)`}
            stroke="#ffe4a0"
            strokeWidth="1"
            filter={`url(#${id}-glow)`}
          />
        </g>
      ) : (
        <g>
          <g transform="translate(8 3)">
            <path
              d="M38 4C25 4 16 14 16 28v29c0 7-3 12-9 17 15-2 25-11 25-27V30c0-10 3-17 10-22Z"
              fill={`url(#${id}-film)`}
              filter={`url(#${id}-glow)`}
            />
            <path
              d="M48 4c15 1 25 11 25 27v27c0 7 3 12 10 16-16-1-27-10-27-26V31c0-11-3-19-8-24Z"
              fill={`url(#${id}-film)`}
              opacity=".82"
              filter={`url(#${id}-glow)`}
            />

            <g fill="#050811" opacity=".96">
              <rect x="19" y="12" width="8" height="6" rx="1" transform="skewX(-8)" />
              <rect x="18" y="23" width="8" height="6" rx="1" transform="skewX(-8)" />
              <rect x="18" y="34" width="8" height="6" rx="1" transform="skewX(-8)" />
              <rect x="17" y="45" width="8" height="6" rx="1" transform="skewX(-8)" />

              <rect x="58" y="12" width="8" height="6" rx="1" transform="skewX(8)" />
              <rect x="59" y="23" width="8" height="6" rx="1" transform="skewX(8)" />
              <rect x="59" y="34" width="8" height="6" rx="1" transform="skewX(8)" />
              <rect x="60" y="45" width="8" height="6" rx="1" transform="skewX(8)" />
            </g>

            <path
              d="M40 25 58 36 40 47Z"
              fill={`url(#${id}-play)`}
              stroke="#ffe7ad"
              strokeWidth="1.1"
              filter={`url(#${id}-glow)`}
            />
          </g>

          <text
            x="164"
            y="78"
            textAnchor="middle"
            fill={`url(#${id}-text)`}
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontSize="48"
            fontWeight="900"
            letterSpacing="-2.7"
            filter={`url(#${id}-glow)`}
          >
            neizlesem
          </text>
          <text
            x="164"
            y="78"
            textAnchor="middle"
            fill="none"
            stroke="rgba(255,255,255,.18)"
            strokeWidth=".7"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontSize="48"
            fontWeight="900"
            letterSpacing="-2.7"
          >
            neizlesem
          </text>
        </g>
      )}
    </svg>
  );
}
