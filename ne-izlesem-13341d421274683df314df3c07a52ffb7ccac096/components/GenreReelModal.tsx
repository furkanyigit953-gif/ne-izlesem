'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MovieItem } from '../types/movie';

interface GenreReelModalProps {
  genre: string | null;
  movies: MovieItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: MovieItem) => void;
}

export default function GenreReelModal({
  genre,
  movies,
  isOpen,
  onClose,
  onSelectMovie,
}: GenreReelModalProps) {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelOffset, setReelOffset] = useState<number>(0);
  const [winnerMovie, setWinnerMovie] = useState<MovieItem | null>(null);

  const reelContainerRef = useRef<HTMLDivElement | null>(null);

  // Seçilen türden 25 filmlik seçkin havuz
  const genrePool = useMemo(() => {
    if (!genre) return movies.slice(0, 25);
    const filtered = movies.filter((m) =>
      m.genre.toLowerCase().includes(genre.toLowerCase())
    );
    const pool = filtered.length >= 8 ? filtered : movies;
    return pool.slice(0, 25);
  }, [genre, movies]);

  // Akıcı ve kesintisiz akış için 3 seti art arda bağlıyoruz (75 kart)
  const carouselTrack = useMemo(() => {
    if (genrePool.length === 0) return [];
    return [...genrePool, ...genrePool, ...genrePool];
  }, [genrePool]);

  // Modal her açıldığında sıfırla
  useEffect(() => {
    if (isOpen) {
      setIsSpinning(false);
      setReelOffset(0);
      setWinnerMovie(null);
    }
  }, [isOpen, genre]);

  if (!isOpen || !genre) return null;

  const spinReel = () => {
    if (isSpinning || genrePool.length === 0) return;
    setIsSpinning(true);
    setWinnerMovie(null);

    const winningIndex = Math.floor(Math.random() * genrePool.length);
    const chosen = genrePool[winningIndex];

    const CARD_WIDTH = 154; // 142px kart + 12px gap
    const containerWidth = reelContainerRef.current?.offsetWidth || 700;
    const centerPoint = containerWidth / 2;

    const targetIndexInTrack = genrePool.length + winningIndex;
    const targetTranslateX = targetIndexInTrack * CARD_WIDTH + CARD_WIDTH / 2 - centerPoint;

    // Organik durması için çok hafif milimetrik sapma
    const randomJitter = (Math.random() - 0.5) * 25;
    const finalOffset = targetTranslateX + randomJitter;

    setReelOffset(0);
    setTimeout(() => {
      setReelOffset(finalOffset);
    }, 40);

    setTimeout(() => {
      setIsSpinning(false);
      setWinnerMovie(chosen);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#0c1424] via-[#080d18] to-[#040711] border border-cyan-500/30 rounded-[36px] w-full max-w-4xl p-6 sm:p-9 shadow-[0_25px_100px_rgba(6,182,212,0.25)] relative text-center flex flex-col items-center">
        
        {/* KAPAT BUTONU */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-black transition cursor-pointer border border-white/10"
        >
          ✕
        </button>

        {/* BAŞLIK VE PREMİUM ETİKET */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300">Özel Tür Makinesi</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {genre} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">Koleksiyonu</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Seçtiğin türe ait en popüler 25 yapım makaraya dizildi. Çarkı çevir ve bu akşamki tercihini belirle!
          </p>
        </div>

        {/* YATAY KAYAN RULET MAKİNESİ */}
        <div className="w-full relative bg-[#040711] border border-white/15 rounded-3xl p-4 shadow-inner overflow-hidden mb-6">
          
          {/* ORTADAKİ NEON İŞARETÇİ */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-cyan-400 via-cyan-300 to-cyan-400 z-30 shadow-[0_0_20px_#06b6d4] pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[11px] border-t-cyan-400 drop-shadow-[0_0_8px_#06b6d4]"></div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[11px] border-b-cyan-400 drop-shadow-[0_0_8px_#06b6d4]"></div>
          </div>

          {/* SAĞ VE SOL SİNEMATİK KARARTMA (FADE) */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#040711] via-[#040711]/90 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#040711] via-[#040711]/90 to-transparent z-20 pointer-events-none"></div>

          {/* FİLM ŞERİDİ */}
          <div ref={reelContainerRef} className="w-full overflow-hidden py-1">
            <div
              className="flex items-center gap-3 select-none"
              style={{
                transform: `translateX(-${reelOffset}px)`,
                transition: isSpinning ? 'transform 3.8s cubic-bezier(0.12, 0.95, 0.15, 1)' : 'none',
                willChange: 'transform',
              }}
            >
              {carouselTrack.map((item, cIdx) => (
                <div
                  key={cIdx}
                  className="w-[142px] shrink-0 bg-[#080d18] border border-white/10 rounded-2xl overflow-hidden shadow-lg group relative transition-all"
                >
                  <div className="w-full aspect-[2/3] bg-slate-950 relative overflow-hidden">
                    {item.posterUrl ? (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">Afiş Yok</div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded-md text-[10px] font-black text-amber-400 border border-white/10">
                      ★ {item.imdb}
                    </div>
                  </div>

                  <div className="p-2.5 text-left bg-[#070c17]">
                    <h5 className="text-xs font-black text-white truncate">{item.title}</h5>
                    <span className="text-[10px] text-cyan-400 font-semibold">{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KAZANAN FİLM AÇILDIĞINDA */}
        {winnerMovie && !isSpinning && (
          <div className="w-full mb-6 p-4 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 border border-cyan-400/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">🏆</span>
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">İbrede Kalan Kazanan</span>
                <h4 className="text-base font-black text-white">{winnerMovie.title} ({winnerMovie.year})</h4>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectMovie(winnerMovie);
                onClose();
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Hemen İncele &amp; İzle →
            </button>
          </div>
        )}

        {/* BUTONLAR */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button
            onClick={spinReel}
            disabled={isSpinning || genrePool.length === 0}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:opacity-95 text-black font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_35px_rgba(6,182,212,0.4)] transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isSpinning ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Makara Hızla Dönüyor...</span>
              </>
            ) : (
              <>
                <span>🎰</span>
                <span>{genre} Filmini Çevir (25 Film)</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition border border-white/10 cursor-pointer"
          >
            Kapat / Geri Dön
          </button>
        </div>

      </div>
    </div>
  );
}