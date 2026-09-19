'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MovieItem, UserProfile } from '@/types/movie';
import { 
  normalizeSearchText, 
  getPosterSrc, 
  renderPlatformLogo, 
  ROULETTE_CARD_WIDTH, 
  ROULETTE_GAP, 
  ROULETTE_TOTAL_WIDTH, 
  ROULETTE_CENTER_INDEX, 
  IconSparkles, 
  IconStar, 
  IconFilm, 
  IconTv, 
  IconSearch 
} from '@/lib/homeShared';
import { HomePageProvider } from './HomePageContext';
import HomeLayout from './HomeLayout';

const DEFAULT_WHEEL_MOVIES: MovieItem[] = [
  ['Inception', '2010', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'],
  ['Interstellar', '2014', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'],
  ['The Dark Knight', '2008', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'],
  ['Parasite', '2019', 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'],
  ['The Matrix', '1999', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'],
  ['Spirited Away', '2001', 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg'],
  ['Whiplash', '2014', 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeNOVIE.jpg'],
  ['Arrival', '2016', 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'],
  ['Dune', '2021', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'],
  ['Mad Max: Fury Road', '2015', 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg'],
  ['The Shawshank Redemption', '1994', 'https://image.tmdb.org/t/p/w500/lyQBXzOQTgE0P9QYLUF9A4P8V5d.jpg'],
  ['The Lord of the Rings', '2001', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkbl6cHo6.jpg'],
  ['Oppenheimer', '2023', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'],
  ['Spider-Man: Across the Spider-Verse', '2023', 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'],
  ['Everything Everywhere All at Once', '2022', 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'],
].map(([title, year, posterUrl]) => ({ title, year, posterUrl, genre: 'Popüler', imdb: '8.0', durationOrSeason: '', summary: '', contentType: 'Film' as const, isLocal: false, platforms: [], cast: [], popularity: 100, voteCount: 1000 }));

export default function HomePage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const wheelReady = !loading && movies.length > 0;
  const [activeType, setActiveType] = useState<'Film' | 'Dizi' | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allGenresMustMatch, setAllGenresMustMatch] = useState(false);
  const [watchingWith, setWatchingWith] = useState<'all' | 'couple' | 'friends' | 'family' | 'solo'>('all');
  const [useSavedOnly, setUseSavedOnly] = useState(false);
  const [minYear, setMinYear] = useState<string>('all');
  const [maxYear, setMaxYear] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);
  const [remoteSearchResults, setRemoteSearchResults] = useState<MovieItem[]>([]);
  const [catalogBatch, setCatalogBatch] = useState(0);
  const searchRequestIdRef = useRef(0);

  const [minRating, setMinRating] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [onlyNew, setOnlyNew] = useState<boolean>(false);

  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const ITEMS_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [recommendation, setRecommendation] = useState<MovieItem | null>(null);

  const [favorites, setFavorites] = useState<MovieItem[]>([]);
  const [watchedList, setWatchedList] = useState<MovieItem[]>([]);
  const [watchlist, setWatchlist] = useState<MovieItem[]>([]);
  const [wheelHistory, setWheelHistory] = useState<MovieItem[]>([]);

  const [activeModal, setActiveModal] = useState<'lists' | 'history' | 'auth' | 'about' | 'privacy' | 'contact' | null>(null);
  
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [, setAiRecommendations] = useState<MovieItem[]>([]);

  const [listsActiveTab, setListsActiveTab] = useState<'favorites' | 'watchlist' | 'watched' | 'wheel'>('favorites');
  const [selectedMovieModal, setSelectedMovieModal] = useState<MovieItem | null>(null);
  const [wheelResultModalOpen, setWheelResultModalOpen] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regBirthYear, setRegBirthYear] = useState('2000');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [contactSent, setContactSent] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [bannerCategory, setBannerCategory] = useState<'popular' | 'topRated' | 'mostDiscussed'>('popular');
  const [bannerIndex, setBannerIndex] = useState(0);

  const [showFloatingSpin, setShowFloatingSpin] = useState<boolean>(false);

  // Yatay Çark (Slot) State'leri
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<MovieItem[]>([
    ...DEFAULT_WHEEL_MOVIES.slice(1, ROULETTE_CENTER_INDEX + 1),
    DEFAULT_WHEEL_MOVIES[0],
    ...DEFAULT_WHEEL_MOVIES.slice(ROULETTE_CENTER_INDEX + 1),
  ]);
  const [spinTranslate, setSpinTranslate] = useState(ROULETTE_CENTER_INDEX * ROULETTE_TOTAL_WIDTH);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  const rouletteRef = useRef<HTMLDivElement>(null);
  const rouletteSpinTokenRef = useRef(0);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const wheelSectionRef = useRef<HTMLDivElement | null>(null);
  const recommendationRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wheelResultModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [wheelResultModalOpen]);

  // Katalog yükleme ve state birleştirme
  const retryCatalogLoad = useCallback(() => {
    let cancelled = false;
    const loadCatalogBatch = async (batch: number) => {
      const res = await fetch(`/api/movies?type=all&pageCount=5&batch=${batch}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Catalog ${batch} failed`);
      const data = await res.json();
      if (!Array.isArray(data) || cancelled) return;
      setMovies((prev) => {
        const map = new Map(prev.map((m) => [`${m.contentType}:${m.title}:${m.year}`, m]));
        data.forEach((m: MovieItem) => map.set(`${m.contentType}:${m.title}:${m.year}`, m));
        return Array.from(map.values());
      });
    };

    setCatalogError(false);
    setLoading(true);

    loadCatalogBatch(0)
      .catch(() => setCatalogError(true))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    (async () => {
      for (let batch = 1; batch < 8 && !cancelled; batch += 1) {
        try {
          await loadCatalogBatch(batch);
          if (!cancelled) setCatalogBatch(batch);
        } catch {
          if (!cancelled) setCatalogError(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    try {
      const savedUser = localStorage.getItem('neizlesem_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/movies?type=all&pageCount=5&batch=0`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Catalog failed');
        const data = await res.json();
        if (!Array.isArray(data) || cancelled) return;
        setMovies((prev) => {
          const map = new Map(prev.map((m) => [`${m.contentType}:${m.title}:${m.year}`, m]));
          data.forEach((m: MovieItem) => map.set(`${m.contentType}:${m.title}:${m.year}`, m));
          return Array.from(map.values());
        });
        setCatalogError(false);
      } catch {
        if (!cancelled) setCatalogError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    (async () => {
      for (let batch = 1; batch < 8 && !cancelled; batch += 1) {
        try {
          const res = await fetch(`/api/movies?type=all&pageCount=5&batch=${batch}`, { cache: 'no-store' });
          if (!res.ok) throw new Error(`Catalog ${batch} failed`);
          const data = await res.json();
          if (cancelled || !Array.isArray(data)) continue;
          setMovies((prev) => {
            const map = new Map(prev.map((m) => [`${m.contentType}:${m.title}:${m.year}`, m]));
            data.forEach((m: MovieItem) => map.set(`${m.contentType}:${m.title}:${m.year}`, m));
            return Array.from(map.values());
          });
          setCatalogError(false);
          if (!cancelled) setCatalogBatch(batch);
        } catch {
          if (!cancelled) setCatalogError(true);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setRemoteSearchResults([]);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
        const data = await res.json();
        if (requestId !== searchRequestIdRef.current) return;
        setRemoteSearchResults(Array.isArray(data) ? data : []);
      } catch {
        if (requestId === searchRequestIdRef.current) setRemoteSearchResults([]);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingSpin(window.scrollY > 550);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const username = user?.username || 'guest';
    try {
      const uFavs = localStorage.getItem(`neizlesem_favs_${username}`);
      setFavorites(uFavs ? JSON.parse(uFavs) : []);

      const uWatch = localStorage.getItem(`neizlesem_watchlist_${username}`);
      setWatchlist(uWatch ? JSON.parse(uWatch) : []);

      const uWatched = localStorage.getItem(`neizlesem_watched_${username}`);
      setWatchedList(uWatched ? JSON.parse(uWatched) : []);

      const uRatings = localStorage.getItem(`neizlesem_ratings_${username}`);
      setUserRatings(uRatings ? JSON.parse(uRatings) : {});

      const uHistory = localStorage.getItem(`neizlesem_wheel_history_${username}`);
      setWheelHistory(uHistory ? JSON.parse(uHistory) : []);
    } catch {
      setFavorites([]);
      setWatchlist([]);
      setWatchedList([]);
      setUserRatings({});
      setWheelHistory([]);
    }
  }, [user?.username]);

  useEffect(() => {
    if (movies.length === 0) return;
    const total = Math.min(movies.length, 6) || 1;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(interval);
  }, [movies.length, bannerCategory]);

  const candidates = useMemo(() => {
    const normalizePlatformText = (value?: string) =>
      (value || '').toLowerCase().trim().replace(/\s+/g, ' ');

    const matchesPlatform = (movie: MovieItem, platformFilter: string) => {
      const query = normalizePlatformText(platformFilter);
      if (!query || query === 'all') return true;

      return (movie.platforms || []).some((p) => {
        const values = [p.name, p.key, (p as { provider_name?: string }).provider_name];
        const joined = values
          .filter(Boolean)
          .map((value) => normalizePlatformText(String(value)))
          .join(' ');

        if (!joined) return false;

        if (query === 'netflix') return joined.includes('netflix');
        if (query === 'prime') return joined.includes('prime') || joined.includes('amazon');
        if (query === 'disney') return joined.includes('disney');
        if (query === 'hbo' || query === 'max') return joined.includes('hbo') || joined.includes('max');
        if (query === 'blutv' || query === 'tod') return joined.includes('blutv') || joined.includes('tod');
        if (query === 'apple') return joined.includes('apple');
        if (query === 'mubi') return joined.includes('mubi');
        if (query === 'tv') return joined.includes('tv');
        return joined.includes(query);
      });
    };

    const qualityMovies = Array.from(new Map(movies
      .filter((movie) => Boolean(movie.posterUrl?.trim()))
      .filter((movie) => Number(movie.voteCount || 0) >= 150 || Number(movie.popularity || 0) >= 20)
      .filter((movie) => Number(movie.year || 0) >= 1995 || Number.parseFloat(movie.imdb || '0') >= 7.5)
      .map((movie) => [`${movie.contentType}:${movie.tmdbId || movie.title}:${movie.posterUrl}`, movie])).values());

    const baseFiltered = qualityMovies.filter((m) => {
      const normalizedGenre = (m.genre || '').toLowerCase();

      if (activeType === 'Film' && m.contentType !== 'Film') return false;
      if (activeType === 'Dizi' && m.contentType !== 'Dizi') return false;

      if (selectedGenres.length > 0) {
        const matches = selectedGenres.map((genre) => normalizedGenre.includes(genre.toLowerCase()));
        if (allGenresMustMatch ? matches.some((matched) => !matched) : matches.every((matched) => !matched)) return false;
      }

      if (minRating !== 'all' && m.imdb && parseFloat(m.imdb) < parseFloat(minRating)) return false;

      const numericYear = Number.parseInt(m.year || '0', 10);
      if (minYear !== 'all' && numericYear < Number.parseInt(minYear, 10)) return false;
      if (maxYear !== 'all' && numericYear > Number.parseInt(maxYear, 10)) return false;
      if (onlyNew && numericYear < 2021) return false;

      if (selectedLanguage !== 'all') {
        const anyMovie = m as MovieItem & { language?: string; originalLanguage?: string };
        const language = `${anyMovie.language || ''} ${anyMovie.originalLanguage || ''}`.toLowerCase();
        if (!language.includes(selectedLanguage.toLowerCase())) return false;
      }

      if (useSavedOnly) {
        const saved = favorites.some((f) => f.title === m.title) || watchlist.some((w) => w.title === m.title);
        if (!saved) return false;
      }

      return true;
    });

    const selected = selectedPlatform === 'all'
      ? baseFiltered
      : baseFiltered.filter((movie) => matchesPlatform(movie, selectedPlatform));

    const ranked = [...selected].sort((a, b) => {
      const popularityDiff = Number(b.popularity || 0) - Number(a.popularity || 0);
      if (popularityDiff !== 0) return popularityDiff;
      return (Number.parseFloat(b.imdb || '0') || 0) - (Number.parseFloat(a.imdb || '0') || 0);
    });

    return ranked;
  }, [movies, activeType, selectedGenres, allGenresMustMatch, minRating, selectedPlatform, onlyNew, minYear, maxYear, selectedLanguage, useSavedOnly, favorites, watchlist]);

  const allFilteredMovies = candidates;

  const homeDiscoveryRows = useMemo(() => {
    const getYear = (item: MovieItem) => Number.parseInt(item.year || '0', 10) || 0;
    const getRating = (item: MovieItem) => Number.parseFloat(item.imdb || '0') || 0;
    const getPopularity = (item: MovieItem) => Number(item.popularity || 0);

    const byPopular = [...movies]
      .filter((item) => item.posterUrl)
      .sort((a, b) => {
        const scoreA = getPopularity(a) * 0.72 + getRating(a) * 7;
        const scoreB = getPopularity(b) * 0.72 + getRating(b) * 7;
        return scoreB - scoreA;
      });

    const currentYear = new Date().getFullYear();
    const byNew = [...movies]
      .filter((item) => item.posterUrl && getYear(item) >= currentYear - 1)
      .sort((a, b) => {
        const yearDiff = getYear(b) - getYear(a);
        if (yearDiff !== 0) return yearDiff;
        return getPopularity(b) - getPopularity(a);
      });

    const genreTop = (aliases: string[]) =>
      [...movies]
        .filter((item) => {
          const value = `${item.genre || ''}`.toLocaleLowerCase('tr-TR');
          return item.posterUrl && aliases.some((alias) => value.includes(alias));
        })
        .sort((a, b) => {
          const ratingDiff = getRating(b) - getRating(a);
          if (ratingDiff !== 0) return ratingDiff;
          return getPopularity(b) - getPopularity(a);
        })
        .slice(0, 10);

    return {
      popular: byPopular.slice(0, 12),
      fresh: byNew.slice(0, 12),
      comedy: genreTop(['komedi', 'comedy']),
      horror: genreTop(['korku', 'horror']),
      action: genreTop(['aksiyon', 'action']),
    };
  }, [movies]);

  // Çark pozisyonu ve kart listesi
  useEffect(() => {
    if (!wheelReady) {
      setRouletteItems((current) => current.length > 0 ? current : [
        ...DEFAULT_WHEEL_MOVIES.slice(1, ROULETTE_CENTER_INDEX + 1),
        DEFAULT_WHEEL_MOVIES[0],
        ...DEFAULT_WHEEL_MOVIES.slice(ROULETTE_CENTER_INDEX + 1),
      ]);
      setSelectedWheelIndex(ROULETTE_CENTER_INDEX);
      setSpinTranslate(ROULETTE_CENTER_INDEX * ROULETTE_TOTAL_WIDTH);
      return;
    }

    if (candidates.length > 0) {
      const items = [...candidates]
        .sort(() => 0.5 - Math.random())
        .slice(0, 9);

      setRouletteItems(items);
      setSelectedWheelIndex(null);
      setSpinTranslate(ROULETTE_CENTER_INDEX * ROULETTE_TOTAL_WIDTH);
    } else {
      setRouletteItems([]);
      setSpinTranslate(0);
    }
  }, [candidates, wheelReady]);

  const handleBannerScroll = (direction: 'left' | 'right') => {
    const total = Math.min(movies.length, 6) || 1;
    setBannerIndex((prev) => (direction === 'left' ? (prev - 1 + total) % total : (prev + 1) % total));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) handleBannerScroll('right');
    else if (diff < -45) handleBannerScroll('left');
  };

  const handleRate = useCallback((title: string, stars: number) => {
    setUserRatings((prev) => {
      const updated = { ...prev, [title]: stars };
      try {
        const storageKey = user?.username ? `neizlesem_ratings_${user.username}` : 'neizlesem_ratings_guest';
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user?.username]);

  const handleLike = (title: string) => {
    const isCurrentlyLiked = !!userLiked[title];
    setUserLiked((prev) => ({ ...prev, [title]: !isCurrentlyLiked }));
    setLikes((prev) => ({
      ...prev,
      [title]: (prev[title] || 120) + (isCurrentlyLiked ? -1 : 1),
    }));
  };

  const toggleFavorite = useCallback((item: MovieItem) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.title === item.title);
      const updated = isFav ? prev.filter((f) => f.title !== item.title) : [item, ...prev];
      try {
        const storageKey = user?.username ? `neizlesem_favs_${user.username}` : 'neizlesem_favs_guest';
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      setToast({ message: isFav ? 'Listeden çıkarıldı' : 'Listeye eklendi', visible: true });
      return updated;
    });
  }, [user?.username]);

  useEffect(() => {
    if (!toast.visible) return;
    const id = window.setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 1800);
    return () => window.clearTimeout(id);
  }, [toast.visible]);

  const toggleWatchlist = useCallback((item: MovieItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((f) => f.title === item.title);
      const updated = exists ? prev.filter((f) => f.title !== item.title) : [item, ...prev];
      try {
        const storageKey = user?.username ? `neizlesem_watchlist_${user.username}` : 'neizlesem_watchlist_guest';
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user?.username]);

  const toggleWatched = useCallback((item: MovieItem) => {
    setWatchedList((prev) => {
      const exists = prev.some((f) => f.title === item.title);
      const updated = exists ? prev.filter((f) => f.title !== item.title) : [item, ...prev];
      try {
        const storageKey = user?.username ? `neizlesem_watched_${user.username}` : 'neizlesem_watched_guest';
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user?.username]);

  const handleSelectRecommendation = useCallback((chosen: MovieItem) => {
    setRecommendation(chosen);
    setWheelResultModalOpen(true);

    setWheelHistory((prev) => {
      const filtered = prev.filter((m) => m.title !== chosen.title);
      const updated = [chosen, ...filtered].slice(0, 30);
      try {
        const storageKey = user?.username ? `neizlesem_wheel_history_${user.username}` : 'neizlesem_wheel_history_guest';
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user?.username]);

  const handleSpin = useCallback((sourceMovies?: MovieItem[]) => {
    if (!wheelReady || loading) return;

    const pool = (sourceMovies && sourceMovies.length > 0 ? sourceMovies : candidates).filter(Boolean);
    if (pool.length === 0 || isSpinning) return;

    const spinToken = ++rouletteSpinTokenRef.current;
    const trackItems: MovieItem[] = Array.from({ length: 64 }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    );

    const winningIndex = 51;
    const winner = trackItems[winningIndex];
    const startTranslate = ROULETTE_CENTER_INDEX * ROULETTE_TOTAL_WIDTH;
    const targetTranslate = winningIndex * ROULETTE_TOTAL_WIDTH;
    const spinDuration = 4200;

    setWheelResultModalOpen(false);
    setSelectedWheelIndex(null);
    setIsSpinning(false);
    setRouletteItems(trackItems);
    setSpinTranslate(startTranslate);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (rouletteSpinTokenRef.current !== spinToken) return;
        setIsSpinning(true);
        window.requestAnimationFrame(() => {
          if (rouletteSpinTokenRef.current !== spinToken) return;
          setSpinTranslate(targetTranslate);
        });
      });
    });

    window.setTimeout(() => {
      if (rouletteSpinTokenRef.current !== spinToken) return;
      setSelectedWheelIndex(winningIndex);
      setIsSpinning(false);
      setAiRecommendations([]);
      handleSelectRecommendation(winner);
    }, spinDuration + 150);
  }, [candidates, isSpinning, handleSelectRecommendation, wheelReady, loading]);

  useEffect(() => () => {
    rouletteSpinTokenRef.current += 1;
  }, []);

  const shareOnWhatsApp = useCallback((item: MovieItem) => {
    const platformNames = item.platforms && item.platforms.length > 0 ? item.platforms.map((p) => p.name).join(', ') : 'Dijital Platformlar';
    const text = `🍿 *Ne izlesem derdine son!*\n\n🎬 *${item.title} (${item.year})*\n⭐ IMDb: ${item.imdb} / 10\n⏳ Süre/Sezon: ${item.durationOrSeason}\n📺 Platform: ${platformNames}\n\n👉 Ne İzlesem ile keşfettim: https://neizlesem-app.vercel.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }, []);

  const searchSuggestions = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return [];

    const queryTokens = query.split(' ').filter(Boolean);
    const combined = [...remoteSearchResults, ...movies];
    const unique = new Map<string, MovieItem>();
    combined.forEach((movie) => unique.set(`${movie.contentType}:${movie.title}:${movie.year}`, movie));

    const scored = Array.from(unique.values())
      .map((movie) => {
        const title = normalizeSearchText(movie.title || '');
        const genre = normalizeSearchText(movie.genre || '');
        const cast = normalizeSearchText((movie.cast || []).join(' '));
        const year = normalizeSearchText(String(movie.year || ''));
        const contentType = normalizeSearchText(movie.contentType || '');
        const platforms = normalizeSearchText((movie.platforms || []).map((p) => p.name).join(' '));
        const haystack = `${title} ${genre} ${cast} ${year} ${contentType} ${platforms}`;

        if (!queryTokens.every((token) => haystack.includes(token))) return null;

        let score = 0;
        if (title === query) score += 1500;
        if (title.startsWith(query)) score += 1000;
        if (title.includes(query)) score += 700;
        if (genre.includes(query)) score += 280;
        if (cast.includes(query)) score += 220;
        if (year === query) score += 180;
        score += Math.min(100, Math.round((movie.popularity || 0) / 15));
        score += Math.round(parseFloat(movie.imdb || '0') * 10);
        return { movie, score };
      })
      .filter((entry): entry is { movie: MovieItem; score: number } => Boolean(entry))
      .sort((a, b) => b.score - a.score || a.movie.title.localeCompare(b.movie.title, 'tr'))
      .slice(0, 8);

    return scored.map((entry) => entry.movie);
  }, [movies, remoteSearchResults, searchQuery]);

  useEffect(() => {
    setSearchActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideSearch = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideSearch);
    return () => document.removeEventListener('mousedown', handleOutsideSearch);
  }, []);

  const openSearchResult = useCallback((movie: MovieItem) => {
    setSelectedMovieModal(movie);
    setRecommendation(movie);
    setSearchOpen(false);
    setSearchQuery(movie.title);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchSuggestions.length > 0) {
        setSearchOpen(true);
        setSearchActiveIndex((prev) => (prev + 1) % searchSuggestions.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchSuggestions.length > 0) {
        setSearchOpen(true);
        setSearchActiveIndex((prev) => (prev - 1 + searchSuggestions.length) % searchSuggestions.length);
      }
      return;
    }

    if (e.key === 'Escape') {
      setSearchOpen(false);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchSuggestions[searchActiveIndex] || searchSuggestions[0];
      if (selected) {
        openSearchResult(selected);
        return;
      }

      const q = searchQuery.trim();
      if (!q) return;
      const fallback = movies.find((m) => {
        const searchable = normalizeSearchText(
          `${m.title} ${m.genre} ${(m.cast || []).join(' ')} ${m.year} ${m.contentType} ${(m.platforms || []).map((p) => p.name).join(' ')}`
        );
        return searchable.includes(normalizeSearchText(q));
      });
      if (fallback) openSearchResult(fallback);
    }
  };

  const cleanTurkish = (str: string) => {
    return str
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '');
  };

  const handleGenerateUsername = () => {
    const cFirst = cleanTurkish(regFirstName.trim());
    const cLast = cleanTurkish(regLastName.trim());
    const yearShort = regBirthYear ? regBirthYear.slice(-2) : '24';

    if (!cFirst && !cLast) {
      setRegUsername(`cinefil_${Math.floor(100 + Math.random() * 900)}`);
      return;
    }

    const options: string[] = [];
    if (cFirst && cLast) {
      options.push(`${cFirst}${cLast[0]}${yearShort}`);
      options.push(`${cFirst}_${cLast}`);
      options.push(`${cLast}.${cFirst}${yearShort}`);
      options.push(`${cFirst}${yearShort}`);
    } else if (cFirst) {
      options.push(`${cFirst}${yearShort}`);
      options.push(`${cFirst}_${Math.floor(10 + Math.random() * 90)}`);
    } else {
      options.push(`${cLast}${yearShort}`);
    }

    setRegUsername(options[Math.floor(Math.random() * options.length)]);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim() || !regUsername.trim()) {
      setAuthError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const cleanUser = regUsername.trim().toLowerCase();
    const newUser: UserProfile = {
      name: regFirstName.trim(),
      fullName: `${regFirstName.trim()} ${regLastName.trim()}`,
      username: cleanUser,
      birthYear: regBirthYear,
      email: regEmail.trim() || `${cleanUser}@neizlesem.app`,
      avatarBg: '#06b6d4',
      provider: 'custom',
    };

    setFavorites([]);
    setWatchlist([]);
    setWatchedList([]);
    setUserRatings({});
    setWheelHistory([]);
    try {
      localStorage.setItem('neizlesem_user', JSON.stringify(newUser));
      localStorage.setItem(`neizlesem_favs_${cleanUser}`, JSON.stringify([]));
      localStorage.setItem(`neizlesem_ratings_${cleanUser}`, JSON.stringify({}));
      localStorage.setItem(`neizlesem_wheel_history_${cleanUser}`, JSON.stringify([]));
    } catch {}

    setUser(newUser);
    setActiveModal(null);
    setAuthError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setAuthError('Lütfen kullanıcı adınızı veya e-postanızı girin.');
      return;
    }

    const cleanId = loginIdentifier.trim();
    const isEmail = cleanId.includes('@');
    const displayName = isEmail ? cleanId.split('@')[0] : cleanId;
    const cleanUser = displayName.toLowerCase().replace(/[^a-z0-9_.]/g, '');

    const loggedUser: UserProfile = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      fullName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      username: cleanUser,
      birthYear: '2000',
      email: isEmail ? cleanId : `${cleanUser}@neizlesem.app`,
      avatarBg: '#06b6d4',
      provider: 'custom',
    };

    try {
      localStorage.setItem('neizlesem_user', JSON.stringify(loggedUser));
      const savedFavs = localStorage.getItem(`neizlesem_favs_${cleanUser}`);
      setFavorites(savedFavs ? JSON.parse(savedFavs) : []);
      const savedWatchlist = localStorage.getItem(`neizlesem_watchlist_${cleanUser}`);
      setWatchlist(savedWatchlist ? JSON.parse(savedWatchlist) : []);
      const savedWatched = localStorage.getItem(`neizlesem_watched_${cleanUser}`);
      setWatchedList(savedWatched ? JSON.parse(savedWatched) : []);
      const savedRatings = localStorage.getItem(`neizlesem_ratings_${cleanUser}`);
      setUserRatings(savedRatings ? JSON.parse(savedRatings) : {});
      const savedHistory = localStorage.getItem(`neizlesem_wheel_history_${cleanUser}`);
      setWheelHistory(savedHistory ? JSON.parse(savedHistory) : []);
    } catch {}

    setUser(loggedUser);
    setActiveModal(null);
    setAuthError('');
  };

  const totalPages = Math.ceil(allFilteredMovies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedMovies = useMemo(() => {
    return allFilteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allFilteredMovies, startIndex, ITEMS_PER_PAGE]);

  const changePage = (page: number) => {
    setCurrentPage(page);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWheel = () => {
    wheelSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const currentBannerList = useMemo(() => {
    if (bannerCategory === 'popular') return movies.slice(0, 6);
    if (bannerCategory === 'topRated') return [...movies].sort((a, b) => parseFloat(b.imdb) - parseFloat(a.imdb)).slice(0, 6);
    return [...movies].reverse().slice(0, 6);
  }, [movies, bannerCategory]);

  const top5Highlights = useMemo(() => {
    if (movies.length === 0) return [];
    const withRealCast = movies.filter((m) => m.cast && m.cast.length > 0 && !m.cast[0].includes('Başrol'));
    const pool = withRealCast.length >= 5 ? withRealCast : movies;
    return [...pool].sort((a, b) => parseFloat(b.imdb) - parseFloat(a.imdb)).slice(0, 5);
  }, [movies]);

  const homeContext = {
    movies,
    setMovies,
    loading,
    setLoading,
    catalogError,
    retryCatalogLoad,
    toast,
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
  };

  return (
    <HomePageProvider value={homeContext}>
      <HomeLayout />
    </HomePageProvider>
  );
}