import type { TmdbDetail, TmdbWatchProvider } from '@/lib/tmdb';
import { imageUrl } from '@/lib/tmdb';

const YOUTUBE_KEY_PATTERN = /^[A-Za-z0-9_-]{6,20}$/;
const TMDB_WATCH_HOSTS = new Set(['www.themoviedb.org', 'themoviedb.org']);

export type WatchOfferKind = 'flatrate' | 'ads' | 'rent' | 'buy';

export type WatchProviderCard = {
  id: string;
  name: string;
  logoUrl: string;
  kind: WatchOfferKind;
};

const KIND_ORDER: WatchOfferKind[] = ['flatrate', 'ads', 'rent', 'buy'];

export function safeExternalHttps(raw: string | null | undefined, allowedHosts: Set<string>) {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    if (!allowedHosts.has(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function googleSearchUrl(name: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name)}`;
}

export function pickYoutubeTrailer(videos?: TmdbDetail['videos']) {
  const results = videos?.results || [];

  // Türkçe fragman ara
  const turkishTrailers = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const type = (video.type || '').toLowerCase();
    const iso = (video.iso_639_1 || '').toLowerCase();
    return site === 'youtube' && type === 'trailer' && iso === 'tr' && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  // Türkçe fragman bulunursa en resmi olanı seç
  if (turkishTrailers.length > 0) {
    const official = turkishTrailers.find((video) => video.official);
    const chosen = official || turkishTrailers[0];
    if (chosen?.key && YOUTUBE_KEY_PATTERN.test(chosen.key.trim())) {
      const key = chosen.key.trim();
      return {
        key,
        embedUrl: `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
        name: chosen.name || 'Fragman',
      };
    }
  }

  // İngilizce fragman ara (fallback)
  const englishTrailers = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const type = (video.type || '').toLowerCase();
    const iso = (video.iso_639_1 || '').toLowerCase();
    return site === 'youtube' && type === 'trailer' && iso === 'en' && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  if (englishTrailers.length > 0) {
    const official = englishTrailers.find((video) => video.official);
    const chosen = official || englishTrailers[0];
    if (chosen?.key && YOUTUBE_KEY_PATTERN.test(chosen.key.trim())) {
      const key = chosen.key.trim();
      return {
        key,
        embedUrl: `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
        name: chosen.name || 'Fragman',
      };
    }
  }

  // Son fallback: Teaser ara (Türkçe -> İngilizce)
  const turkishTeasers = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const type = (video.type || '').toLowerCase();
    const iso = (video.iso_639_1 || '').toLowerCase();
    return site === 'youtube' && type === 'teaser' && iso === 'tr' && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  if (turkishTeasers.length > 0) {
    const chosen = turkishTeasers[0];
    if (chosen?.key && YOUTUBE_KEY_PATTERN.test(chosen.key.trim())) {
      const key = chosen.key.trim();
      return {
        key,
        embedUrl: `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
        name: chosen.name || 'Teaser',
      };
    }
  }

  const englishTeasers = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const type = (video.type || '').toLowerCase();
    const iso = (video.iso_639_1 || '').toLowerCase();
    return site === 'youtube' && type === 'teaser' && iso === 'en' && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  if (englishTeasers.length > 0) {
    const chosen = englishTeasers[0];
    if (chosen?.key && YOUTUBE_KEY_PATTERN.test(chosen.key.trim())) {
      const key = chosen.key.trim();
      return {
        key,
        embedUrl: `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
        name: chosen.name || 'Teaser',
      };
    }
  }

  // Hiçbirşey bulunamadı
  return null;
}

function mapProviders(list: TmdbWatchProvider[] | undefined, kind: WatchOfferKind, seen: Set<string>) {
  const cards: WatchProviderCard[] = [];

  for (const provider of list || []) {
    const name = (provider.provider_name || '').trim();
    if (!name) continue;

    const id = String(provider.provider_id || name.toLowerCase());
    if (seen.has(id)) continue;
    seen.add(id);

    cards.push({
      id,
      name,
      logoUrl: imageUrl(provider.logo_path, 'w92'),
      kind,
    });
  }

  return cards;
}

export function getTurkeyWatchProviders(detail: TmdbDetail) {
  const country = detail['watch/providers']?.results?.TR;
  const seen = new Set<string>();
  const items = KIND_ORDER.flatMap((kind) => mapProviders(country?.[kind], kind, seen));

  return {
    items,
    watchLink: safeExternalHttps(country?.link, TMDB_WATCH_HOSTS),
  };
}

export function resolveDirector(detail: TmdbDetail) {
  const fromCrew = detail.credits?.crew?.find((person) => person.job === 'Director')?.name?.trim();
  if (fromCrew) return { name: fromCrew };

  const fromCreated = detail.created_by?.find((person) => person.name?.trim())?.name?.trim();
  if (fromCreated) return { name: fromCreated };

  return null;
}
