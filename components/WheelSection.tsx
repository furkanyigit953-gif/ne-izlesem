'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_FILTER_GENRES } from '../lib/constants';
import { IconFilm, IconSearch, IconTv } from '../lib/homeShared';
import { useHomePageContext } from './HomePageContext';
import Wheel from './Wheel';

export default function WheelSection() {
  const {
    loading,
    activeType,
    setActiveType,
    selectedGenres,
    setSelectedGenres,
    allGenresMustMatch,
    setAllGenresMustMatch,
    watchingWith,
    setWatchingWith,
    useSavedOnly,
    setUseSavedOnly,
    minYear,
    setMinYear,
    maxYear,
    setMaxYear,
    selectedLanguage,
    setSelectedLanguage,
    minRating,
    setMinRating,
    selectedPlatform,
    setSelectedPlatform,
    onlyNew,
    setOnlyNew,
    setCurrentPage,
    allFilteredMovies,
    setSelectedMovieModal,
  } = useHomePageContext();

  const [scrollY, setScrollY] = useState(0);
  const wheelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const miniBarVisible = scrollY > 400;

  const wheelSummary = useMemo(() => {
    const typeLabel = activeType ? activeType : 'Tümü';
    const genreLabel = selectedGenres.length > 0 ? selectedGenres[0] : 'Her Tür';
    const ratingLabel = minRating === 'all' ? 'Her Puan' : `${minRating}+`;
    return `${typeLabel} • ${genreLabel} • ${ratingLabel}`;
  }, [activeType, selectedGenres, minRating]);

  return (
    <>
      {miniBarVisible && (
        <div className="sticky top-3 z-40 mb-4 w-full">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 rounded-2xl border border-cyan-400/25 bg-slate-950/75 px-4 py-3 shadow-[0_18px_45px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.22)]">
                <div className="h-7 w-7 animate-spin rounded-full border-[2.5px] border-transparent border-t-cyan-300 border-r-sky-500" />
                <div className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-300">Mini Çark</p>
                <p className="truncate text-sm font-bold text-white">{wheelSummary}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => wheelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.22)] transition hover:brightness-110"
            >
              Hemen Çevir
            </button>
          </div>
        </div>
      )}

      <section
        ref={wheelRef}
        id="wheel-hero"
        className="relative w-full overflow-hidden rounded-[30px] border border-white/[0.08] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_rgba(9,14,24,0.96)_35%,_rgba(4,8,18,1)_100%)] shadow-[0_28px_80px_rgba(2,6,23,0.75)] transition-all duration-500 ease-out"
      >
        <div className={`relative z-10 px-4 sm:px-6 md:px-8 py-5 sm:py-7`}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 11a8.1 8.1 0 0 0-14.8-4.4L3 9" />
                  <path d="M3 4v5h5" />
                  <path d="M4 13a8.1 8.1 0 0 0 14.8 4.4L21 15" />
                  <path d="M21 20v-5h-5" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-300">Randomizer</p>
                <h1 className="text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl md:text-5xl">
                  Bu akşam ne izleyeceksin?
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                {allFilteredMovies.length} aday
              </span>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                {wheelSummary}
              </span>
            </div>
          </div>

          <div className="mb-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveType(null);
                    setSelectedGenres([]);
                    setAllGenresMustMatch(false);
                    setWatchingWith('all');
                    setUseSavedOnly(false);
                    setSelectedPlatform('all');
                    setMinRating('all');
                    setMinYear('all');
                    setMaxYear('all');
                    setSelectedLanguage('all');
                    setOnlyNew(false);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-[#0d1424] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300 transition hover:border-white/20 hover:text-white"
                >
                  Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => setUseSavedOnly((value) => !value)}
                  className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition ${useSavedOnly ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-[#0d1424] text-slate-300 hover:text-white'}`}
                >
                  Kaydettiklerim
                </button>
              </div>
            </div>

            <div className="mb-5 grid gap-3 xl:grid-cols-[1.1fr_1.3fr_1.2fr]">
              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Platform</span>
                  <span className="text-[10px] text-slate-500">{selectedPlatform === 'all' ? 'Tümü' : selectedPlatform}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[['all', 'Tümü'], ['netflix', 'Netflix'], ['prime', 'Prime'], ['disney', 'Disney+'], ['hbo', 'HBO Max'], ['blutv', 'BluTV'], ['apple', 'Apple TV']].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSelectedPlatform(key); setCurrentPage(1); }}
                      className={`rounded-xl border px-2.5 py-1.5 text-[10px] font-bold transition ${selectedPlatform === key ? 'border-amber-300/45 bg-amber-400/15 text-amber-100' : 'border-white/10 bg-[#101827] text-slate-300 hover:border-amber-300/25 hover:text-white'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
                <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Kiminle İzliyorsun?</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'couple', label: 'Sevgiliyle' },
                    { id: 'friends', label: 'Arkadaşla' },
                    { id: 'family', label: 'Aileyle' },
                    { id: 'solo', label: 'Tek başına' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setWatchingWith(watchingWith === option.id ? 'all' : (option.id as 'all' | 'couple' | 'friends' | 'family' | 'solo'))}
                      className={`rounded-xl border px-2 py-2 text-[10px] font-bold transition ${watchingWith === option.id ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-[#101827] text-slate-300 hover:text-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Min Puan</span>
                  <span className="text-[10px] font-black text-amber-300">{minRating === 'all' ? 'Her puan' : `${minRating}+`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8.5"
                  step="0.5"
                  value={minRating === 'all' ? '0' : minRating}
                  onChange={(e) => setMinRating(Number(e.target.value) === 0 ? 'all' : e.target.value)}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Türler</span>
                <button
                  type="button"
                  onClick={() => setAllGenresMustMatch((value) => !value)}
                  className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 transition hover:text-white"
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${allGenresMustMatch ? 'border-cyan-300 bg-cyan-500 text-black' : 'border-white/20 bg-[#0b1220] text-transparent'}`}>
                    ✓
                  </span>
                  Tüm türler birlikte
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_FILTER_GENRES.map((genre) => {
                  const active = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        setSelectedGenres((prev) => active ? prev.filter((item) => item !== genre) : [...prev, genre]);
                        setCurrentPage(1);
                      }}
                      className={`rounded-xl border px-2.5 py-1.5 text-[10px] font-bold transition ${active ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-[#101827] text-slate-300 hover:text-white'}`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
                <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Yıl Aralığı</div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={minYear} onChange={(e) => { setMinYear(e.target.value); setCurrentPage(1); }} className="h-9 rounded-xl border border-white/10 bg-[#070c16] px-2.5 text-xs font-bold text-white outline-none">
                    <option value="all">Min Yıl</option>
                    {Array.from({ length: 36 }, (_, index) => 1990 + index).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select value={maxYear} onChange={(e) => { setMaxYear(e.target.value); setCurrentPage(1); }} className="h-9 rounded-xl border border-white/10 bg-[#070c16] px-2.5 text-xs font-bold text-white outline-none">
                    <option value="all">Max Yıl</option>
                    {Array.from({ length: 36 }, (_, index) => 1990 + index).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-3.5">
                <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Orijinal Dil</div>
                <select value={selectedLanguage} onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }} className="h-9 w-full rounded-xl border border-white/10 bg-[#070c16] px-2.5 text-xs font-bold text-white outline-none">
                  <option value="all">Tüm Diller</option>
                  <option value="en">İngilizce</option>
                  <option value="tr">Türkçe</option>
                  <option value="ko">Korece</option>
                  <option value="ja">Japonca</option>
                  <option value="fr">Fransızca</option>
                  <option value="es">İspanyolca</option>
                </select>
              </div>
            </div>
          </div>

          <div className="transition-all duration-500 ease-out">
            <Wheel
              movies={allFilteredMovies}
              activeType={activeType}
              selectedGenre={selectedGenres[0] ?? null}
              minRating={minRating}
              selectedPlatform={selectedPlatform}
              onlyNew={onlyNew}
              onSelectMovie={(movie) => setSelectedMovieModal(movie)}
              onSpinChange={() => undefined}
              onTypeChange={() => undefined}
              onGenreChange={() => undefined}
              onPlatformChange={() => undefined}
              onRatingChange={() => undefined}
              onOnlyNewChange={() => undefined}
            />
          </div>

          {!loading && allFilteredMovies.length === 0 && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-xs font-semibold text-amber-200">
              <span className="inline-flex items-center gap-2"><IconSearch className="h-4 w-4" />Bu filtrelerde uygun bir yapım bulunamadı.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
