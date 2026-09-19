'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import { renderPlatformLogo, getPosterSrc, IconSparkles, IconStar, IconFilm, IconTv, IconSearch, ROULETTE_CARD_WIDTH, ROULETTE_GAP, ROULETTE_TOTAL_WIDTH, ROULETTE_CENTER_INDEX } from '../lib/homeShared';
import Header from './Header';

export default function HomeHeader() {
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
<Header
  onOpenAI={() => setIsAIAssistantOpen(true)}
  isAIAssistantOpen={isAIAssistantOpen}
  onHome={() => { window.location.href = '/'; }}
  activeType={activeType}
  onExplore={() => {
    window.location.href = '/discover';
  }}
  onFilms={() => {
    window.location.href = '/movies';
  }}
  onSeries={() => {
    window.location.href = '/tv';
  }}

  isSpinning={isSpinning}
  hasFilteredMovies={allFilteredMovies.length > 0}
  onSpin={() => {
    scrollToWheel();
    window.setTimeout(() => handleSpin(), 160);
  }}

  searchContainerRef={searchContainerRef}
  searchQuery={searchQuery}
  searchOpen={searchOpen}
  setSearchQuery={setSearchQuery}
  setSearchOpen={setSearchOpen}
  searchSuggestions={searchSuggestions}
  searchActiveIndex={searchActiveIndex}
  setSearchActiveIndex={setSearchActiveIndex}
  handleSearch={handleSearch}
  openSearchResult={openSearchResult}

  user={user}
  userDropdownOpen={userDropdownOpen}
  onToggleUserDropdown={() =>
    setUserDropdownOpen((open) => !open)
  }

  onLogin={() => {
    setAuthMode('login');
    setAuthError('');
    setActiveModal('auth');
  }}

  onRegister={() => {
    setAuthMode('register');
    setAuthError('');
    setActiveModal('auth');
  }}

  onOpenLists={() => {
    setListsActiveTab('favorites');
    setActiveModal('lists');
    setUserDropdownOpen(false);
  }}

  onLogout={() => {
    setUser(null);
    setUserDropdownOpen(false);
    localStorage.removeItem('neizlesem_user');
    setFavorites([]);
    setWatchlist([]);
    setWatchedList([]);
    setUserRatings({});
    setWheelHistory([]);
  }}
/>

    </>
  );
}
