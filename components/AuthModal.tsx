'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function AuthModal() {
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
      {activeModal === 'auth' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#080d18] border border-white/15 rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative text-left animate-modal-in">
            <button 
              onClick={() => { setActiveModal(null); setAuthError(''); }} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10 mb-6 max-w-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                  authMode === 'register' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yeni Hesap Aç
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                  authMode === 'login' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
            </div>

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">Profilini Oluştur</h3>
                  <p className="text-xs text-slate-400 mt-1">Favorilerini ve izleme listelerini kişiselleştirmek için hemen kaydol.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Adınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Adınız"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Soyadınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Soyadınız"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Doğum Yılı *</label>
                    <select
                      value={regBirthYear}
                      onChange={(e) => setRegBirthYear(e.target.value)}
                      className="w-full bg-[#0e1627] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      {Array.from({ length: 65 }, (_, i) => 2015 - i).map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">E-posta veya Telefon</label>
                    <input
                      type="text"
                      placeholder="ornek@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-400">Kullanıcı Adı *</label>
                    <button
                      type="button"
                      onClick={handleGenerateUsername}
                      className="text-[11px] font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 px-2.5 py-0.5 rounded-lg transition"
                    >
                      <span>✨</span> Oto Oluştur
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 text-xs font-bold">@</span>
                    <input
                      type="text"
                      required
                      placeholder="kullaniciadi24"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Şifre</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {authError && <p className="text-xs text-rose-400 font-semibold text-center">{authError}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 text-black font-black text-xs py-3.5 rounded-xl shadow-lg cursor-pointer hover:opacity-95 transition active:scale-95 mt-2"
                >
                  Hesabı Oluştur ve Giriş Yap →
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">Tekrar Hoş Geldin</h3>
                  <p className="text-xs text-slate-400 mt-1">Kullanıcı adını veya e-postanı girerek hesabına eriş.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Kullanıcı Adı veya E-posta</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="@kullaniciadi veya ornek@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Şifre</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {authError && <p className="text-xs text-rose-400 font-semibold text-center">{authError}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs py-3.5 rounded-xl shadow-lg cursor-pointer hover:opacity-95 transition active:scale-95 mt-2"
                >
                  Oturum Aç →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </>
  );
}
