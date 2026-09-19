'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { pickYoutubeTrailer } from '@/lib/detailMedia';

export default function TrailerSection({ detail }: { detail: TmdbDetail }) {
  const trailer = pickYoutubeTrailer(detail.videos);

  if (!trailer) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Resmî Fragman &amp; Tanıtım</p>
        </div>
        <div className="rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-[#0d1827] via-[#070e1b] to-black p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] mx-auto">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.75l1.3 4.95a3.2 3.2 0 0 0 2.25 2.25l4.95 1.3-4.95 1.3a3.2 3.2 0 0 0-2.25 2.25l-1.3 4.95-1.3-4.95a3.2 3.2 0 0 0-2.25-2.25l-4.95-1.3 4.95-1.3a3.2 3.2 0 0 0 2.25-2.25l1.3-4.95Z" />
              <path d="M19 3.5v3M20.5 5h-3M5 17.5v3M6.5 19H3.5" />
            </svg>
          </div>
          <p className="text-sm font-bold text-white mb-2">Fragman Yok</p>
          <p className="text-[12px] leading-relaxed text-slate-400">Bu içerik için resmî fragman veya tanıtım videosu bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Resmî Fragman &amp; Tanıtım</p>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-cyan-400/20 bg-black">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={trailer.embedUrl}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
