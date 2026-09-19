'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { getPosterSrc, renderPlatformLogo } from '../lib/homeShared';
import { MovieItem } from '../types/movie';

interface WheelProps {
  movies: MovieItem[];
  activeType?: 'Film' | 'Dizi' | null;
  selectedGenre?: string | null;
  minRating?: string;
  selectedPlatform?: string;
  onlyNew?: boolean;
  onSelectMovie: (movie: MovieItem) => void;
  onSpinChange?: (spinning: boolean) => void;
  onTypeChange?: (type: 'Film' | 'Dizi' | null) => void;
  onGenreChange?: (genre: string | null) => void;
  onPlatformChange?: (platform: string) => void;
  onRatingChange?: (rating: string) => void;
  onOnlyNewChange?: (onlyNew: boolean) => void;
}

const CARD_WIDTH = 180;
const GAP = 14;
const STEP = CARD_WIDTH + GAP;
const CENTER_INDEX = 4;
const MIN_POOL_SIZE = 12;

const DEFAULT_WHEEL_MOVIES: MovieItem[] = [
  ['Inception', '2010', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'],
  ['Interstellar', '2014', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'],
  ['The Dark Knight', '2008', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'],
  ['Parasite', '2019', 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'],
  ['The Matrix', '1999', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'],
  ['Spirited Away', '2001', 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg'],
  ['Whiplash', '2014', 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeNOVIE.jpg'],
  ['Arrival', '2016', 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'],
  ['Dune', '2021', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'],
  ['Mad Max: Fury Road', '2015', 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg'],
  ['The Shawshank Redemption', '1994', 'https://image.tmdb.org/t/p/w500/lyQBXzOQTgE0P9QYLUF9A4P8V5d.jpg'],
  ['The Lord of the Rings', '2001', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkbl6cHo6.jpg'],
  ['Oppenheimer', '2023', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'],
  ['Spider-Man: Across the Spider-Verse', '2023', 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'],
  ['Everything Everywhere All at Once', '2022', 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'],
].map(([title, year, posterUrl]) => ({
  title,
  year,
  posterUrl,
  genre: 'Popüler',
  imdb: '8.0',
  durationOrSeason: '',
  summary: '',
  contentType: 'Film',
  isLocal: false,
  platforms: [],
  cast: [],
  popularity: 100,
  voteCount: 1000,
}));

const centerFirstMovie = (list: MovieItem[]) => list.length > CENTER_INDEX
  ? [...list.slice(1, CENTER_INDEX + 1), list[0], ...list.slice(CENTER_INDEX + 1)]
  : list;

const buildWheelStrip = (pool: MovieItem[], minimumLength = 30) => {
  // Never build the strip from an empty source, or indices beyond minimumLength resolve to undefined cards.
  const source = pool.length > 0 ? pool : DEFAULT_WHEEL_MOVIES;

  const strip = Array.from(
    { length: Math.max(minimumLength, source.length) },
    (_, index) => source[index % source.length]
  );

  return centerFirstMovie(strip);
};

const IconSparkles = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 2.75l1.3 4.95a3.2 3.2 0 0 0 2.25 2.25l4.95 1.3-4.95 1.3a3.2 3.2 0 0 0-2.25 2.25l-1.3 4.95-1.3-4.95a3.2 3.2 0 0 0-2.25-2.25l-4.95-1.3 4.95-1.3a3.2 3.2 0 0 0 2.25-2.25l1.3-4.95Z" />
    <path d="M19 3.5v3M20.5 5h-3M5 17.5v3M6.5 19H3.5" strokeLinecap="round" />
  </svg>
);

const IconRefreshCw = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 4v6h6M23 20v-6h-6" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15A9 9 0 0 0 18.36 18.36" />
  </svg>
);

const IconSpin = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 11a8.1 8.1 0 0 0-14.8-4.4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 14.8 4.4L21 15"/><path d="M21 20v-5h-5"/>
  </svg>
);

const IconStar = () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true"><path d="m12 2.7 2.82 5.72 6.31.92-4.56 4.44 1.08 6.28L12 17.08l-5.65 2.98 1.08-6.28-4.56-4.44 6.31-.92L12 2.7Z"/></svg>;

const IconFilm = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M7 4v16M17 4v16M3 9h18M3 15h18" />
  </svg>
);

const resolvePosterUrl = (movie: MovieItem) => {
  const enriched = movie as MovieItem & { poster_path?: string | null };
  const rawPoster = enriched.poster_path
    ? `https://image.tmdb.org/t/p/w500${enriched.poster_path}`
    : movie.posterUrl;

  return getPosterSrc(rawPoster || '');
};

const Wheel: React.FC<WheelProps> = memo(({ movies = [], activeType: propType = null, minRating = 'all', selectedPlatform = 'all', onlyNew: propOnlyNew = false, onSelectMovie, onSpinChange, onTypeChange, onGenreChange, onPlatformChange, onRatingChange, onOnlyNewChange }) => {
  const type = propType;
  const onlyNew = propOnlyNew;
  const [spinning, setSpinning] = useState(false);
  const [items, setItems] = useState<MovieItem[]>(centerFirstMovie(DEFAULT_WHEEL_MOVIES));
  const [translate, setTranslate] = useState(CENTER_INDEX * STEP);
  const [selected, setSelected] = useState<number | null>(null);
  const [missingPosterMap, setMissingPosterMap] = useState<Record<string, boolean>>({});
  const tokenRef = useRef(0);

  const availableMovies = Array.from(new Map(movies
    .map((movie) => [`${movie.contentType}:${movie.tmdbId || movie.title}:${movie.posterUrl}`, movie])).values());

  const baseFiltered = useMemo(() => availableMovies.filter((m) => {
    if (type && m.contentType !== type) return false;
    if (minRating !== 'all' && m.imdb && Number(m.imdb) < Number(minRating)) return false;
    if (onlyNew && Number(m.year) < 2021) return false;
    return true;
  }), [availableMovies, type, minRating, onlyNew]);

  const platformMatches = useMemo(() => {
    if (selectedPlatform === 'all') return baseFiltered;
    const query = selectedPlatform.toLowerCase().trim();
    return baseFiltered.filter((movie) => movie.platforms?.some((platform) => {
      const providerName = (platform as typeof platform & { provider_name?: string }).provider_name;
      const joined = [platform.name, platform.key, providerName].filter(Boolean).map((value) => String(value).toLowerCase().trim()).join(' ');
      if (query === 'prime') return joined.includes('prime') || joined.includes('amazon');
      if (query === 'disney') return joined.includes('disney');
      if (query === 'hbo' || query === 'max') return joined.includes('hbo') || joined.includes('max');
      if (query === 'blutv' || query === 'tod') return joined.includes('blutv') || joined.includes('tod');
      if (query === 'tv') return joined.includes('tv');
      return joined.includes(query);
    })).sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0) || Number(b.imdb || 0) - Number(a.imdb || 0));
  }, [baseFiltered, selectedPlatform]);

  const filtered = useMemo(() => platformMatches
    .sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0) || Number(b.imdb || 0) - Number(a.imdb || 0))
    .slice(0, 30), [platformMatches]);
  const wheelDisplayPool = filtered;

  // Guarantee a minimum populated wheel: pad with popular defaults instead of ever showing an empty/blank card.
  const usingFallbackPool = wheelDisplayPool.length < MIN_POOL_SIZE;
  const effectivePool = useMemo(() => {
    if (wheelDisplayPool.length >= MIN_POOL_SIZE) return wheelDisplayPool;
    const usedKeys = new Set(wheelDisplayPool.map((m) => `${m.contentType}:${m.title}`));
    const padding = DEFAULT_WHEEL_MOVIES.filter((m) => !usedKeys.has(`${m.contentType}:${m.title}`));
    return [...wheelDisplayPool, ...padding].slice(0, MIN_POOL_SIZE);
  }, [wheelDisplayPool]);

  useEffect(() => {
    if (!spinning) {
      const wheelPool = effectivePool.slice(0, 15);
      // The strip must reset immediately when filters change to avoid stale cards.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(buildWheelStrip(wheelPool));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(CENTER_INDEX);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranslate(CENTER_INDEX * STEP);
    }
  }, [effectivePool, spinning]);

  const spin = () => {
    if (spinning || effectivePool.length === 0) return;
    const token = ++tokenRef.current;
    const shuffled = [...effectivePool].sort(() => Math.random() - 0.5);
    const track = buildWheelStrip(shuffled, 64);
    const winnerIndex = 48 + Math.floor(Math.random() * 5);
    setItems(track);
    setSelected(null);
    setSpinning(false);
    setTranslate(CENTER_INDEX * STEP);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (tokenRef.current !== token) return;
      setSpinning(true);
      onSpinChange?.(true);
      window.requestAnimationFrame(() => setTranslate(winnerIndex * STEP));
    }));
    window.setTimeout(() => {
      if (tokenRef.current !== token) return;
      const winner = track[winnerIndex] || track[track.length - 1];
      setSelected(winnerIndex);
      setSpinning(false);
      onSpinChange?.(false);
      onSelectMovie(winner);
    }, 5200 + 180);
  };

  return (
    <div className="w-full rounded-[26px] border border-white/[0.08] bg-[#070c15] p-4 sm:p-5 shadow-[0_20px_70px_rgba(0,0,0,0.42)]">
      <div className="mb-4 flex flex-col gap-3">
      </div>

      <div className="relative h-[285px] overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#03060c]">
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-3 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[265px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-2 border-cyan-200/90 bg-cyan-300/[0.035] shadow-[0_0_20px_rgba(34,211,238,0.85),0_0_55px_rgba(245,185,66,0.18)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#03060c] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#03060c] to-transparent" />
        <div className="absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#03060c] to-transparent sm:w-36" />
        <div className="absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#03060c] to-transparent sm:w-36" />

        <div className="absolute left-0 top-0 flex h-full items-center gap-[14px] will-change-transform" style={{ paddingLeft: `calc(50% - ${CARD_WIDTH / 2}px)`, transform: `translate3d(-${translate}px,0,0)`, transition: spinning ? 'transform 5.2s cubic-bezier(0.10,0.78,0.18,1)' : 'none' }}>
          {items.map((m, idx) => {
            const key = `${m.title}-${idx}`;
            const posterSrc = resolvePosterUrl(m);
            const hasPoster = !!posterSrc && !missingPosterMap[key];

            return (
              <div key={key} className={`relative h-[265px] w-[180px] shrink-0 overflow-hidden rounded-[17px] border bg-[#0b1220] shadow-[0_12px_35px_rgba(0,0,0,0.6)] ${selected === idx && !spinning ? 'border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.65)]' : 'border-white/[0.08]'} ${spinning ? 'scale-[0.985] opacity-95' : 'scale-100 opacity-100'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.15),transparent_38%),linear-gradient(180deg,#0b1b2c,#030811)]" />

                {hasPoster ? (
                  <img
                    src={posterSrc}
                    alt={m.title}
                    className="absolute inset-0 z-10 h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setMissingPosterMap((prev) => ({ ...prev, [key]: true }));
                      setItems((current) => current.filter((item) => item !== m));
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.28),_rgba(12,18,30,0.96)_40%,_rgba(6,10,22,1)_100%)] px-4 text-center text-white">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                      <IconFilm className="h-6 w-6" />
                    </div>
                    <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">{m.contentType || 'Film'}</div>
                    <div className="text-sm font-black leading-tight text-white">{m.title}</div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">{m.genre || 'Yapım'}</div>
                  </div>
                )}

                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-2.5">
                  <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/80">
                    {m.contentType || 'Film'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[9px] font-extrabold text-white/80">
                    {renderPlatformLogo((m.platforms?.[0]?.key || 'all'))}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-30 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-200">{m.genre?.split(',')[0] || 'Yapım'}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/12 px-2 py-1 text-[10px] font-black text-amber-200">
                      <IconStar /> {m.imdb || 'N/A'}
                    </span>
                  </div>
                  <div className="truncate text-sm font-black text-white">{m.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {usingFallbackPool && (
          <div className="pointer-events-none absolute left-3 top-3 z-40 rounded-full border border-amber-300/30 bg-black/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-amber-200 backdrop-blur-md">
            {wheelDisplayPool.length === 0 ? 'Bu filtrelere uygun sonuç yok · Popüler öneriler' : 'Popüler önerilerle dolduruldu'}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        {/* Premium Glassmorphic Button with Dual Glow */}
        <div className="relative group">
          {/* Outer Glow Layer */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 via-sky-400/20 to-blue-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          
          {/* Inner Glow Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-blue-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Button */}
          <button
            type="button"
            onClick={spin}
            disabled={spinning || effectivePool.length === 0}
            className="relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest text-white rounded-3xl overflow-hidden disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(59,130,246,0.05) 100%)',
              border: '1.5px solid rgba(34,211,238,0.4)',
              backdropFilter: 'blur(20px)',
              boxShadow: spinning 
                ? '0 0 40px rgba(34,211,238,0.6), inset 0 0 20px rgba(34,211,238,0.2), 0 8px 32px rgba(14,165,233,0.25)'
                : '0 0 20px rgba(34,211,238,0.3), inset 0 0 10px rgba(34,211,238,0.1), 0 4px 20px rgba(14,165,233,0.15)',
            }}
          >
            {/* Content Wrapper */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className={`transition-all duration-500 ${spinning ? 'animate-spin' : ''}`}>
                {spinning ? <IconRefreshCw className="w-5 h-5" /> : <IconSparkles className="w-5 h-5" />}
              </div>
              <span className="text-sm font-black tracking-wider">
                {spinning ? 'ŞANSIN DÖNÜYOR...' : 'ÇARKI ÇEVİR'}
              </span>
              <div className="transition-all duration-500 opacity-0 group-hover:opacity-100">
                <IconRefreshCw className="w-5 h-5 animate-spin" />
              </div>
            </div>
          </button>
        </div>

        <span className="text-[10px] font-semibold text-slate-600">
          {wheelDisplayPool.length > 0 ? `${wheelDisplayPool.length} aday filtrelere uyuyor` : `${effectivePool.length} popüler öneri hazır`}
        </span>
      </div>
    </div>
  );
});

Wheel.displayName = 'Wheel';
export default Wheel;
