'use client';

import React from 'react';
import { ALL_FILTER_GENRES } from '../lib/constants';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function FilterPanel() {
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
          <div
            ref={wheelSectionRef}
            className="w-full bg-gradient-to-br from-[#070c18] via-[#060a13] to-[#04070d] rounded-[28px] border border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.48)] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_65%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.08),transparent_65%)] pointer-events-none" />

            {/* ÜST BAŞLIK + FİLM/DİZİ */}
            <div className="relative z-10 px-5 sm:px-7 md:px-8 pt-7 pb-5">
              <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/[0.07] border border-cyan-400/20 text-cyan-300 text-[10px] font-extrabold tracking-[0.16em] uppercase">
                    <IconSparkles className="w-3.5 h-3.5" />
                    KARARSIZLIĞA SON
                  </div>
                  <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black leading-[1.04] tracking-[-0.045em] text-white">
                    Ne izleyeceğine karar verme.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Biz seçelim.</span>
                  </h1>
                  <p className="mt-3 text-sm sm:text-[15px] leading-6 text-slate-400 max-w-xl">
                    İstediğin kriterleri belirle, akıllı çarkı çevir ve bu akşamın favori içeriğini anında bul.
                  </p>
                </div>

              </div>
            </div>

            {/* TAM FİLTRE PANELİ — İLK GÖRSELDEKİ YERLEŞİM */}
            <div className="relative z-10 mx-5 sm:mx-7 md:mx-8 rounded-[22px] border border-white/[0.08] bg-[#11141d]/95 shadow-[0_16px_50px_rgba(0,0,0,0.34)] p-4 sm:p-5 md:p-6">

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center bg-[#070c16] p-1 rounded-2xl border border-white/[0.07] shadow-inner">
                  {[
                    { id: 'all', label: 'Tümü', icon: <IconSparkles className="w-3.5 h-3.5" /> },
                    { id: 'Film', label: 'Film', icon: <IconFilm className="w-3.5 h-3.5" /> },
                    { id: 'Dizi', label: 'Dizi', icon: <IconTv className="w-3.5 h-3.5" /> },
                  ].map((tab) => {
                    const isActive = (tab.id === 'all' && activeType === null) || activeType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => { setActiveType(tab.id === 'all' ? null : (tab.id as 'Film' | 'Dizi')); setCurrentPage(1); }}
                        className={`h-10 min-w-[88px] px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer ${isActive ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#211707] shadow-[0_8px_20px_rgba(245,185,66,0.22)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

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
                    className="h-10 px-3.5 rounded-xl bg-[#0d1424] border border-white/10 text-slate-400 hover:text-white text-xs font-bold cursor-pointer transition"
                  >
                    ↻ Sıfırla
                  </button>
                  <button type="button" className="h-10 px-3.5 rounded-xl bg-[#172033] border border-white/10 text-slate-200 text-xs font-extrabold cursor-pointer">☷ Filtreler ˄</button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-500">KİMİNLE İZLİYORSUN? (HIZLI RUH HALİ)</span>
                  <div className="flex items-center gap-2">
                    <button type="button" className="h-8 px-3 rounded-lg border border-fuchsia-400/40 bg-fuchsia-500/[0.08] text-fuchsia-300 text-[10px] font-extrabold cursor-pointer">✦ Zevkime Göre Filtrele</button>
                    <button
                      type="button"
                      onClick={() => setUseSavedOnly((v) => !v)}
                      className={`h-8 px-3 rounded-lg border text-[10px] font-extrabold cursor-pointer transition ${useSavedOnly ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/40' : 'bg-cyan-500/[0.04] text-cyan-300 border-cyan-400/30'}`}
                    >
                      ♡ Kaydettiklerimden Çevir
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { id: 'couple', label: '♡ Sevgiliyle / Çift' },
                    { id: 'friends', label: '♧ Arkadaşlarla' },
                    { id: 'family', label: '☺ Aileyle' },
                    { id: 'solo', label: '♙ Tek Başıma' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWatchingWith(watchingWith === item.id ? 'all' : (item.id as 'couple' | 'friends' | 'family' | 'solo'))}
                      className={`h-11 rounded-xl border text-xs font-extrabold transition ${watchingWith === item.id ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/40 shadow-[0_8px_20px_rgba(34,211,238,0.08)]' : 'bg-[#0d1424] border-white/10 text-slate-300 hover:text-white hover:border-white/20'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/[0.07] mb-6" />

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <IconTv className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-400">NEREDE İZLENİR? (YAYIN PLATFORMU)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['all', 'Tümü'], ['netflix', 'Netflix'], ['prime', 'Prime Video'], ['disney', 'Disney+'], ['hbo', 'HBO Max'], ['tv', 'TV+'], ['blutv', 'BluTV / TOD'], ['apple', 'Apple TV'], ['mubi', 'MUBI']
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSelectedPlatform(key); setCurrentPage(1); }}
                        className={`h-8 px-3 rounded-xl border text-[11px] font-extrabold transition ${selectedPlatform === key ? 'bg-amber-400/15 text-amber-100 border-amber-300/45 shadow-[0_7px_18px_rgba(245,185,66,0.14)]' : 'bg-[#0d1424] border-white/10 text-slate-400 hover:text-white hover:border-amber-300/25'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-400">TÜRLER (BİRDEN FAZLA SEÇİLEBİLİR)</span>
                  <button
                    type="button"
                    onClick={() => setAllGenresMustMatch((v) => !v)}
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${allGenresMustMatch ? 'bg-cyan-500 border-cyan-300 text-black' : 'bg-[#0b1220] border-white/20'}`}>
                      {allGenresMustMatch ? '✓' : ''}
                    </span>
                    Seçilen tüm türler aynı anda olsun
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenres([]);
                      setCurrentPage(1);
                    }}
                    className={`h-8 px-3 rounded-xl border text-[11px] font-extrabold transition ${selectedGenres.length === 0 ? 'bg-amber-400/15 text-amber-100 border-amber-300/45 shadow-[0_7px_18px_rgba(245,185,66,0.14)]' : 'bg-[#0d1424] border-white/10 text-slate-400 hover:text-white hover:border-amber-300/25'}`}
                  >
                    Tüm Türler
                  </button>
                  {ALL_FILTER_GENRES.map((genre) => {
                    const active = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setSelectedGenres((prev) => active ? prev.filter((g) => g !== genre) : [...prev, genre]);
                          setCurrentPage(1);
                        }}
                        className={`h-8 px-3 rounded-xl border text-[11px] font-extrabold transition ${active ? 'bg-amber-400/15 text-amber-100 border-amber-300/45 shadow-[0_7px_18px_rgba(245,185,66,0.14)]' : 'bg-[#0d1424] border-white/10 text-slate-400 hover:text-white hover:border-amber-300/25'}`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0e1628] p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><IconStar className="w-3.5 h-3.5 text-amber-400" /> Min Puan</div>
                    <span className="text-xs font-black text-amber-400">{minRating === 'all' ? 'Farketmez' : `${minRating}+`}</span>
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

                <div className="rounded-2xl border border-white/[0.08] bg-[#0e1628] p-4">
                  <div className="text-center text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-500 mb-3">Yıl Aralığı</div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={minYear}
                      onChange={(e) => { setMinYear(e.target.value); setCurrentPage(1); }}
                      className="h-9 rounded-xl bg-[#070c16] border border-white/10 px-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="all">Min Yıl (Tümü)</option>
                      {Array.from({ length: 37 }, (_, i) => 1990 + i).map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <select
                      value={maxYear}
                      onChange={(e) => { setMaxYear(e.target.value); setCurrentPage(1); }}
                      className="h-9 rounded-xl bg-[#070c16] border border-white/10 px-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="all">Max Yıl (Tümü)</option>
                      {Array.from({ length: 37 }, (_, i) => 1990 + i).map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0e1628] p-4">
                  <div className="text-center text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-500 mb-3">Orijinal Dil</div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 rounded-xl bg-[#070c16] border border-white/10 px-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                  >
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

            {/* ÇARK */}
            <div className="relative z-10 px-5 sm:px-7 md:px-8 pt-7 pb-8">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.035] border border-white/10 text-cyan-300 text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-[0_0_26px_rgba(34,211,238,0.08)]">
                  <IconSparkles className="w-3.5 h-3.5 text-cyan-300" />
                  RASTGELE KEŞİF MOTORU
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.045em] text-white leading-[1.02]">Şansını Dene, Ne İzleyeceğini Seç!</h2>
                <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-[15px] text-slate-400 leading-7 font-medium">Filtrelerini belirle, merkezde duran kartı hedefleyen çarkla bu akşam izleyeceğin yapımı keşfet.</p>
              </div>

              <div className="relative w-full h-[285px] sm:h-[310px] md:h-[325px] rounded-[26px] overflow-hidden bg-[#03060d] border border-white/[0.08] shadow-[inset_0_0_70px_rgba(0,0,0,0.92),0_18px_60px_rgba(0,0,0,0.34)]">
                <div className="absolute inset-x-0 top-0 h-20 z-20 bg-gradient-to-b from-[#03060d] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 z-20 bg-gradient-to-t from-[#03060d] to-transparent pointer-events-none" />
                <div className="absolute left-0 inset-y-0 w-20 sm:w-36 z-20 bg-gradient-to-r from-[#03060d] to-transparent pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-20 sm:w-36 z-20 bg-gradient-to-l from-[#03060d] to-transparent pointer-events-none" />

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[265px] z-30 rounded-[18px] border-2 border-cyan-300/90 bg-cyan-300/[0.025] shadow-[0_0_16px_rgba(34,211,238,0.9),0_0_55px_rgba(34,211,238,0.22)] pointer-events-none">
                  <div className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-cyan-300/[0.09] via-transparent to-cyan-300/[0.035]" />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                </div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-40 w-0 h-0 border-l-[9px] border-r-[9px] border-l-transparent border-r-transparent border-t-[13px] border-t-cyan-300 drop-shadow-[0_0_9px_rgba(34,211,238,1)]" />

                <div
                  ref={rouletteRef}
                  className="absolute left-0 top-0 h-full flex items-center gap-4 will-change-transform"
                  style={{
                    paddingLeft: `calc(50% - ${ROULETTE_CARD_WIDTH / 2}px)`,
                    transform: `translate3d(-${spinTranslate}px, 0, 0)`,
                    transition: isSpinning ? 'transform 4.15s cubic-bezier(0.10, 0.78, 0.18, 1)' : 'none',
                  }}
                >
                  {rouletteItems.map((m, idx) => {
                    const posterSrc = getPosterSrc(m.posterUrl);

                    return (
                      <div
                        key={`${m.title}-${idx}`}
                        className={`relative w-[190px] h-[265px] shrink-0 overflow-hidden rounded-[17px] bg-[#0b1220] border shadow-[0_12px_35px_rgba(0,0,0,0.55)] transition-all duration-300 ${selectedWheelIndex === idx && !isSpinning ? 'border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.65),0_18px_45px_rgba(0,0,0,0.6)] scale-[1.015]' : 'border-white/[0.08]'} ${isSpinning ? 'scale-[0.985] opacity-95' : 'scale-100 opacity-100'}`}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.15),transparent_38%),linear-gradient(180deg,#0b1b2c,#030811)]" />

                        {posterSrc ? (
                          <img
                            src={posterSrc}
                            alt={m.title}
                            loading="eager"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 z-10 w-full h-full object-cover select-none"
                            draggable={false}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300/70">
                              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="3" y="4" width="18" height="16" rx="3" />
                                <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
                              </svg>
                            </div>
                            <span className="text-[10px] font-bold leading-relaxed text-slate-300 line-clamp-3">{m.title}</span>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                        <div className="absolute left-3.5 right-3.5 bottom-3 z-30">
                          <div className="text-sm font-black text-white truncate">{m.title}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-300"><IconStar className="w-3 h-3" />{m.imdb}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {allFilteredMovies.length === 0 && !isSpinning && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#03060d]/90 backdrop-blur-md text-slate-300">
                    <IconSearch className="w-10 h-10 text-cyan-300 mb-3" />
                    <span className="text-sm font-bold">Bu filtrelere uygun yapım bulunamadı.</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center mt-7">
                <button
                  type="button"
                  onClick={() => handleSpin()}
                  disabled={isSpinning || allFilteredMovies.length === 0}
                  className="group relative overflow-hidden px-10 sm:px-14 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white text-base sm:text-lg font-black shadow-[0_12px_40px_rgba(14,165,233,0.28)] hover:shadow-[0_15px_55px_rgba(14,165,233,0.4)] hover:scale-[1.03] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                  <span className="relative z-10 flex items-center justify-center gap-2"><IconSparkles className="w-5 h-5" />{isSpinning ? 'ŞANSIN DÖNÜYOR...' : allFilteredMovies.length === 0 ? 'KRİTERLERİ DEĞİŞTİR' : 'ÇARKI ÇEVİR'}</span>
                </button>
                <div className="mt-3 text-xs text-slate-500 font-medium">Filtrelere uygun <strong className="text-cyan-300">{allFilteredMovies.length}</strong> aday var.</div>
              </div>
            </div>
          </div>

    </>
  );
}
