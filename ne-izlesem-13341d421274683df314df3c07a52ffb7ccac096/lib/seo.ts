import type { TmdbDetail } from '@/lib/tmdb';
import { imageUrl } from '@/lib/tmdb';

export const SITE_URL = 'https://neizlesem-app.vercel.app';

function toIsoDuration(minutes?: number | null) {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  const duration = `PT${hours ? `${hours}H` : ''}${remainder ? `${remainder}M` : ''}`;
  return duration === 'PT' ? undefined : duration;
}

/** Builds Schema.org Movie/TVSeries JSON-LD for rich snippets in search results. */
export function buildMediaJsonLd(detail: TmdbDetail, type: 'movie' | 'tv', id: string) {
  const title = detail.title || detail.name || 'Yapım';
  const url = `${SITE_URL}/${type}/${id}`;
  const image = imageUrl(detail.poster_path, 'w500') || undefined;
  const director = detail.credits?.crew?.find((person) => person.job === 'Director')?.name;
  const actors = (detail.credits?.cast || [])
    .slice(0, 8)
    .map((person) => person.name)
    .filter((name): name is string => Boolean(name));
  const genres = (detail.genres || []).map((genre) => genre.name);

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type === 'movie' ? 'Movie' : 'TVSeries',
    name: title,
    url,
    image,
    description: detail.overview || `${title} hakkında detaylı inceleme.`,
    genre: genres.length ? genres : undefined,
    datePublished: detail.release_date || detail.first_air_date || undefined,
    director: director ? { '@type': 'Person', name: director } : undefined,
    actor: actors.length ? actors.map((name) => ({ '@type': 'Person', name })) : undefined,
    aggregateRating: detail.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: detail.vote_average,
          ratingCount: detail.vote_count || 1,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
  };

  if (type === 'movie' && detail.runtime) {
    base.duration = toIsoDuration(detail.runtime);
  }

  if (type === 'tv') {
    if (detail.number_of_seasons) base.numberOfSeasons = detail.number_of_seasons;
    if (detail.number_of_episodes) base.numberOfEpisodes = detail.number_of_episodes;
  }

  return base;
}
