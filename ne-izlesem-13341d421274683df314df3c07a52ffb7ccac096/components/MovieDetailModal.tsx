'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getPosterSrc } from '../lib/homeShared';
import { pickYoutubeTrailer } from '../lib/detailMedia';
import { MovieItem } from '../types/movie';

interface MovieDetailModalProps {
  movie: MovieItem | null;
  allMovies?: MovieItem[];
  onClose: () => void;
  isFav: boolean;
  onToggleFav: (movie: MovieItem) => void;
  userRating?: number;
  onRate?: (title: string, rating: number) => void;
  onShare: (movie: MovieItem) => void;
  onSelectMovie?: (movie: MovieItem) => void;
  renderLogo?: (key: string) => React.ReactNode;
}

type ProviderEntry = {
  key?: string;
  name?: string;
  provider_name?: string;
  url?: string;
  link?: string;
  logo_path?: string | null;
};

const renderPlatformButton = (p: { key: string; name: string; url?: string }) => {
  const key = (p.key || p.name || '').toLowerCase();

  if (key.includes('netflix')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <span className="text-white font-black text-[12px] tracking-[0.12em] uppercase leading-none" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>NETFLIX</span>
      </a>
    );
  }

  if (key.includes('disney')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#0063E5] hover:bg-[#004eab] transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <span className="font-bold text-white text-[13px] tracking-tight leading-none italic" style={{ fontFamily: 'Georgia, serif' }}>Disney<span className="text-[11px] not-italic font-sans font-bold leading-none">+</span></span>
      </a>
    );
  }

  if (key.includes('prime') || key.includes('amazon')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#00A8E1] hover:bg-[#0082af] transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <span className="font-bold text-white text-[12px] tracking-tight font-sans">prime <span className="font-medium text-[9px] opacity-90">video</span></span>
      </a>
    );
  }

  if (key.includes('max') || key.includes('hbo')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#002BE7] hover:bg-[#001da8] transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <span className="font-black text-white text-[12px] tracking-widest font-sans leading-none">MAX</span>
      </a>
    );
  }

  if (key.includes('blu')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#001c38] hover:bg-[#002a54] border border-[#00D1FF]/50 transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <span className="font-black text-[#00D1FF] text-[12px] tracking-tight font-sans leading-none">blu<span className="text-white">TV</span></span>
      </a>
    );
  }

  if (key.includes('apple')) {
    return (
      <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/15 transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer">
        <div className="flex items-center gap-1 text-white font-bold"><span className="font-extrabold text-[12px]">Apple TV+</span></div>
      </a>
    );
  }

  return (
    <a href={p.url || undefined} target={p.url ? '_blank' : undefined} rel={p.url ? 'noreferrer' : undefined} className="h-8 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-[12px] transition-all flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer">
      <span>▶</span> {p.name}
    </a>
  );
};

export default function MovieDetailModal({
  movie,
  ...props
}: MovieDetailModalProps) {
  if (!movie) return null;
  return <MovieDetailModalContent movie={movie} {...props} />;
}

type MovieDetailModalContentProps = Omit<MovieDetailModalProps, 'movie'> & { movie: MovieItem };

function MovieDetailModalContent({
  movie,
  allMovies = [],
  onClose,
  isFav,
  onToggleFav,
  onShare,
  onSelectMovie,
  userRating = 0,
  onRate,
}: MovieDetailModalContentProps) {

  const getMovieCast = (): string[] => {
    if (movie.cast && Array.isArray(movie.cast)) {
      const real = movie.cast.filter((c) => Boolean(c) && !c.includes('Başrol') && !c.includes('Yan Rol'));
      if (real.length > 0) return real.slice(0, 5);
    }
    const titleLower = movie.title.toLowerCase();
    if (titleLower.includes('oyuncak')) return ['Tom Hanks', 'Tim Allen', 'Joan Cusack'];
    if (titleLower.includes('thunderman')) return ['Kira Kosarin', 'Jack Griffo', 'Addison Riecke'];
    if (titleLower.includes('avenger')) return ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth'];
    if (titleLower.includes('koloni')) return ['Koo Kyo-hwan', 'Shin Hyun-been', 'Kim Shin-rock'];
    return [];
  };

  const castList = getMovieCast();

  const rawPoster = useMemo(() => {
    const typed = movie as MovieItem & { poster_path?: string | null };
    const candidate = typed.poster_path ? `https://image.tmdb.org/t/p/w500${typed.poster_path}` : movie.posterUrl;
    return getPosterSrc(candidate || '');
  }, [movie]);

  const rawTmdbId = (movie as MovieItem & { tmdbId?: number }).tmdbId;

  type TrailerState = { status: 'loading' | 'ready' | 'empty'; embedUrl?: string; name?: string };
  const [trailerState, setTrailerState] = useState<TrailerState>({ status: rawTmdbId ? 'loading' : 'empty' });

  useEffect(() => {
    if (!rawTmdbId) {
      setTrailerState({ status: 'empty' });
      return;
    }

    let cancelled = false;
    setTrailerState({ status: 'loading' });
    const apiType = movie.contentType === 'Dizi' ? 'tv' : 'movie';

    fetch(`/api/details/${apiType}/${rawTmdbId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled) return;
        const trailer = data ? pickYoutubeTrailer(data.videos) : null;
        setTrailerState(trailer ? { status: 'ready', embedUrl: trailer.embedUrl, name: trailer.name } : { status: 'empty' });
      })
      .catch(() => {
        if (!cancelled) setTrailerState({ status: 'empty' });
      });

    return () => {
      cancelled = true;
    };
  }, [rawTmdbId, movie.contentType]);

  const [failedPoster, setFailedPoster] = useState<string | null>(null);

  const trailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} ${movie.year || ''} fragman`)}`;
  const providerEntries = useMemo(() => {
    const typedMovie = movie as MovieItem & { watchProviders?: unknown };
    const watchProviders = typedMovie.watchProviders as {
      flatrate?: ProviderEntry[];
      results?: Record<string, { flatrate?: ProviderEntry[] }>;
    } | undefined;
    const flatrate = watchProviders?.flatrate || watchProviders?.results?.TR?.flatrate || [];
    const platformEntries = (movie.platforms || []) as ProviderEntry[];
    const entries = [...platformEntries, ...flatrate]
      .filter((provider) => (provider.name || provider.provider_name || '').toLowerCase().trim() !== 'justwatch')
      .map((provider) => ({
        key: provider.key || provider.name || provider.provider_name || 'platform',
        name: provider.name || provider.provider_name || 'Dijital Platform',
        url: provider.url || provider.link,
      }));
    return Array.from(new Map(entries.map((provider) => [provider.name.toLowerCase(), provider])).values());
  }, [movie]);

  const similarMovies = useMemo(() => {
    if (!allMovies || allMovies.length === 0) return [];
    const currentGenres = movie.genre.toLowerCase().split(',').map((g) => g.trim());
    return allMovies
      .filter((m) => m.title !== movie.title)
      .filter((m) => {
        const targetGenres = (m.genre || '').toLowerCase();
        return currentGenres.some((g) => targetGenres.includes(g));
      })
      .slice(0, 6);
  }, [movie, allMovies]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Kapat"
        className="fixed right-4 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-black/90 sm:right-6 sm:top-6"
      >
        ✕
      </button>

      <div
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b101d] text-left shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
        style={{ animation: 'modalScaleIn 0.28s ease-out forwards' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-[290px_1fr]">
          <div className="relative aspect-[2/3] w-full overflow-hidden border-b border-white/10 bg-slate-950 md:border-b-0 md:border-r">
            {failedPoster !== rawPoster && rawPoster ? (
              <img src={rawPoster} alt={movie.title} className="h-full w-full object-cover" onError={() => setFailedPoster(rawPoster)} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.28),_rgba(10,13,21,0.94)_35%,_rgba(2,6,23,1)_100%)] px-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.2)]">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M7 4v16M17 4v16M3 9h18M3 15h18" /></svg>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Poster</div>
                  <div className="mt-2 max-w-[170px] text-sm font-bold leading-tight text-white">{movie.title}</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-amber-300/25 bg-[#0d1117]/70 px-2.5 py-1.5 text-[10px] font-black text-amber-300 backdrop-blur-md">
              <span>★</span> {movie.imdb}
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 font-bold text-cyan-200">{movie.contentType}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-semibold">{movie.year}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-semibold">{movie.durationOrSeason}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-semibold">{movie.genre}</span>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">{movie.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{movie.summary}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Fragman</span>
                {trailerState.status === 'ready' && (
                  <a href={trailerSearchUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-cyan-300 transition hover:text-cyan-200">YouTube&apos;da Aç</a>
                )}
              </div>

              {trailerState.status === 'loading' && (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-black/40">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-cyan-400/25 border-t-cyan-300" />
                </div>
              )}

              {trailerState.status === 'ready' && trailerState.embedUrl && (
                <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-black">
                  <div className="aspect-video w-full">
                    <iframe
                      src={trailerState.embedUrl}
                      title={trailerState.name || `${movie.title} fragman`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {trailerState.status === 'empty' && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="m10 8.5 5 3.5-5 3.5v-7Z" fill="currentColor" stroke="none" /></svg>
                  </div>
                  <p className="text-sm font-bold text-white">Bu yapım için resmî fragman bulunamadı</p>
                  <a
                    href={trailerSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-[11px] font-black text-red-200 transition hover:border-red-300/50 hover:bg-red-500/20"
                  >
                    <span>▶</span> YouTube&apos;da Ara
                  </a>
                </div>
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:col-span-2">
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Nerede İzlenir? (Yayın Platformları)</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {providerEntries.length > 0 ? (
                    providerEntries.map((p, idx) => (
                      <div key={`${p.key}-${idx}`} className="rounded-xl border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-md">
                        {renderPlatformButton(p)}
                        <div className="px-2 pb-1 pt-1 text-[10px] font-semibold text-slate-300">{p.name}</div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-xs font-semibold text-slate-400">Dijital platform bilgisi bulunamadı</p>
                  )}
                </div>
              </div>
            </div>

            {castList.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Oyuncular & Kadro</div>
                <div className="flex flex-wrap gap-3">
                  {castList.map((actor, idx) => (
                    <div key={`${actor}-${idx}`} className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111827] px-2.5 py-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 text-[11px] font-black text-cyan-100">
                        {actor.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200">{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {onRate && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Puanın</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => onRate(movie.title, star)} className={`rounded-lg p-1 transition ${(userRating || 0) >= star ? 'bg-amber-400/10 text-amber-300' : 'text-slate-600 hover:bg-white/5 hover:text-amber-200'}`} aria-label={`${star} yıldız`}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="m12 2.7 2.82 5.72 6.31.92-4.56 4.44 1.08 6.28L12 17.08l-5.65 2.98 1.08-6.28-4.56-4.44 6.31-.92L12 2.7Z" /></svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => onToggleFav(movie)} className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/[0.08]">{isFav ? 'Listede' : 'Favorilere ekle'}</button>
              <button onClick={() => onShare(movie)} className="rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#20ba5a]">WhatsApp</button>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className="border-t border-white/10 bg-[#0c121d] p-6">
            <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Bunu sevenler bunları da sevdi</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {similarMovies.map((sim, index) => {
                const simPoster = getPosterSrc((sim as MovieItem & { poster_path?: string | null }).poster_path ? `https://image.tmdb.org/t/p/w500${(sim as MovieItem & { poster_path?: string | null }).poster_path}` : sim.posterUrl);
                return (
                  <button
                    key={`${sim.title}-${index}`}
                    type="button"
                    onClick={() => onSelectMovie && onSelectMovie(sim)}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101827] text-left transition hover:border-cyan-400/40 hover:bg-[#0f172a]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.26),_rgba(12,18,30,0.94)_40%,_rgba(3,7,18,1)_100%)]">
                      {simPoster ? <img src={simPoster} alt={sim.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center text-cyan-200"><svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M7 4v16M17 4v16M3 9h18M3 15h18" /></svg></div>}
                      <span className="absolute left-2 top-2 rounded-full border border-amber-300/25 bg-[#0d1117]/80 px-1.5 py-0.5 text-[9px] font-black text-amber-300">★ {sim.imdb}</span>
                    </div>
                    <div className="space-y-1 p-2.5">
                      <div className="text-[10px] font-semibold text-slate-400">{sim.year}</div>
                      <div className="truncate text-[12px] font-extrabold text-white group-hover:text-cyan-300">{sim.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modalScaleIn {
          0% { opacity: 0; transform: scale(0.96) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
