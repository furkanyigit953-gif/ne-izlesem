'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { MovieItem } from '@/types/movie';

function MovieTile({ item }: { item: MovieItem }) {
  const href = item.tmdbId ? `/${item.contentType === 'Dizi' ? 'tv' : 'movie'}/${item.tmdbId}` : '#';
  return (
    <Link href={href} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] transition hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="relative aspect-[2/3] bg-[#07111f]">
        {item.posterUrl ? <img src={item.posterUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center p-4 text-center text-xs text-slate-500">Poster bulunamadı</div>}
        <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-black text-amber-300">★ {item.imdb || '—'}</span>
      </div>
      <div className="p-3">
        <h2 className="truncate text-sm font-black text-white group-hover:text-cyan-300">{item.title}</h2>
        <p className="mt-1 truncate text-[11px] text-slate-400">{item.year || '—'} • {item.genre || 'Yapım'}</p>
        <p className="mt-1 text-[10px] text-slate-500">Popülerlik: {Math.round(item.popularity || 0)}</p>
      </div>
    </Link>
  );
}

export default function BrowsePage({ type }: { type: 'all' | 'movie' | 'tv' }) {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minRating, setMinRating] = useState('all');
  const [genre, setGenre] = useState('all');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/movies?type=${type}&pageCount=5&batch=${page}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (!Array.isArray(data)) throw new Error('Liste alınamadı.');
        setItems(data);
      })
      .catch(() => !cancelled && setError('Yapımlar yüklenemedi.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page, type]);

  const genres = useMemo(() => Array.from(new Set(items.flatMap((item) => (item.genre || '').split(',').map((value) => value.trim()).filter(Boolean)))).slice(0, 20), [items]);
  const filtered = useMemo(() => items.filter((item) => (minRating === 'all' || Number(item.imdb) >= Number(minRating)) && (genre === 'all' || item.genre.toLowerCase().includes(genre.toLowerCase()))), [items, minRating, genre]);
  const heading = type === 'movie' ? 'Filmler' : type === 'tv' ? 'Diziler' : 'Keşfet';

  return (
    <main className="min-h-screen bg-[#040814] px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-xs font-bold text-cyan-300 hover:text-cyan-200">← Ana sayfa</Link>
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Ne İzlesem?</p><h1 className="mt-2 text-4xl font-black tracking-tight text-white">{heading}</h1><p className="mt-2 text-sm text-slate-400">Poster, puan, tür ve popülerlik bilgileriyle keşfet.</p></div>
          <div className="flex flex-wrap gap-2">
            <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-xs font-bold text-white"><option value="all">Her puan</option><option value="7">7+</option><option value="8">8+</option><option value="8.5">8.5+</option></select>
            <select value={genre} onChange={(event) => setGenre(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-xs font-bold text-white"><option value="all">Her tür</option>{genres.map((value) => <option key={value} value={value}>{value}</option>)}</select>
          </div>
        </div>
        {loading && <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-2xl bg-white/10" />)}</div>}
        {error && <p className="mt-8 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}
        {!loading && !error && <><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{filtered.map((item) => <MovieTile key={`${item.contentType}-${item.tmdbId || item.title}`} item={item} />)}</div><div className="mt-8 flex justify-center gap-3"><button type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white disabled:opacity-30">Önceki</button><span className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">Sayfa {page + 1}</span><button type="button" onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-cyan-400/30 px-4 py-2 text-xs font-bold text-cyan-200">Sonraki</button></div></>}
      </div>
    </main>
  );
}
