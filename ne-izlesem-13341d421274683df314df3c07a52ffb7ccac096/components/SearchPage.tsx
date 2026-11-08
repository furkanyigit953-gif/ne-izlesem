'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MovieItem } from '@/types/movie';
import MediaPoster from './media/MediaPoster';

type SearchResult = MovieItem | { kind: 'person'; id: number; name: string; department: string; posterUrl: string; knownFor: string[] };

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') || '');
  }, []);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) {
      setResults([]);
      setError(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(false);
      fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}&includePeople=true`, { signal: controller.signal, cache: 'no-store' })
        .then((response) => response.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch((reason: unknown) => {
          if ((reason as { name?: string }).name !== 'AbortError') {
            setResults([]);
            setError(true);
          }
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  return (
    <main className="min-h-screen bg-[#040814] px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-xs font-bold text-cyan-300 hover:text-cyan-200">← Ana sayfa</Link>
        <h1 className="mt-8 text-4xl font-black text-white">Arama</h1>
        <p className="mt-2 text-sm text-slate-400">Film, dizi veya kişi adıyla ara.</p>
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Film, dizi, oyuncu veya yönetmen..." className="mt-6 h-14 w-full rounded-2xl border border-white/10 bg-[#0b1220] px-5 text-base text-white outline-none focus:border-cyan-400/60" />
        {loading && <p className="mt-6 text-sm text-cyan-200">Aranıyor...</p>}
        {!loading && error && <p className="mt-6 text-sm text-rose-300">Bir şeyler ters gitti. Tekrar dene.</p>}
        {!loading && !error && query.trim().length >= 2 && results.length === 0 && <p className="mt-6 text-sm text-slate-400">Sonuç bulunamadı.</p>}
        {!loading && !error && query.trim().length < 2 && <p className="mt-6 text-sm text-slate-400">Film, dizi, oyuncu veya yönetmen ara.</p>}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{results.map((item) => 'kind' in item ? <article key={`person-${item.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]"><div className="aspect-[2/3] bg-[#07111f]"><MediaPoster src={item.posterUrl} alt={item.name} width={0} height={0} className="h-full w-full" /></div><div className="p-3"><h2 className="truncate text-sm font-black text-white">{item.name}</h2><p className="mt-1 text-[11px] text-cyan-300">{item.department}</p><p className="mt-1 truncate text-[10px] text-slate-500">{item.knownFor.join(', ') || 'Bilinen yapım yok'}</p></div></article> : <Link key={`${item.contentType}-${item.tmdbId || item.title}`} href={`/${item.contentType === 'Dizi' ? 'tv' : 'movie'}/${item.tmdbId || ''}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] transition hover:border-cyan-400/40"><div className="aspect-[2/3] bg-[#07111f]"><MediaPoster src={item.posterUrl} alt={item.title} width={0} height={0} className="h-full w-full" /></div><div className="p-3"><h2 className="truncate text-sm font-black text-white">{item.title}</h2><p className="mt-1 text-[11px] text-slate-400">{item.year || '—'} • {item.contentType} • ★ {item.imdb || '—'}</p></div></Link>)}</div>
      </div>
    </main>
  );
}
