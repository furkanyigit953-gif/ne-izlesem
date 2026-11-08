'use client';

import React, { useMemo, useState } from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function RecommendationModal() {
  const {
    movies,
    setMovies,
    loading,
    setLoading,
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
    searchQuery,
    setSearchQuery,
    searchOpen,
    setSearchOpen,
    searchActiveIndex,
    setSearchActiveIndex,
    remoteSearchResults,
    setRemoteSearchResults,
    catalogBatch,
    setCatalogBatch,
    searchRequestIdRef,
    minRating,
    setMinRating,
    selectedPlatform,
    setSelectedPlatform,
    onlyNew,
    setOnlyNew,
    userRatings,
    setUserRatings,
    likes,
    setLikes,
    userLiked,
    setUserLiked,
    ITEMS_PER_PAGE,
    currentPage,
    setCurrentPage,
    recommendation,
    setRecommendation,
    favorites,
    setFavorites,
    watchedList,
    setWatchedList,
    watchlist,
    setWatchlist,
    wheelHistory,
    setWheelHistory,
    activeModal,
    setActiveModal,
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    setAiRecommendations,
    listsActiveTab,
    setListsActiveTab,
    selectedMovieModal,
    setSelectedMovieModal,
    wheelResultModalOpen,
    setWheelResultModalOpen,
    authMode,
    setAuthMode,
    regFirstName,
    setRegFirstName,
    regLastName,
    setRegLastName,
    regBirthYear,
    setRegBirthYear,
    regEmail,
    setRegEmail,
    regUsername,
    setRegUsername,
    regPassword,
    setRegPassword,
    loginIdentifier,
    setLoginIdentifier,
    loginPassword,
    setLoginPassword,
    authError,
    setAuthError,
    contactSent,
    setContactSent,
    user,
    setUser,
    userDropdownOpen,
    setUserDropdownOpen,
    bannerCategory,
    setBannerCategory,
    bannerIndex,
    setBannerIndex,
    showFloatingSpin,
    setShowFloatingSpin,
    isSpinning,
    setIsSpinning,
    rouletteItems,
    setRouletteItems,
    spinTranslate,
    setSpinTranslate,
    selectedWheelIndex,
    setSelectedWheelIndex,
    rouletteRef,
    rouletteSpinTokenRef,
    touchStartX,
    touchEndX,
    showcaseRef,
    wheelSectionRef,
    recommendationRef,
    searchContainerRef,
    allFilteredMovies,
    homeDiscoveryRows,
    handleBannerScroll,
    handleTouchStart,
    handleTouchEnd,
    handleRate,
    handleLike,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    handleSelectRecommendation,
    handleSpin,
    shareOnWhatsApp,
    searchSuggestions,
    openSearchResult,
    handleSearch,
    cleanTurkish,
    handleGenerateUsername,
    handleRegister,
    handleLogin,
    totalPages,
    startIndex,
    displayedMovies,
    changePage,
    scrollToWheel,
    getPaginationPages,
    currentBannerList,
    top5Highlights
  } = useHomePageContext();

  const modalPosterSrc = useMemo(() => {
    if (!recommendation) return '';
    const typed = recommendation as typeof recommendation & { poster_path?: string | null };
    const posterValue = typed.poster_path ? `https://image.tmdb.org/t/p/w500${typed.poster_path}` : recommendation.posterUrl;
    return getPosterSrc(posterValue || '');
  }, [recommendation]);
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <>
      {wheelResultModalOpen && recommendation && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Çark sonucu"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setWheelResultModalOpen(false);
          }}
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-[#020308]/92 backdrop-blur-xl" />

          {/* AMBIENT GLOWS */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute left-[18%] top-[22%] w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

          {/* MODAL */}
          <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[28px] border border-cyan-400/35 bg-[#0b0d16] shadow-[0_30px_120px_rgba(0,0,0,0.9),0_0_70px_rgba(34,211,238,0.12)]" style={{ animation: 'modalScaleIn 0.28s ease-out forwards' }}>

            {/* TOP GLOW LINE */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-[38%_62%] min-h-[540px]">

              {/* LEFT - POSTER */}
              <div className="relative min-h-[360px] md:min-h-[540px] bg-[#05060a] overflow-hidden">
                {!posterFailed && modalPosterSrc ? (
                  <img
                    src={modalPosterSrc}
                    alt={recommendation.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setPosterFailed(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.28),_rgba(10,13,21,0.94)_35%,_rgba(2,6,23,1)_100%)] px-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.22)]">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3" y="4" width="18" height="16" rx="2.5" />
                          <path d="M7 4v16M17 4v16M3 9h18M3 15h18" />
                        </svg>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">Poster</p>
                      <p className="mt-2 max-w-[240px] text-sm font-bold text-white">{recommendation.title}</p>
                    </div>
                  </div>
                )}

                {/* POSTER OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[#0b0d16]/80" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:hidden" />

                {/* RESULT BADGE */}
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-black/45 backdrop-blur-md px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-cyan-100 shadow-lg">
                  <span className="text-cyan-300">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3v18M3 12h18" />
                      <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
                    </svg>
                  </span>
                  Çarkın Seçimi
                </div>
              </div>

              {/* RIGHT - DETAILS */}
              <div className="relative flex min-h-0 flex-col p-6 sm:p-8 md:p-9">

                {/* CLOSE / SHARE */}
                <div className="absolute right-5 top-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => shareOnWhatsApp(recommendation)}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center transition"
                    title="WhatsApp ile paylaş"
                  >
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="7" cy="12" r="1.4" fill="currentColor" stroke="none" />
                      <circle cx="12" cy="8" r="1.4" fill="currentColor" stroke="none" />
                      <circle cx="17" cy="12" r="1.4" fill="currentColor" stroke="none" />
                      <path d="M8.2 11 11 9M13 9l2.8 2M8.2 13 11 15M13 15l2.8-2" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWheelResultModalOpen(false)}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center transition"
                    title="Kapat"
                  >
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>

                <div className="pr-24">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/35 bg-amber-950/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-100">
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                      </svg>
                      Çark Sonucu
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-bold text-slate-200">{recommendation.contentType || 'Yapım'}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.02]">
                    {recommendation.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm font-medium italic text-slate-500">
                    {recommendation.genre}
                  </p>
                </div>

                {/* META */}
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-200/75">★ IMDb</span>
                    <span className="text-2xl font-black leading-none text-[var(--rating)]">{recommendation.imdb}</span>
                    <span className="text-[10px] text-slate-500">/10</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-bold text-slate-200">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M7 2v4M17 2v4M3 9h18" />
                    </svg>
                    {recommendation.year}
                  </div>

                  {recommendation.durationOrSeason && (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      {recommendation.durationOrSeason}
                    </div>
                  )}
                </div>

                {/* SUMMARY */}
                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#060912] overflow-hidden">
                  <div className="max-h-44 sm:max-h-52 overflow-y-auto custom-scrollbar p-4 sm:p-5">
                    <p className="text-sm leading-6 text-slate-300">
                      {recommendation.summary || 'Bu yapım hakkında detaylı bilgi bulunamadı.'}
                    </p>
                  </div>
                </div>

                {/* PLATFORM */}
                <div className="mt-5">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Nerede İzlenir
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.platforms && recommendation.platforms.length > 0 ? (
                      recommendation.platforms.map((p, idx) => (
                        <a
                          key={idx}
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition"
                        >
                          {renderPlatformLogo(p.key)}
                          <span className="text-slate-500 text-[10px]">↗</span>
                        </a>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Dijital platformlar / sinemalar</span>
                    )}
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="mt-auto pt-6 flex flex-wrap items-center gap-2.5">
                    <button
                    type="button"
                    onClick={() => toggleFavorite(recommendation)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                      favorites.some((f) => f.title === recommendation.title)
                        ? 'border-rose-400/40 bg-rose-400/10 text-rose-200'
                        : 'border-amber-300/25 bg-amber-400/10 text-amber-100 hover:border-amber-200/50 hover:bg-amber-400/15'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.2Z" />
                    </svg>
                    {favorites.some((f) => f.title === recommendation.title) ? 'Favoride' : 'Favoriye Ekle'}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWatchlist(recommendation)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3-6 3V4.5Z" />
                    </svg>
                    İzleme Listem
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWatched(recommendation)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                    İzledim
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recommendation.title + ' fragman')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black hover:bg-slate-200 transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                      <path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.2 4.7 12 4.7 12 4.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29.5 29.5 0 0 0 2.6 12 29.5 29.5 0 0 0 3 16.8a2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29.5 29.5 0 0 0 .4-4.8 29.5 29.5 0 0 0-.4-4.8Z" />
                      <path d="m10 9 5 3-5 3V9Z" fill="white" />
                    </svg>
                    Fragmanı İzle
                  </a>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setWheelResultModalOpen(false);
                      setSelectedMovieModal(recommendation);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#172033] px-4 py-3 text-xs font-black text-white hover:bg-[#202b40] transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 12h16M13 5l7 7-7 7" />
                    </svg>
                    Detayları Aç
                  </button>

                  <button
                    type="button"
                    onClick={() => shareOnWhatsApp(recommendation)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-xs font-black text-cyan-100 hover:bg-cyan-500/20 transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <circle cx="6" cy="12" r="2.2" />
                      <circle cx="18" cy="6" r="2.2" />
                      <circle cx="18" cy="18" r="2.2" />
                      <path d="m8 11 7.5-4M8 13l7.5 4" />
                    </svg>
                    Paylaş
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWheelResultModalOpen(false);
                      setTimeout(() => handleSpin(), 120);
                    }}
                    className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-3 text-xs font-black text-white shadow-[0_10px_30px_rgba(14,165,233,0.18)] hover:brightness-110 transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M20 11a8.1 8.1 0 0 0-14.8-4.4L3 9" />
                      <path d="M3 4v5h5M4 13a8.1 8.1 0 0 0 14.8 4.4L21 15" />
                      <path d="M21 20v-5h-5" />
                    </svg>
                    Tekrar Çevir
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.94) translateY(14px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
