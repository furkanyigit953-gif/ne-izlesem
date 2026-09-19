'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function InfoModals() {
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
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080d18] border border-white/15 rounded-3xl w-full max-w-lg p-7 shadow-2xl relative text-left animate-modal-in">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎬</span>
              <h3 className="text-xl font-black text-white">Hakkımızda</h3>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-cyan-400">Ne İzlesem?</strong>, "Akşam ne izlesem?" kararsızlığını ortadan kaldırmak amacıyla geliştirilmiş yeni nesil bir film ve dizi keşif motorudur.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080d18] border border-white/15 rounded-3xl w-full max-w-lg p-7 shadow-2xl relative text-left animate-modal-in">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-black text-white">Gizlilik Politikası</h3>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
              <p>
                Ne İzlesem olarak ziyaretçilerimizin gizliliğine ve kişisel verilerine azami özen gösteriyoruz.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080d18] border border-white/15 rounded-3xl w-full max-w-md p-7 shadow-2xl relative text-left animate-modal-in">
            <button onClick={() => { setActiveModal(null); setContactSent(false); }} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold">✕</button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📬</span>
              <h3 className="text-xl font-black text-white">Bize Ulaşın</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Görüş, öneri veya hata bildirimleriniz için mesaj bırakabilirsiniz.
            </p>

            {contactSent ? (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-2">
                <span className="text-2xl block">🎉</span>
                <h4 className="font-black text-sm text-white">Mesajınız Alındı!</h4>
                <p className="text-xs text-slate-300">Geri bildiriminiz için teşekkürler.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">E-posta Adresiniz</label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@gmail.com"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Görüş veya önerinizi buraya yazabilirsiniz..."
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs py-3 rounded-xl shadow-lg cursor-pointer hover:opacity-90 transition active:scale-95"
                >
                  Mesajı Gönder →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </>
  );
}
