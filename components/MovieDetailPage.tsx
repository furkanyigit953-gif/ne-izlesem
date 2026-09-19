'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { TmdbDetail } from '@/lib/tmdb';
import { imageUrl } from '@/lib/tmdb';
import CastSection from '@/components/detail/CastSection';
import DirectorBlock from '@/components/detail/DirectorBlock';
import TrailerSection from '@/components/detail/TrailerSection';
import WatchProvidersSection from '@/components/detail/WatchProvidersSection';

const STORAGE_KEYS = {
  saved: 'neizlesem_saved',
  watchlist: 'neizlesem_watchlist',
  watched: 'neizlesem_watched',
};

function toTitleCase(value?: string | null) {
  if (!value) return '';
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export default function MovieDetailPage({ detail, type }: { detail: TmdbDetail; type: 'movie' | 'tv' }) {
  const title = detail.title || detail.name || 'Yapım';
  const year = (detail.release_date || detail.first_air_date || '').slice(0, 4);
  const poster = imageUrl(detail.poster_path);
  const backdrop = imageUrl(detail.backdrop_path, 'w1280');
  const originalTitle = detail.original_title || detail.original_name;
  const runtimeText = detail.runtime ? `${detail.runtime} dk` : detail.number_of_seasons ? `${detail.number_of_seasons} sezon` : 'Bilgi yok';
  const director = detail.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Yönetmen bilgisi yok';
  const cast = (detail.credits?.cast || []).slice(0, 8);
  const genres = (detail.genres || []).map((genre) => genre.name);
  const similar = (detail.recommendations?.results || []).slice(0, 6);
  const imdbScore = detail.vote_average ? Number(detail.vote_average.toFixed(1)) : 0;
  const neIzlesemScore = detail.vote_average ? Number(detail.vote_average.toFixed(1)) : 0;

  const [saved, setSaved] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${STORAGE_KEYS.saved}:${type}:${detail.id}`) === '1';
  });

  const [watchlist, setWatchlist] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${STORAGE_KEYS.watchlist}:${type}:${detail.id}`) === '1';
  });

  const [watched, setWatched] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${STORAGE_KEYS.watched}:${type}:${detail.id}`) === '1';
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReview, setAiReview] = useState<string>('');
  const [aiReviewCache, setAiReviewCache] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const detailKey = `${type}:${detail.id}`;

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.saved}:${type}:${detail.id}`, next ? '1' : '0');
    }
    setToast(next ? 'Listeye eklendi' : 'Listeden çıkarıldı');
  };

  const toggleWatchlist = () => {
    const next = !watchlist;
    setWatchlist(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.watchlist}:${type}:${detail.id}`, next ? '1' : '0');
    }
    setToast(next ? 'İzleme listesine eklendi' : 'İzleme listesinden çıkarıldı');
  };

  const toggleWatched = () => {
    const next = !watched;
    setWatched(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.watched}:${type}:${detail.id}`, next ? '1' : '0');
    }
    setToast(next ? 'İzlendi olarak işaretlendi' : 'İzlenmedi olarak işaretlendi');
  };

  const handleShare = async () => {
    const titleText = `${title} | NE İZLESEM?`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: titleText,
          text: `${title} hakkında daha fazla bilgi için tıkla.`,
          url: shareUrl,
        });
        setToast('Paylaşım açıldı');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl || titleText);
        setToast('Bağlantı kopyalandı');
        return;
      }

      setToast('Paylaşım için tarayıcı desteği yok');
    } catch {
      setToast('Paylaşım iptal edildi');
    }
  };

  const handleAiReview = async () => {
    if (isAiLoading) return;

    if (aiReviewCache[detailKey]) {
      setAiReview(aiReviewCache[detailKey]);
      setToast('Kaydedilen AI incelemesi gösteriliyor');
      return;
    }

    setIsAiLoading(true);
    try {
      const reviewPayload = {
        title,
        year: year || undefined,
        type,
        genres,
        rating: imdbScore || undefined,
        director: director === 'Yönetmen bilgisi yok' ? undefined : director,
        cast: cast.map((person) => person.name).slice(0, 6),
        overview: (detail.overview || '').slice(0, 600),
      };

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        const message = data?.error || 'AI incelemesi şu anda kullanılamıyor.';
        throw new Error(message);
      }

      const reviewText = typeof data?.text === 'string' && data.text.trim()
        ? data.text
        : typeof data?.analysis === 'string' && data.analysis.trim()
          ? data.analysis
          : 'AI inceleme şu anda hazır değil.';

      setAiReview(reviewText);
      setAiReviewCache((current) => ({ ...current, [detailKey]: reviewText }));
      setToast('AI inceleme hazır');
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : 'AI incelemesi şu anda kullanılamıyor. Lütfen birkaç saniye sonra tekrar deneyin.';
      setAiReview(message);
      setToast('AI inceleme alınamadı');
    } finally {
      setIsAiLoading(false);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'movie' ? 'Movie' : 'TVSeries',
    name: title,
    image: poster || undefined,
    description: detail.overview || `${title} hakkında detaylı inceleme.`,
    datePublished: detail.release_date || detail.first_air_date || undefined,
    aggregateRating: detail.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: detail.vote_average,
          ratingCount: detail.vote_count || 1,
        }
      : undefined,
    genre: genres,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="min-h-screen bg-[#040814] text-slate-100">
        {toast && (
          <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-[#091421]/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_18px_40px_rgba(14,165,233,0.18)] backdrop-blur-md">
            {toast}
          </div>
        )}

        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[#040814]" />
          {backdrop && <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-gradient-to-b from-[#040814]/20 via-[#040814]/85 to-[#040814]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_25%_20%,rgba(251,191,36,0.12),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-10">
            <Link href={type === 'tv' ? '/tv' : '/movies'} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1220]/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-100">
              ← Listeye dön
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[290px_1fr] lg:items-end">
              <div className="relative">
                <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-[0_28px_80px_rgba(2,6,23,0.8)]">
                  {poster ? (
                    <img
                      src={poster}
                      alt={title}
                      className="block h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-sm font-black uppercase tracking-[0.22em] text-slate-400">
                      Poster
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-[#0b1220]/80 px-2.5 py-1.5 text-[11px] font-black text-amber-200 backdrop-blur-md">
                    <span className="text-amber-300">★</span>
                    {imdbScore.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1.5 text-cyan-200">
                    {type === 'movie' ? 'Film' : 'Dizi'}
                  </span>
                  {year && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">{year}</span>}
                  {runtimeText && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">{runtimeText}</span>}
                  {genres.slice(0, 2).map((genre) => (
                    <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">
                      {genre}
                    </span>
                  ))}
                </div>

                <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h1>

                {originalTitle && (
                  <p className="mt-2 text-sm text-slate-400 sm:text-base">
                    Orijinal ad: <span className="font-semibold text-slate-200">{toTitleCase(originalTitle)}</span>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-[#20180b]/90 px-4 py-2.5 shadow-[0_12px_30px_rgba(245,158,11,0.12)]">
                    <span className="text-base text-amber-300">★</span>
                    <span className="text-sm font-black text-white">{imdbScore.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/90">IMDb</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-[#081827]/90 px-4 py-2.5 shadow-[0_12px_30px_rgba(34,211,238,0.12)]">
                    <span className="text-base text-cyan-300">★</span>
                    <span className="text-sm font-black text-white">{neIzlesemScore.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/90">NE İZLESEM</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={toggleSaved}
                    className="inline-flex items-center justify-center rounded-full border border-rose-300/30 bg-rose-500/10 px-4 py-2.5 text-sm font-black text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500/15 active:translate-y-0"
                  >
                    {saved ? 'Favoriden çıkar' : 'Favoriye ekle'}
                  </button>

                  <button
                    type="button"
                    onClick={toggleWatchlist}
                    className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-500/10 px-4 py-2.5 text-sm font-black text-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-500/15 active:translate-y-0"
                  >
                    {watchlist ? 'Takipten çıkar' : 'İzleme listesine ekle'}
                  </button>

                  <button
                    type="button"
                    onClick={toggleWatched}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 active:translate-y-0 ${
                      watched
                        ? 'border-emerald-300/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15'
                        : 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10'
                    }`}
                  >
                    {watched ? 'İzlendi' : 'İzlendi olarak işaretle'}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
                  >
                    Paylaş
                  </button>

                  <button
                    type="button"
                    onClick={handleAiReview}
                    disabled={isAiLoading}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isAiLoading ? 'İnceleniyor...' : 'AI ile incele'}
                  </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Yapım yılı</p>
                    <p className="mt-2 text-lg font-black text-white">{year || '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Süre</p>
                    <p className="mt-2 text-lg font-black text-white">{detail.runtime ? `${detail.runtime} dk` : '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Oy sayısı</p>
                    <p className="mt-2 text-lg font-black text-white">{detail.vote_count ? detail.vote_count.toLocaleString('tr-TR') : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-8">
              <TrailerSection detail={detail} />

              <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Özet & Konu</p>
                <p className="mt-4 text-base leading-8 text-slate-300">{detail.overview || 'Bu yapım için özet bilgisi bulunmuyor.'}</p>
              </div>

              <CastSection detail={detail} />

              <DirectorBlock detail={detail} type={type} />

              {aiReview && (
                <div className="rounded-[28px] border border-violet-400/20 bg-violet-500/5 p-5 shadow-[0_18px_45px_rgba(168,85,247,0.12)] sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">✨ AI İncelemesi</p>
                  <p className="mt-4 text-base leading-8 text-slate-200 whitespace-pre-line">{aiReview}</p>
                </div>
              )}

              {similar.length > 0 && (
                <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Benzer yapımlar</p>
                  <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
                    {similar.map((item) => {
                      const posterPath = imageUrl(item.poster_path);
                      const titleText = item.title || item.name || 'Yapım';
                      return (
                        <Link
                          key={item.id}
                          href={type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                          className="group min-w-[150px] rounded-[22px] border border-white/10 bg-white/[0.03] p-2 transition hover:-translate-y-1 hover:border-cyan-300/30"
                        >
                          <div className="overflow-hidden rounded-[18px]">
                            {posterPath ? (
                              <img src={posterPath} alt={titleText} className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                            ) : (
                              <div className="flex aspect-[2/3] items-center justify-center bg-slate-800 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Poster</div>
                            )}
                          </div>
                          <div className="mt-3">
                            <p className="line-clamp-2 text-sm font-black text-white">{titleText}</p>
                            <p className="mt-1 text-[10px] font-bold text-slate-400">{item.vote_average ? `${item.vote_average.toFixed(1)} IMDb` : 'Yorum bekliyor'}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <WatchProvidersSection detail={detail} />

              <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Detaylar</p>
                <dl className="mt-5 space-y-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-500">Yönetmen</dt>
                    <dd className="text-right font-semibold text-white">{director === 'Yönetmen bilgisi yok' ? '—' : director}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-500">Türler</dt>
                    <dd className="text-right font-semibold text-white">{genres.join(', ') || '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-500">Yapım yılı</dt>
                    <dd className="text-right font-semibold text-white">{year || '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-500">Süre</dt>
                    <dd className="text-right font-semibold text-white">{detail.runtime ? `${detail.runtime} dk` : detail.number_of_seasons ? `${detail.number_of_seasons} sezon` : '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-slate-500">Orijinal dil</dt>
                    <dd className="text-right font-semibold text-white">{detail.original_language || '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-1">
                    <dt className="text-slate-500">IMDb</dt>
                    <dd className="text-right font-black text-amber-300">{imdbScore.toFixed(1)}</dd>
                  </div>
                </dl>
              </div>

              {detail.homepage && (
                <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Resmî sayfa</p>
                  <a
                    href={detail.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-black text-cyan-100 transition hover:bg-cyan-500/15"
                  >
                    Resmî sayfa
                  </a>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
