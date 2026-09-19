'use client';

import Header from '../components/Header';

export const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9\\s]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();

export const renderPlatformLogo = (key: string) => {
  switch (key) {
    case 'netflix':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#E50914] bg-black/80 px-2 py-0.5 rounded border border-[#E50914]/40 shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span> Netflix
        </span>
      );
    case 'prime':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#00A8E1] bg-[#001428] px-2 py-0.5 rounded border border-[#00A8E1]/40 shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E1]"></span> Prime
        </span>
      );
    case 'max':
      return (
        <span className="font-black text-[10px] tracking-tight text-white bg-blue-700 px-2 py-0.5 rounded shadow-sm">
          MAX
        </span>
      );
    case 'blutv':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#00D1FF] bg-[#021827] px-2 py-0.5 rounded border border-[#00D1FF]/40 shadow-sm">
          BluTV
        </span>
      );
    case 'disney':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#113CCF] bg-white px-2 py-0.5 rounded shadow-sm">
          Disney+
        </span>
      );
    default:
      return (
        <span className="font-bold text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
          ▶ İzle
        </span>
      );
  }
};

export const ROULETTE_CARD_WIDTH = 190;
export const ROULETTE_GAP = 16;
export const ROULETTE_TOTAL_WIDTH = ROULETTE_CARD_WIDTH + ROULETTE_GAP;
export const ROULETTE_CENTER_INDEX = 4;

export const getPosterSrc = (posterUrl?: string) => {
  if (!posterUrl) return '';

  const raw = posterUrl.trim();
  if (!raw) return '';

  if (raw.startsWith('/api/poster')) {
    return raw;
  }

  let normalized = raw;
  if (!/^https?:\/\//i.test(normalized)) {
    const cleaned = normalized.startsWith('/') ? normalized : `/${normalized}`;
    normalized = `https://image.tmdb.org/t/p/w500${cleaned}`;
  }

  if (normalized.includes('image.tmdb.org') || normalized.includes('media.themoviedb.org')) {
    return `/api/poster?url=${encodeURIComponent(normalized)}`;
  }

  return normalized;
};

export const IconSparkles = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2.75l1.3 4.95a3.2 3.2 0 0 0 2.25 2.25L20.5 11.25l-4.95 1.3a3.2 3.2 0 0 0-2.25 2.25L12 19.75l-1.3-4.95a3.2 3.2 0 0 0-2.25-2.25l-4.95-1.3 4.95-1.3a3.2 3.2 0 0 0 2.25-2.25L12 2.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    <path d="M19 3.5v3M20.5 5h-3M5 17.5v3M6.5 19H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconStar = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.7 2.82 5.72 6.31.92-4.56 4.44 1.08 6.28L12 17.08l-5.65 2.98 1.08-6.28-4.56-4.44 6.31-.92L12 2.7Z"/>
  </svg>
);

export const IconFilm = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M8 3v18M16 3v18M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const IconTv = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
    <path d="m9 21 1.4-3h3.2L15 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

export const IconSearch = ({ className = 'w-7 h-7' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const getImdbRatingClasses = (imdb?: string | number) => {
  const raw = Number.parseFloat(String(imdb ?? '0'));

  if (Number.isNaN(raw)) return 'text-slate-300';
  if (raw >= 8) return 'text-emerald-300';
  if (raw >= 7) return 'text-amber-300';
  if (raw >= 6) return 'text-orange-300';
  return 'text-rose-300';
};

export const getImdbRatingLabel = (imdb?: string | number) => {
  const raw = Number.parseFloat(String(imdb ?? '0'));
  if (Number.isNaN(raw)) return 'IMDb —';
  return `★ ${raw.toFixed(1)} IMDb`;
};
