'use client';

import type { TmdbDetail } from '@/lib/tmdb';
import { pickYoutubeTrailer } from '@/lib/detailMedia';

export default function TrailerSection({ detail }: { detail: TmdbDetail }) {
  const trailer = pickYoutubeTrailer(detail.videos);

  if (!trailer) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Resmî Fragman &amp; Tanıtım</p>
        <p className="mt-4 text-sm text-slate-400">Fragman bilgisi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-4 shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Resmî Fragman &amp; Tanıtım</p>
      <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
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
