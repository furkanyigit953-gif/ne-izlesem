'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { imageUrl } from '@/lib/tmdb';
import { googleSearchUrl } from '@/lib/detailMedia';

export default function CastSection({ detail }: { detail: TmdbDetail }) {
  const cast = (detail.credits?.cast || []).slice(0, 12);

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Oyuncular</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cast.length > 0 ? (
          cast.map((person) => {
            const photo = imageUrl(person.profile_path, 'w185');
            const initials = person.name?.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'A';

            return (
              <div key={person.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start gap-3">
                  {photo ? (
                    <img src={photo} alt={person.name} className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-sm font-black text-white">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{person.name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{person.character || 'Oyuncu'}</p>
                    <a
                      href={googleSearchUrl(person.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-cyan-500/15"
                    >
                      Google'da Ara
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">Oyuncu bilgisi bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
