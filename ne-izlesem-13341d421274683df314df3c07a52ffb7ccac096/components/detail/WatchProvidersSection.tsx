'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { getTurkeyWatchProviders, safeExternalHttps } from '@/lib/detailMedia';

export default function WatchProvidersSection({ detail }: { detail: TmdbDetail }) {
  const { items, watchLink } = getTurkeyWatchProviders(detail);

  if (!items.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Nerede İzlenir?</p>
        <p className="mt-4 text-sm text-slate-400">Türkiye için yayın platformu bilgisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Nerede İzlenir?</p>
        {watchLink && (
          <a
            href={watchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200 underline decoration-cyan-400/50 underline-offset-4"
          >
            TMDB
          </a>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((provider) => {
          const isClickable = !!safeExternalHttps(watchLink, new Set(['www.themoviedb.org', 'themoviedb.org']));
          const body = (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              {provider.logoUrl ? (
                <img src={provider.logoUrl} alt={provider.name} className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-[10px] font-black text-slate-200">
                  {provider.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">{provider.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-400">{provider.kind}</p>
              </div>
            </div>
          );

          if (!isClickable || !watchLink) {
            return <div key={provider.id}>{body}</div>;
          }

          return (
            <a
              key={provider.id}
              href={watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:-translate-y-0.5 hover:border-cyan-300/40"
            >
              {body}
            </a>
          );
        })}
      </div>
    </div>
  );
}
