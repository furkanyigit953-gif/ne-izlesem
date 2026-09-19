import { NextResponse } from 'next/server';
import { buildCacheHeaders, enforceRateLimit, rateLimitResponse } from '@/lib/apiSecurity';

type TmdbListItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  media_type?: 'movie' | 'tv';
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

const MOVIE_GENRES: Record<number, string> = {
  28: 'Aksiyon',
  12: 'Macera',
  16: 'Animasyon',
  35: 'Komedi',
  80: 'Suç',
  99: 'Belgesel',
  18: 'Dram',
  10751: 'Aile',
  14: 'Fantastik',
  36: 'Tarih',
  27: 'Korku',
  10402: 'Müzik',
  9648: 'Gizem',
  10749: 'Romantik',
  878: 'Bilim Kurgu',
  10770: 'TV Filmi',
  53: 'Gerilim',
  10752: 'Savaş',
  37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Aksiyon',
  16: 'Animasyon',
  35: 'Komedi',
  80: 'Suç',
  99: 'Belgesel',
  18: 'Dram',
  10751: 'Aile',
  10762: 'Çocuk',
  9648: 'Gizem',
  10763: 'Haber',
  10764: 'Reality',
  10765: 'Bilim Kurgu',
  10766: 'Pembe Dizi',
  10767: 'Talk Show',
  10768: 'Savaş',
  37: 'Western',
};

function getCredentials() {
  const bearer =
    process.env.TMDB_API_TOKEN ||
    process.env.TMDB_ACCESS_TOKEN ||
    process.env.TMDB_READ_ACCESS_TOKEN;

  const apiKey = process.env.TMDB_API_KEY;

  if (!bearer && !apiKey) {
    return null;
  }

  return { bearer, apiKey };
}

function tmdbUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'tr-TR');

  return url;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined>
) {
  const credentials = getCredentials();

  if (!credentials) {
    throw new Error(
      'TMDB kimlik bilgisi bulunamadı. Vercel Environment Variables içine TMDB_API_TOKEN veya TMDB_API_KEY ekleyin.'
    );
  }

  const url = tmdbUrl(path, params);

  const headers: HeadersInit = {
    accept: 'application/json',
  };

  if (credentials.bearer) {
    headers.Authorization = credentials.bearer.startsWith('Bearer ')
      ? credentials.bearer
      : `Bearer ${credentials.bearer}`;
  } else if (credentials.apiKey) {
    url.searchParams.set('api_key', credentials.apiKey);
  }

  const response = await fetch(url.toString(), {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`TMDB ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function createFallbackBackdrop(title: string) {
  return `https://placehold.co/1280x720/07111f/67e8f9?text=${encodeURIComponent(
    title
  )}`;
}

function toMovieItem(item: TmdbListItem, mediaType: 'movie' | 'tv') {
  const title = (
    mediaType === 'tv'
      ? item.name
      : item.title
  )?.trim();

  if (!title) {
    return null;
  }

  const yearRaw =
    mediaType === 'tv'
      ? item.first_air_date
      : item.release_date;

  const year = yearRaw ? yearRaw.slice(0, 4) : '';
  const voteCount = typeof item.vote_count === 'number' ? item.vote_count : 0;
  const popularity = typeof item.popularity === 'number' ? item.popularity : 0;
  const voteAverage = typeof item.vote_average === 'number' ? item.vote_average : 0;

  if (!item.poster_path || (voteCount < 150 && popularity < 20) || (Number(year) < 1995 && voteAverage < 7.5)) {
    return null;
  }

  const genreMap =
    mediaType === 'tv'
      ? TV_GENRES
      : MOVIE_GENRES;

  const genres = (item.genre_ids || [])
    .map((id) => genreMap[id])
    .filter(Boolean);

  const posterUrl = `${TMDB_IMAGE_BASE}${item.poster_path}`;

  const backdropUrl = item.backdrop_path
    ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}`
    : createFallbackBackdrop(title);

  return {
    title,
    year,
    genre: genres.slice(0, 3).join(', ') || 'Yapım',
    imdb:
      typeof item.vote_average === 'number'
        ? item.vote_average.toFixed(1)
        : '0.0',

    summary:
      item.overview ||
      'Bu yapım hakkında henüz bir özet bulunmuyor.',

    posterUrl,
    backdropUrl,

    contentType:
      mediaType === 'tv'
        ? 'Dizi'
        : 'Film',

    durationOrSeason:
      mediaType === 'tv'
        ? 'Dizi'
        : 'Film',

    cast: [],

    language:
      item.original_language || '',

    originalLanguage:
      item.original_language || '',

    popularity,

    voteCount,

    tmdbId:
      item.id,

    isLocal:
      false,

    platforms: [
      {
        key: 'justwatch',
        name: 'JustWatch',
        color: '#f8fafc',
        url: `https://www.justwatch.com/tr/arama?q=${encodeURIComponent(
          title
        )}`,
      },
    ],
  };
}

async function fetchPages(
  mediaType: 'movie' | 'tv',
  startPage: number,
  pageCount: number
) {
  const results: TmdbListItem[] = [];

  const pages = Array.from(
    { length: pageCount },
    (_, index) => startPage + index
  ).filter((page) => page <= 500);

  for (let i = 0; i < pages.length; i += 5) {
    const batch = pages.slice(i, i + 5);

    const batchResults = await Promise.all(
      batch.map(async (page) => {
        const data =
          await tmdbFetch<{
            results?: TmdbListItem[];
          }>(
            `/discover/${mediaType}`,
            {
              page,
              sort_by: 'popularity.desc',
              region: 'TR',
              watch_region: 'TR',
              without_genres:
                mediaType === 'movie'
                  ? undefined
                  : undefined,
            }
          );

        return data.results || [];
      })
    );

    results.push(...batchResults.flat());
  }

  return results;
}

export async function GET(request: Request) {
  try {
    const allowed = enforceRateLimit({
      request,
      key: 'tmdb-discover',
      maxRequests: 30,
      windowMs: 60_000,
    });

    if (!allowed) {
      return rateLimitResponse({
        request,
        key: 'tmdb-discover',
        maxRequests: 30,
        windowMs: 60_000,
        message: 'Çok fazla arama isteği gönderildi. Lütfen birkaç saniye sonra tekrar deneyin.',
      });
    }

    const { searchParams } = new URL(request.url);

    const typeParam = searchParams.get('type') || 'all';
    const allowedTypes = new Set(['all', 'movie', 'tv']);
    if (!allowedTypes.has(typeParam)) {
      return NextResponse.json({ error: 'Geçersiz type değeri.' }, { status: 400 });
    }

    const batchRaw = Number(searchParams.get('batch') || '0');
    const batch = Number.isInteger(batchRaw) && batchRaw >= 0 ? batchRaw : NaN;
    if (!Number.isFinite(batch)) {
      return NextResponse.json({ error: 'Geçersiz batch değeri.' }, { status: 400 });
    }

    const pageCountRaw = Number(searchParams.get('pageCount') || '5');
    const pageCount = Number.isInteger(pageCountRaw) && pageCountRaw >= 1 && pageCountRaw <= 5 ? pageCountRaw : NaN;
    if (!Number.isFinite(pageCount)) {
      return NextResponse.json({ error: 'pageCount 1 ile 5 arasında olmalıdır.' }, { status: 400 });
    }

    const startPage = batch * pageCount + 1;

    const mediaTypes: Array<'movie' | 'tv'> =
      typeParam === 'movie' ? ['movie'] : typeParam === 'tv' ? ['tv'] : ['movie', 'tv'];

    const chunks = await Promise.all(
      mediaTypes.map((mediaType) => fetchPages(mediaType, startPage, pageCount))
    );

    const mapped = chunks
      .flatMap((chunk, index) =>
        chunk
          .map((item) =>
            toMovieItem(
              item,
              mediaTypes[index]
            )
          )
          .filter(Boolean)
      );

    const unique = Array.from(
      mapped.reduce((map: Map<string, any>, item: any) => {
        const idKey = `${item.contentType}:${item.tmdbId || item.title}:${item.posterUrl}`;
        if (!map.has(idKey)) map.set(idKey, item);
        return map;
      }, new Map<string, any>()).values()
    );

    unique.sort(
      (a: any, b: any) =>
        (b.popularity || 0) -
        (a.popularity || 0)
    );

    return NextResponse.json(unique, {
      headers: buildCacheHeaders({ maxAge: 900, staleWhileRevalidate: 1800 }),
    });
  } catch (error) {
    console.error(
      'movies route error',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Film arşivi alınamadı.',
      },
      {
        status: 500,
      }
    );
  }
}