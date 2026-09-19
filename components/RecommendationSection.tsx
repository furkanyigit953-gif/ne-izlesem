'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function RecommendationSection() {
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
          {recommendation && (
            <div ref={recommendationRef} className="w-full animate-fade-in">
              <div className="relative rounded-3xl bg-[#080e1b] border border-cyan-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
                
                <div className="w-44 sm:w-56 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-950 shrink-0 shadow-2xl border border-white/10">
                  {recommendation.posterUrl ? (
                    <img
                      src={recommendation.posterUrl}
                      alt={recommendation.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Afiş Yok</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between w-full space-y-4 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-lg bg-white/[0.06] text-slate-300 font-medium border border-white/10">
                        {recommendation.genre}
                      </span>
                      <div className="flex items-center gap-2 bg-[#040812] border border-cyan-500/30 px-3 py-1 rounded-lg text-xs">
                        <span className="text-amber-400 font-black">★ {recommendation.imdb}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-300 font-medium">{recommendation.contentType || 'Yapım'}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 font-bold">{recommendation.year}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(recommendation.title)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          userLiked[recommendation.title]
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>👍</span> {likes[recommendation.title] || 142}
                      </button>
                      <button
                        onClick={() => toggleFavorite(recommendation)}
                        className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition cursor-pointer"
                      >
                        {favorites.some((f) => f.title === recommendation.title) ? '❤️ Listemde' : '🤍 Favoriye Ekle'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{recommendation.title}</h2>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2.5 font-normal opacity-90 line-clamp-4">
                      {recommendation.summary}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Nerede İzlenir:</span>
                    {recommendation.platforms && recommendation.platforms.length > 0 ? (
                      recommendation.platforms.map((p, idx) => (
                        <a
                          key={idx}
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#040812] border border-white/10 hover:border-white/30 text-xs font-bold text-white transition shadow-sm hover:scale-105"
                        >
                          {renderPlatformLogo(p.key)}
                          <span className="text-slate-500 text-[10px]">↗</span>
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-cyan-400/80 font-medium">Dijital Platformlar &amp; Sinemalar</span>
                    )}
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recommendation.title + ' fragman')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg> Fragmanı İzle
                    </a>

                    <button
                      onClick={() => shareOnWhatsApp(recommendation)}
                      className="bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12.1 3.2A8.8 8.8 0 0 0 4.5 16l-1 4 4.1-1a8.8 8.8 0 1 0 4.5-15.8Zm0 15.4c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.4.6.6-2.3-.1-.2a7.2 7.2 0 1 1 5.5 2.9Zm4-5.4c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.5.1l-.6.8c-.1.1-.2.1-.4 0-.2-.1-.9-.3-1.7-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.4c-.1 0-.3.1-.4.2-.1.2-.5.5-.5 1.2s.5 1.4.6 1.5c.1.2 1 1.6 2.4 2.2.3.1.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.2-.5 1.3-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2Z"/></svg> WhatsApp ile Paylaş</span>
                    </button>

                    <button
                      onClick={scrollToWheel}
                      className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-bold text-xs px-4 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <span>🎲</span> Beğenmedin mi? Tekrar çevir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

    </>
  );
}
