'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function HomeSidebar() {
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
        <aside className="hidden xl:flex w-[380px] 2xl:w-[420px] shrink-0 flex-col gap-4 sticky top-24 self-start transition-all">
          <div className="bg-gradient-to-br from-[#0c1424] via-[#080d18] to-[#060a12] border border-white/15 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-black text-sm">👑 Haftanın Zirve 5'lisi</span>
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-lg font-extrabold tracking-wider uppercase">
                En İyiler
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {top5Highlights.map((item, idx) => (
                <div
                  key={item.title}
                  onClick={() => setSelectedMovieModal(item)}
                  className="bg-[#0b101b] hover:bg-[#111a2a] border border-white/10 hover:border-cyan-400/60 rounded-2xl p-3.5 shadow-md transition-all duration-300 cursor-pointer group flex flex-col gap-2.5 relative overflow-hidden hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-28 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-md">
                      {item.posterUrl ? (
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">Afiş Yok</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between h-28 py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            idx === 0 ? 'bg-amber-400 text-black shadow-sm' : idx === 1 ? 'bg-slate-200 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-200'
                          }`}>
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                            ★ {item.imdb}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white group-hover:text-cyan-400 transition truncate leading-snug">
                          {item.title}
                        </h4>

                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                          <span>{item.year}</span>
                          <span>•</span>
                          <span className="text-cyan-300/90 font-medium truncate">{item.genre}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

    </>
  );
}
