'use client';

import React from 'react';
import MovieCard from './MovieCard';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function DiscoverySection() {
  const {
    movies,
    setMovies,
    loading,
    setLoading,
    catalogError,
    retryCatalogLoad,
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
          {catalogError && (
            <section className="mb-6 rounded-[28px] border border-rose-400/25 bg-rose-500/5 p-6 text-center shadow-[0_18px_50px_rgba(244,63,94,0.08)]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-300">Hata</p>
              <h3 className="mt-3 text-2xl font-black text-white">Bir şeyler ters gitti.</h3>
              <p className="mt-2 text-sm text-slate-300">Filmleri yükleyemedik. Lütfen tekrar dene.</p>
              <button type="button" onClick={retryCatalogLoad} className="mt-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] transition hover:brightness-110">Tekrar Dene</button>
            </section>
          )}

          {!catalogError && loading && (
            <section className="w-full space-y-8" aria-label="Yükleniyor">
              {[1,2,3].map((row) => (
                <div key={row} className="space-y-4">
                  <div className="skeleton h-4 w-32 rounded-full" />
                  <div className="flex gap-4 overflow-hidden pb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`${row}-${index}`} className="w-[168px] shrink-0 sm:w-[185px] md:w-[195px]">
                        <div className="skeleton aspect-[2/3] rounded-[24px]" />
                        <div className="mt-3 space-y-2">
                          <div className="skeleton h-3 w-20 rounded-full" />
                          <div className="skeleton h-4 w-28 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {!catalogError && !loading && allFilteredMovies.length === 0 && (
            <section className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Sonuç Yok</p>
              <h3 className="mt-3 text-3xl font-black text-white">Aradığını bulamadık.</h3>
              <p className="mt-3 text-sm text-slate-300">Filtrelerini biraz genişletmeyi deneyebilirsin.</p>
              <button type="button" onClick={() => { setActiveType(null); setSelectedGenres([]); setAllGenresMustMatch(false); setWatchingWith('all'); setUseSavedOnly(false); setSelectedPlatform('all'); setMinRating('all'); setMinYear('all'); setMaxYear('all'); setSelectedLanguage('all'); setOnlyNew(false); setCurrentPage(1); }} className="mt-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-black text-white">Filtreleri Temizle</button>
            </section>
          )}

          {!catalogError && !loading && allFilteredMovies.length > 0 && (
          <section className="w-full space-y-8" aria-label="Ana sayfa keşif rafları">
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300/80">ŞU AN GÜNDEMDE</div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">Popüler Yapımlar</h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">İzleyicilerin en çok konuştuğu ve öne çıkan içerikler.</p>
                </div>
                <span className="hidden sm:inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] font-bold text-slate-500">12 seçki</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 pr-1 snap-x snap-mandatory [scrollbar-width:thin]" style={{ scrollbarColor: 'rgba(56,189,248,.35) transparent' }}>
                {homeDiscoveryRows.popular.map((item, idx) => (
                  <div key={`popular-${item.title}-${item.year}-${idx}`} className="w-[168px] sm:w-[185px] md:w-[195px] shrink-0 snap-start">
                    <MovieCard
                      item={item}
                      isFav={favorites.some((f) => f.title === item.title)}
                      onSelect={setSelectedMovieModal}
                      onToggleFav={toggleFavorite}
                      renderLogo={renderPlatformLogo}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300/80">YENİ GİRİŞLER</div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">Yeni & Taze Yapımlar</h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">Son dönemden dikkat çeken film ve diziler.</p>
                </div>
                <span className="hidden sm:inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] font-bold text-slate-500">Son 2 yıl</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 pr-1 snap-x snap-mandatory [scrollbar-width:thin]" style={{ scrollbarColor: 'rgba(56,189,248,.35) transparent' }}>
                {homeDiscoveryRows.fresh.map((item, idx) => (
                  <div key={`fresh-${item.title}-${item.year}-${idx}`} className="w-[168px] sm:w-[185px] md:w-[195px] shrink-0 snap-start">
                    <MovieCard
                      item={item}
                      isFav={favorites.some((f) => f.title === item.title)}
                      onSelect={setSelectedMovieModal}
                      onToggleFav={toggleFavorite}
                      renderLogo={renderPlatformLogo}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-gradient-to-br from-[#070d19] via-[#07101c] to-[#050914] p-4 sm:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300/80">KATEGORİ LİDERLERİ</div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">İlk 10</h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">Her türden puanı en yüksek öne çıkan 10 yapım.</p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-extrabold text-cyan-300">IMDb / popülerlik bazlı</span>
              </div>

              <div className="space-y-8">
                {[
                  { key: 'comedy', label: 'Komedi', desc: 'Gülmek isteyenlere', accent: 'text-amber-300', dot: 'bg-amber-300' },
                  { key: 'horror', label: 'Korku', desc: 'Gerilimi yükseltenler', accent: 'text-violet-300', dot: 'bg-violet-300' },
                  { key: 'action', label: 'Aksiyon', desc: 'Tempo hiç düşmesin diyenlere', accent: 'text-cyan-300', dot: 'bg-cyan-300' },
                ].map((row) => {
                  const items = homeDiscoveryRows[row.key as 'comedy' | 'horror' | 'action'];
                  return (
                    <div key={row.key}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${row.dot} shadow-[0_0_12px_currentColor]`} />
                        <h3 className={`text-base sm:text-lg font-black ${row.accent}`}>{row.label}</h3>
                        <span className="text-[10px] font-semibold text-slate-600">{row.desc}</span>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-3 pr-1 snap-x snap-mandatory [scrollbar-width:thin]" style={{ scrollbarColor: 'rgba(56,189,248,.28) transparent' }}>
                        {items.map((item, idx) => (
                          <div key={`${row.key}-${item.title}-${item.year}-${idx}`} className="relative w-[168px] sm:w-[185px] md:w-[195px] shrink-0 snap-start">
                            <div className="pointer-events-none absolute left-2.5 top-2.5 z-40 rounded-lg border border-white/10 bg-[#050914]/90 px-2 py-1 text-[9px] font-black text-slate-300 backdrop-blur-md">
                              #{idx + 1}
                            </div>
                            <MovieCard
                              item={item}
                              isFav={favorites.some((f) => f.title === item.title)}
                              onSelect={setSelectedMovieModal}
                              onToggleFav={toggleFavorite}
                              renderLogo={renderPlatformLogo}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          )}

    </>
  );
}
