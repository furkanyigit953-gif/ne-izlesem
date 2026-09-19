'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function HomeBanner() {
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
  
    return (
    <>
          {currentBannerList.length > 0 && (
            <div className="w-full transition-all duration-500">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]"></div>
                  <div className="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#09101f]/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                    <button
                      onClick={() => { setBannerCategory('popular'); setBannerIndex(0); }}
                      className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${bannerCategory === 'popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🔥 Popülerler
                    </button>
                    <button
                      onClick={() => { setBannerCategory('topRated'); setBannerIndex(0); }}
                      className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${bannerCategory === 'topRated' ? 'bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-white ring-1 ring-inset ring-cyan-300/25 shadow-[0_6px_20px_rgba(14,165,233,0.12)]' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${bannerCategory === 'topRated' ? 'bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.8)]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                      Zirvedekiler
                    </button>
                    <button
                      onClick={() => { setBannerCategory('mostDiscussed'); setBannerIndex(0); }}
                      className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${bannerCategory === 'mostDiscussed' ? 'bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-white ring-1 ring-inset ring-cyan-300/25 shadow-[0_6px_20px_rgba(14,165,233,0.12)]' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${bannerCategory === 'mostDiscussed' ? 'bg-indigo-300 shadow-[0_0_10px_rgba(165,180,252,0.8)]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                      Gündem
                    </button>
                  </div>
                </div>

                <div className="ml-auto hidden items-center gap-3 sm:flex">
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-500">
                    {movies.length >= 1500 ? '1.500+ içerik' : `${movies.length.toLocaleString('tr-TR')} içerik yükleniyor`}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleBannerScroll('left')}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 flex items-center justify-center text-white transition cursor-pointer shadow-md active:scale-95"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handleBannerScroll('right')}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 flex items-center justify-center text-white transition cursor-pointer shadow-md active:scale-95"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div 
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0c1424] via-[#080d18] to-[#060a12] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none group"
              >
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
                >
                  {currentBannerList.map((item, idx) => (
                    <div key={idx} className="w-full shrink-0 flex flex-col md:flex-row items-center relative min-h-[300px] sm:min-h-[340px] p-6 sm:p-10">
                      <div className="w-32 sm:w-48 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-2xl z-10 flex items-center justify-center border border-white/10 group-hover:scale-102 transition-transform duration-300">
                        {item.posterUrl ? (
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="w-full h-full object-cover z-10 relative"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-3xl mb-1 opacity-60">🎬</span>
                            <span className="text-xs font-bold text-white">{item.title}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center md:text-left md:ml-8 space-y-3 z-10 mt-4 md:mt-0">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                          <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 font-extrabold uppercase tracking-wider">
                            {bannerCategory === 'popular' ? 'En Popüler' : bannerCategory === 'topRated' ? 'Başyapıt' : 'Eleştiri Odağı'}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">{item.genre}</span>
                          <div className="flex items-center gap-1.5 bg-blue-950/80 border border-cyan-500/40 px-3 py-0.5 rounded-full">
                            <span className="text-xs font-bold text-amber-400">★ {item.imdb}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-xs font-semibold text-cyan-400">{item.durationOrSeason}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-md">{item.year}</span>
                          </div>
                        </div>

                        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-3 font-normal">{item.summary}</p>

                        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <button
                            onClick={() => setSelectedMovieModal(item)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
                          >
                            Detayları İncele →
                          </button>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' fragman')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl transition border border-white/10 flex items-center gap-2 cursor-pointer active:scale-95"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg> Fragman
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
                  {currentBannerList.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setBannerIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        bannerIndex === dotIdx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

    </>
  );
}
