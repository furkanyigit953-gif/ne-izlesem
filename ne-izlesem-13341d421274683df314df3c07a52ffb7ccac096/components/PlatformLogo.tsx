'use client';

type PlatformLogoProps = {
  platform: string;
};

export default function PlatformLogo({ platform }: PlatformLogoProps) {
  switch (platform) {
    case 'netflix':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#E50914] bg-black/80 px-2 py-0.5 rounded border border-[#E50914]/40 shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span>
          Netflix
        </span>
      );

    case 'prime':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#00A8E1] bg-[#001428] px-2 py-0.5 rounded border border-[#00A8E1]/40 shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E1]"></span>
          Prime
        </span>
      );

    case 'max':
      return (
        <span className="font-black text-[10px] tracking-tight text-white bg-blue-700 px-2 py-0.5 rounded shadow-sm">
          MAX
        </span>
      );

    case 'blutv':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#00D1FF] bg-[#021827] px-2 py-0.5 rounded border border-[#00D1FF]/40 shadow-sm">
          BluTV
        </span>
      );

    case 'disney':
      return (
        <span className="font-black text-[10px] tracking-tight text-[#113CCF] bg-white px-2 py-0.5 rounded shadow-sm">
          Disney+
        </span>
      );

    default:
      return (
        <span className="font-bold text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
          ▶ İzle
        </span>
      );
  }
}