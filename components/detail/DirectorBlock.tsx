'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { googleSearchUrl } from '@/lib/detailMedia';

export default function DirectorBlock({ detail, type }: { detail: TmdbDetail; type: 'movie' | 'tv' }) {
  const director = detail.credits?.crew?.find((person) => person.job === 'Director')?.name?.trim();
  const fallbackDirector = type === 'tv' ? detail.created_by?.find((person) => person.name?.trim())?.name?.trim() : null;
  const finalName = director || fallbackDirector || '';

  if (!finalName) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Yönetmen</p>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div>
          <p className="text-base font-black text-white">{finalName}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">{type === 'movie' ? 'Director' : 'Creator / Director'}</p>
        </div>
        <a
          href={googleSearchUrl(finalName)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-cyan-500/15"
        >
          Google'da Ara
        </a>
      </div>
    </div>
  );
}
