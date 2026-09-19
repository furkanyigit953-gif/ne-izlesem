'use client';

import React, { memo } from 'react';
import { getImdbRatingClasses, getPosterSrc } from '../lib/homeShared';
import { MovieItem } from '../types/movie';
import MediaPoster from './media/MediaPoster';

interface MovieCardProps {
  item: MovieItem;
  isFav: boolean;
  onSelect: (item: MovieItem) => void;
  onToggleFav: (item: MovieItem) => void;
  renderLogo?: (key: string) => React.ReactNode;
}

const IconHeart = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
  </svg>
);

const IconPlay = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
  </svg>
);

const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const MovieCard: React.FC<MovieCardProps> = memo(({
  item,
  isFav,
  onSelect,
  onToggleFav,
}) => {
  const posterSrc = getPosterSrc(
    (item as MovieItem & { poster_path?: string | null }).poster_path
      ? `https://image.tmdb.org/t/p/w500${(item as MovieItem & { poster_path?: string | null }).poster_path}`
      : item.posterUrl
  );

  const primaryGenres = item.genre
    ? item.genre
        .split(',')
        .slice(0, 2)
        .map((g) => g.trim())
        .join(' • ')
    : '';

  const imdbValue = item.imdb && item.imdb !== '0' ? item.imdb : '—';
  const ratingTone = getImdbRatingClasses(imdbValue === '—' ? '0' : imdbValue);

  return (
    <article
      onClick={() => onSelect(item)}
      className="group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[var(--card)] shadow-[0_16px_50px_rgba(0,0,0,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:bg-[var(--card-hover)] hover:shadow-[0_20px_60px_rgba(34,211,238,0.12)]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#08111b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.18),transparent_34%),linear-gradient(180deg,#0b1b2c_0%,#07101d_52%,#030811_100%)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <IconPlay />
          </div>
          <span className="max-w-[80%] text-[11px] font-semibold leading-relaxed text-slate-200/80 line-clamp-3">
            {item.title}
          </span>
        </div>

        <MediaPoster src={posterSrc} alt={item.title} width={0} height={0} className="absolute inset-0 z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.045]" />

        <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-[#040a12]/90 via-[#040a12]/20 to-transparent opacity-90" />

        <div className="absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1.5 text-[10px] font-black shadow-lg backdrop-blur-md">
          <span className={`text-sm leading-none ${ratingTone}`}>★</span>
          <span className="text-[9px] uppercase tracking-[0.14em] text-slate-300">IMDb</span>
          <strong className={`text-sm leading-none ${ratingTone}`}>{imdbValue}</strong>
        </div>

        <div className={`absolute right-2.5 top-2.5 z-20 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] backdrop-blur-md ${item.contentType === 'Dizi' ? 'border-sky-300/35 bg-sky-950/70 text-sky-200' : 'border-amber-300/35 bg-amber-950/70 text-amber-100'}`}>
          {item.contentType}
        </div>

        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/95 px-4 py-2.5 text-[11px] font-black text-slate-900 shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-white active:scale-95"
          >
            <IconPlay />
            Detayları Gör
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between border-t border-white/10 bg-[var(--card-subtle)] p-3.5">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-bold text-slate-300">
              {item.year || '—'} <span className="px-1 text-slate-600">•</span> {primaryGenres || item.genre || 'Yapım'}
            </span>
          </div>

          <h3 className="truncate text-[13px] font-extrabold leading-snug text-white transition-colors duration-200 group-hover:text-cyan-300">
            {item.title}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(item);
            }}
            title="Favorilere ekle veya çıkar"
            aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all duration-200 ${
              isFav
                ? 'bg-rose-400/15 text-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.15)]'
                : 'text-slate-400 hover:bg-amber-400/10 hover:text-amber-200'
            }`}
          >
            <IconHeart filled={isFav} />
            {isFav ? 'Favoride' : 'Favori'}
          </button>

          <span className="flex items-center gap-1 text-[10px] font-extrabold text-cyan-300 transition-transform duration-200 group-hover:translate-x-0.5">
            Detay
            <IconArrow />
          </span>
        </div>
      </div>
    </article>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;