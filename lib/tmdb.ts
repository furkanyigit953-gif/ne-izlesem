const TMDB_BASE = 'https://api.themoviedb.org/3';

export type TmdbDetail = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  production_countries?: { iso_3166_1: string; name: string }[];
  homepage?: string | null;
  created_by?: { id: number; name: string; profile_path?: string | null }[];
  credits?: {
    cast?: { id: number; name: string; character?: string; profile_path?: string | null }[];
    crew?: { id: number; name: string; job: string }[];
  };
  videos?: { results?: { key: string; site: string; type: string; official?: boolean; name?: string; iso_639_1?: string }[] };
  recommendations?: { results?: TmdbDetail[] };
  'watch/providers'?: {
    results?: Record<string, TmdbWatchCountry | undefined>;
  };
};

export type TmdbWatchProvider = {
  provider_id?: number;
  provider_name?: string;
  logo_path?: string | null;
  display_priority?: number;
};

export type TmdbWatchCountry = {
  link?: string;
  flatrate?: TmdbWatchProvider[];
  ads?: TmdbWatchProvider[];
  rent?: TmdbWatchProvider[];
  buy?: TmdbWatchProvider[];
};

function credentials() {
  const bearer = process.env.TMDB_API_TOKEN || process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!bearer && !apiKey) throw new Error('TMDB kimlik bilgisi bulunamadı.');
  return { bearer, apiKey };
}

export async function tmdbFetch<T>(path: string, params: Record<string, string | number | undefined> = {}) {
  const { bearer, apiKey } = credentials();
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('language', 'tr-TR');
  for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));
  if (apiKey && !bearer) url.searchParams.set('api_key', apiKey);
  const headers: HeadersInit = { accept: 'application/json' };
  if (bearer) headers.Authorization = bearer.startsWith('Bearer ') ? bearer : `Bearer ${bearer}`;
  const response = await fetch(url, { headers, next: { revalidate: 900 } });
  if (!response.ok) throw new Error(`TMDB ${response.status}`);
  return response.json() as Promise<T>;
}

export function imageUrl(path?: string | null, size = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
}

export async function getTmdbDetail(type: 'movie' | 'tv', id: string) {
  return tmdbFetch<TmdbDetail>(`/${type}/${encodeURIComponent(id)}`, {
    append_to_response: 'credits,videos,recommendations,watch/providers',
    // Without this, TMDB only returns videos matching the tr-TR page language, hiding most trailers.
    include_video_language: 'tr,en,null',
  });
}
