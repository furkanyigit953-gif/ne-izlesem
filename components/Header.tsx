'use client';

import React from 'react';
import { MovieItem, UserProfile } from '../types/movie';
import NeIzlesemLogo from './NeIzlesemLogo';

type HeaderProps = {
  isAIAssistantOpen: boolean;
  onOpenAI: () => void;

  activeType: 'Film' | 'Dizi' | null;
  onHome: () => void;
  onExplore: () => void;
  onFilms: () => void;
  onSeries: () => void;

  isSpinning: boolean;
  hasFilteredMovies: boolean;
  onSpin: () => void;

  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  searchQuery: string;
  searchOpen: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchSuggestions: MovieItem[];
  searchActiveIndex: number;
  setSearchActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  openSearchResult: (movie: MovieItem) => void;

  user: UserProfile | null;
  userDropdownOpen: boolean;
  onToggleUserDropdown: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onOpenLists: () => void;
  onLogout: () => void;
};

const IconSparkles = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2.75l1.3 4.95a3.2 3.2 0 0 0 2.25 2.25L20.5 11.25l-4.95 1.3a3.2 3.2 0 0 0-2.25 2.25L12 19.75l-1.3-4.95a3.2 3.2 0 0 0-2.25-2.25l-4.95-1.3 4.95-1.3a3.2 3.2 0 0 0 2.25-2.25L12 2.75Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M19 3.5v3M20.5 5h-3M5 17.5v3M6.5 19H3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconFilm = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M8 3v18M16 3v18M4 8h16M4 16h16"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const IconSearch = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="m16 16 4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const gradientButton =
  'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_8px_28px_rgba(14,165,233,0.22)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_34px_rgba(14,165,233,0.34)] active:scale-[0.98]';

const navButton =
  'relative py-2 text-sm font-bold text-slate-400 transition-colors duration-200 hover:text-white';

export default function Header({
  isAIAssistantOpen,
  onOpenAI,
  activeType,
  onHome,
  onExplore,
  onFilms,
  onSeries,
  isSpinning,
  hasFilteredMovies,
  onSpin,
  searchContainerRef,
  searchQuery,
  searchOpen,
  setSearchQuery,
  setSearchOpen,
  searchSuggestions,
  searchActiveIndex,
  setSearchActiveIndex,
  handleSearch,
  openSearchResult,
  user,
  userDropdownOpen,
  onToggleUserDropdown,
  onLogin,
  onRegister,
  onOpenLists,
  onLogout,
}: HeaderProps) {
  const clearSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
    setSearchActiveIndex(0);
  };

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-white/[0.07] bg-[#05070d]/90 shadow-[0_8px_35px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">

        {/* LOGO */}
        <button
          type="button"
          onClick={onHome}
          aria-label="Ne İzlesem ana sayfa"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-2 outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <NeIzlesemLogo compact className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />

          <NeIzlesemLogo className="hidden h-[42px] w-[170px] sm:block" />
        </button>

        {/* AI ASİSTAN */}
        <button
          type="button"
          onClick={onOpenAI}
          aria-label="AI Asistanı aç"
          aria-pressed={isAIAssistantOpen}
          className={`group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black sm:px-4 ${gradientButton} ${
            isAIAssistantOpen ? 'ring-2 ring-cyan-300/30' : ''
          }`}
        >
          <IconSparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="hidden xs:inline sm:inline">AI Asistan</span>
        </button>

        {/* NAVİGASYON */}
        <nav
          aria-label="Ana navigasyon"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          <button
            type="button"
            onClick={onExplore}
            className={`${navButton} ${activeType === null ? 'text-white' : ''}`}
          >
            Keşfet
            {activeType === null && (
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            type="button"
            onClick={onFilms}
            className={`${navButton} ${activeType === 'Film' ? 'text-white' : ''}`}
          >
            Filmler
            {activeType === 'Film' && (
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            type="button"
            onClick={onSeries}
            className={`${navButton} ${activeType === 'Dizi' ? 'text-white' : ''}`}
          >
            Diziler
            {activeType === 'Dizi' && (
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button type="button" onClick={() => { window.location.href = '/search'; }} className={navButton}>
            Arama
          </button>
        </nav>

        {/* ÇARK */}
        <button
          type="button"
          onClick={onSpin}
          disabled={isSpinning || !hasFilteredMovies}
          aria-label="Film çarkını çevir"
          className={`hidden shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black sm:inline-flex sm:px-4 ${gradientButton} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <IconSparkles className="h-4 w-4" />
          <span className="hidden xl:inline">
            {isSpinning ? 'Çevriliyor...' : 'Çarkı Çevir'}
          </span>
        </button>

        {/* ARAMA */}
        <div
          ref={searchContainerRef}
          className="relative ml-auto min-w-0 flex-1 max-w-[420px]"
        >
          <div
            className={`flex h-11 items-center gap-2 rounded-2xl border bg-[#0c1220]/95 px-3.5 shadow-inner transition-all duration-200 ${
              searchOpen && searchSuggestions.length > 0
                ? 'border-cyan-400/60 shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_28px_rgba(34,211,238,0.16)]'
                : 'border-white/10 focus-within:border-cyan-400/70 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_24px_rgba(34,211,238,0.14)]'
            }`}
          >
            <IconSearch className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              type="text"
              placeholder="Film, dizi, oyuncu ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchActiveIndex(0);
                setSearchOpen(Boolean(e.target.value.trim()));
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              onKeyDown={handleSearch}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
              aria-label="Film ve dizi ara"
              aria-autocomplete="list"
              aria-expanded={searchOpen && searchSuggestions.length > 0}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Aramayı temizle"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>

          {/* ARAMA SONUÇLARI */}
          {searchOpen && searchQuery.trim() && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-white/10 bg-[#080d18]/98 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
            >
              {searchSuggestions.length > 0 ? (
                <>
                  <div className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                    En İyi Eşleşmeler
                  </div>

                  {searchSuggestions.map((movie, index) => (
                    <button
                      key={`${movie.title}-${movie.year}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === searchActiveIndex}
                      onMouseEnter={() => setSearchActiveIndex(index)}
                      onClick={() => openSearchResult(movie)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                        index === searchActiveIndex
                          ? 'bg-cyan-400/[0.09] ring-1 ring-inset ring-cyan-400/20'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-[#101827]">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-cyan-400/70">
                            <IconFilm className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-extrabold text-white">
                          {movie.title}
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                          <span>{movie.year}</span>
                          <span>•</span>
                          <span className="truncate">
                            {movie.contentType || 'Yapım'}
                          </span>

                          {movie.imdb && (
                            <>
                              <span>•</span>
                              <span className="text-amber-300">
                                ★ {movie.imdb}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h13M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  ))}

                  <div className="mt-1 border-t border-white/[0.06] px-3 py-2 text-[9px] font-semibold text-slate-600">
                    ↑ ↓ ile seç • Enter ile aç • Esc ile kapat
                  </div>
                </>
              ) : (
                <div className="px-4 py-7 text-center">
                  <IconSearch className="mx-auto h-7 w-7 text-slate-600" />
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    Eşleşen film veya dizi bulunamadı.
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Başlık, oyuncu, tür veya yıl ile deneyebilirsin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KULLANICI */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {!user ? (
            <>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-lg px-2.5 py-2 text-xs font-black text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                Giriş Yap
              </button>

              <button
                type="button"
                onClick={onRegister}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-3.5 py-2.5 text-xs font-black text-white shadow-[0_8px_24px_rgba(14,165,233,0.22)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={onToggleUserDropdown}
                aria-expanded={userDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition hover:border-white/15 hover:bg-white/[0.07]"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: user.avatarBg }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <span className="max-w-[110px] truncate text-xs font-bold text-white">
                  {user.name}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-white/10 bg-[#080d18] p-3 shadow-[0_20px_55px_rgba(0,0,0,0.62)]"
                >
                  <div className="mb-3 border-b border-white/[0.07] pb-3">
                    <div className="text-xs font-black text-white">
                      {user.fullName || user.name}
                    </div>

                    <div className="mt-1 text-[10px] font-bold text-cyan-400">
                      @{user.username}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenLists}
                    role="menuitem"
                    className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Listelerim
                  </button>

                  <button
                    type="button"
                    onClick={onLogout}
                    role="menuitem"
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-300 transition hover:bg-rose-500/10"
                  >
                    Oturumu Kapat
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBİL AI */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onOpenAI}
            className={`rounded-xl p-2.5 ${gradientButton} ${
              isAIAssistantOpen ? 'ring-2 ring-cyan-300/30' : ''
            }`}
            aria-label="AI Asistan"
            aria-pressed={isAIAssistantOpen}
          >
            <IconSparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
