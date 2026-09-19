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
  const youtubeTrailers = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const type = (video.type || '').toLowerCase();
    return site === 'youtube' && type === 'trailer' && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  const official = youtubeTrailers.find((video) => video.official);
  const chosen = official || youtubeTrailers[0];
  if (!chosen?.key) return null;

  const key = chosen.key.trim();
  if (!YOUTUBE_KEY_PATTERN.test(key)) return null;

  return {
    key,
    embedUrl: `https://www.youtube-nocookie.com/embed/${key}`,
    name: chosen.name || 'Fragman',
  };
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
