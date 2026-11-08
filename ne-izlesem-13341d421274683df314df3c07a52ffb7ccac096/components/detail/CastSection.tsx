'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { googleSearchUrl } from '@/lib/detailMedia';

export default function CastSection({ detail }: { detail: TmdbDetail }) {
  const cast = (detail.credits?.cast || []).slice(0, 12);

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Oyuncular</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cast.length > 0 ? (
          cast.map((person) => {
            const photo = person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '';

            return (
              <a
                key={person.id}
                href={googleSearchUrl(person.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={person.name}
                    className="aspect-square h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex aspect-square h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-sm font-black text-white">
                    {person.name?.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'A'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white transition-colors group-hover:text-cyan-400">{person.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{person.character || 'Oyuncu'}</p>
                </div>
              </a>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">Oyuncu bilgisi bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
