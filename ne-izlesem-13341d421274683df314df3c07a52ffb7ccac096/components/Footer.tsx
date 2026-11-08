'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';

export default function Footer() {
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    ['Ne izleyeceğime nasıl karar verebilirim?', 'Filtrelerini seç, çarkı çevir ve sana uyan yapımı keşfet.'],
    ['Çark hangi yapımları seçer?', 'Çark; seçtiğin tür, platform, puan, yıl ve diğer filtrelere uyan içeriklerden seçim yapar.'],
    ['Favorilerimi ve izleme listemi nasıl kullanırım?', 'Bir yapım kartındaki Favori veya detay ekranındaki liste aksiyonlarını kullanabilirsin.'],
    ['Platform bilgileri kesin mi?', 'Platform bilgisi mevcutsa gösterilir. İçerik bulunamadığında uygulama bunu açıkça belirtir.'],
    ['IMDb puanları nereden geliyor?', 'Puanlar, içerik verisiyle birlikte TMDB kaynaklarından alınır.'],
    ['AI Asistan ne yapar?', 'AI Asistanı ruh haline ve isteğine göre film veya dizi keşfinde yardımcı olur.'],
    ['Ne İzlesem ücretsiz mi?', 'Keşif, filtreler ve çark ücretsiz kullanılabilir.'],
  ];
  
    return (
    <>
      <footer className="z-20 mt-12 w-full border-t border-white/[0.08] bg-[#050811] px-4 py-12 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10">
          <section className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">NE İZLESEM?</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Hangi Filmi İzlemeliyim? Kararsızlığa Son Verin!</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['✦', 'Kişisel AI Asistanı', 'Zevkini anlat, sana uygun keşif rotasını birlikte oluşturalım.'],
                ['↻', 'Akıllı Seçim Çarkı', 'Filtrelerini belirle ve bu akşamın yapımını şansına bırak.'],
                ['⌕', 'Gelişmiş Filtreleme', 'Tür, puan, yıl ve platformla aradığın içeriği hızla bul.'],
              ].map(([icon, title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-left shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-400/10 text-xl text-amber-200">{icon}</div>
                  <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="text-center text-lg font-black text-white">Sıkça Sorulan Sorular &amp; Film Öneri Rehberi</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
              {faqs.map(([question, answer], index) => (
                <div key={question}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-slate-200 hover:text-amber-200">
                    <span>{question}</span><span className="text-lg text-amber-300">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && <p className="pb-4 pr-8 text-xs leading-5 text-slate-400">{answer}</p>}
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Veri kaynağı</p><p className="mt-3 text-xs leading-5 text-slate-400">This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Hızlı Erişim</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-300"><Link href="/" className="hover:text-amber-200">Ana Sayfa</Link><Link href="/movies" className="hover:text-amber-200">Filmler</Link><Link href="/tv" className="hover:text-amber-200">Diziler</Link><Link href="/discover" className="hover:text-amber-200">Keşfet</Link><Link href="/search" className="hover:text-amber-200">Arama</Link></div></div>
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Yasal / Gizlilik</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-300"><button type="button" onClick={() => setActiveModal('about')} className="hover:text-amber-200">Hakkımızda</button><button type="button" onClick={() => setActiveModal('privacy')} className="hover:text-amber-200">Gizlilik</button><button type="button" onClick={() => setActiveModal('contact')} className="hover:text-amber-200">İletişim</button></div></div>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 NE İZLESEM? — Film &amp; Dizi Keşif Motoru.</span><span>TMDB verileriyle güçlendirilmiştir.</span></div>
        </div>
      </footer>

    </>
  );
}
