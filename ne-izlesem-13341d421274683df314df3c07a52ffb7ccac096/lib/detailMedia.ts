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

function toEmbeddableTrailer(video: { key: string; name?: string }, fallbackLabel: string) {
  const key = video.key.trim();
  if (!YOUTUBE_KEY_PATTERN.test(key)) return null;
  return {
    key,
    embedUrl: `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
    name: video.name || fallbackLabel,
  };
}

type PickableVideo = { key: string; site: string; type: string; official?: boolean; name?: string; iso_639_1?: string };

function findVideo(results: PickableVideo[], type: string, iso: string) {
  const matches = results.filter((video) => {
    const site = (video.site || '').toLowerCase();
    const videoType = (video.type || '').toLowerCase();
    const videoIso = (video.iso_639_1 || '').toLowerCase();
    return site === 'youtube' && videoType === type && videoIso === iso && YOUTUBE_KEY_PATTERN.test((video.key || '').trim());
  });

  const official = matches.find((video) => video.official);
  return official || matches[0] || null;
}

// Öncelik sırası: TR Trailer -> EN Trailer -> TR Teaser -> EN Teaser -> TR Clip -> EN Clip
export function pickYoutubeTrailer(videos?: TmdbDetail['videos']) {
  const results = (videos?.results || []) as PickableVideo[];

  const priorities: Array<{ type: string; iso: string; label: string }> = [
    { type: 'trailer', iso: 'tr', label: 'Fragman' },
    { type: 'trailer', iso: 'en', label: 'Trailer' },
    { type: 'teaser', iso: 'tr', label: 'Teaser' },
    { type: 'teaser', iso: 'en', label: 'Teaser' },
    { type: 'clip', iso: 'tr', label: 'Klip' },
    { type: 'clip', iso: 'en', label: 'Clip' },
  ];

  for (const { type, iso, label } of priorities) {
    const video = findVideo(results, type, iso);
    if (video?.key) {
      const trailer = toEmbeddableTrailer(video, label);
      if (trailer) return trailer;
    }
  }

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
