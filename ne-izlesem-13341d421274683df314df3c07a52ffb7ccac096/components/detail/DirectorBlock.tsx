'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { googleSearchUrl } from '@/lib/detailMedia';

export default function DirectorBlock({ detail, type }: { detail: TmdbDetail; type: 'movie' | 'tv' }) {
  const directorPerson = detail.credits?.crew?.find((person) => person.job === 'Director');
  const fallbackCreator = type === 'tv' ? detail.created_by?.find((person) => person.name?.trim()) : null;
  const finalName = directorPerson?.name?.trim() || fallbackCreator?.name?.trim() || '';

  if (!finalName) {
    return null;
  }

  const photoPath = directorPerson?.profile_path || fallbackCreator?.profile_path || null;
  const photo = photoPath ? `https://image.tmdb.org/t/p/w200${photoPath}` : '';

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Yönetmen</p>
      <a
        href={googleSearchUrl(finalName)}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
      >
        {photo ? (
          <img
            src={photo}
            alt={finalName}
            className="aspect-square h-14 w-14 flex-shrink-0 rounded-xl object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex aspect-square h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-sm font-black text-white">
            {finalName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'Y'}
          </div>
        )}
        <div>
          <p className="text-base font-black text-white transition-colors group-hover:text-cyan-400">{finalName}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">{type === 'movie' ? 'Director' : 'Creator / Director'}</p>
        </div>
      </a>
    </div>
  );
}
