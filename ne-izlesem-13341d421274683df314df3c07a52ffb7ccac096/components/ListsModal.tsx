'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function ListsModal() {
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
      {activeModal === 'lists' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080d18] border border-white/15 rounded-[32px] w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-modal-in">
            <div className="flex flex-wrap items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-black/40 gap-4">
              <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setListsActiveTab('favorites')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    listsActiveTab === 'favorites' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ❤️ Favorilerim ({favorites.length})
                </button>
                <button
                  onClick={() => setListsActiveTab('watchlist')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    listsActiveTab === 'watchlist' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⏳ İzleme Listem ({watchlist.length})
                </button>
                <button
                  onClick={() => setListsActiveTab('watched')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    listsActiveTab === 'watched' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✅ İzlediklerim ({watchedList.length})
                </button>
                <button
                  onClick={() => setListsActiveTab('wheel')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    listsActiveTab === 'wheel' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Çark Geçmişi ({wheelHistory.length})
                </button>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-black transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {(() => {
                const currentList =
                  listsActiveTab === 'favorites'
                    ? favorites
                    : listsActiveTab === 'watchlist'
                    ? watchlist
                    : listsActiveTab === 'watched'
                    ? watchedList
                    : wheelHistory;

                if (currentList.length === 0) {
                  return (
                    <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl opacity-50">📂</span>
                      <h4 className="text-base font-bold text-white">Bu listenizde henüz bir yapım yok</h4>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {currentList.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedMovieModal(item)}
                        className="bg-[#0b101b] border border-white/10 hover:border-cyan-400/80 rounded-2xl overflow-hidden p-2.5 text-left cursor-pointer transition-all hover:scale-[1.02] shadow-lg group flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 mb-2.5 shadow-md">
                            <img
                              src={item.posterUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15">
                              <span className="text-[10px] font-black text-amber-400">★ {item.imdb}</span>
                            </div>
                          </div>
                          <h4 className="font-bold text-xs text-white truncate group-hover:text-cyan-400 transition">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.year} • {item.genre.split(',')[0]}</p>
                        </div>
                        <button className="mt-2.5 w-full py-1.5 rounded-lg bg-white/5 group-hover:bg-cyan-500 group-hover:text-black text-[10px] font-black text-slate-300 transition">
                          İncele →
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
