'use client';

import { useState } from 'react';

const PosterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-cyan-200/80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M7 4v16M17 4v16M3 9h18M3 15h18" />
    <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
  </svg>
);

export default function MediaPoster({
  src,
  alt,
  width = 300,
  height = 450,
  className = '',
}: {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  const safeSrc = src && !hasError ? src : '';

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_rgba(4,8,18,1)_50%,_rgba(2,6,23,1))] ${className}`}
      style={width > 0 && height > 0 ? { width, height } : undefined}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-slate-800/90" />
      )}

      {safeSrc ? (
        <img
          src={safeSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition duration-300 ease-out"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#08111d] text-cyan-200/80">
          <PosterIcon />
        </div>
      )}
    </div>
  );
}
