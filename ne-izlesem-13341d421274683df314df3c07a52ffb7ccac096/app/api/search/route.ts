import { NextResponse } from 'next/server';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

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

function credentials() {
  const bearer = process.env.TMDB_API_TOKEN || process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  return bearer || apiKey ? { bearer, apiKey } : null;
}

function makeUrl(query: string, page: number) {
  const url = new URL('https://api.themoviedb.org/3/search/multi');
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('language', 'tr-TR');
  url.searchParams.set('include_adult', 'false');

  const c = credentials();
  if (c?.apiKey && !c.bearer) {
    url.searchParams.set('api_key', c.apiKey);
  }

  return url;
}

function mapMovie(item: any) {
  if (item.media_type !== 'movie' && item.media_type !== 'tv') return null;

  const isTv = item.media_type === 'tv';
  const title = (isTv ? item.name : item.title)?.trim();
  if (!title) return null;

  const yearRaw = isTv ? item.first_air_date : item.release_date;
  const genres = (item.genre_ids || [])
    .map((id: number) => (isTv ? TV_GENRES[id] : MOVIE_GENRES[id]))
    .filter(Boolean);

  return {
    title,
    year: yearRaw ? yearRaw.slice(0, 4) : '',
    genre: genres.slice(0, 3).join(', ') || 'Yapım',
    imdb: typeof item.vote_average === 'number' ? item.vote_average.toFixed(1) : '0.0',
    popularity: typeof item.popularity === 'number' ? item.popularity : 0,
    summary: item.overview || 'Bu yapım hakkında henüz bir özet bulunmuyor.',
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : '',
    contentType: isTv ? 'Dizi' : 'Film',
    durationOrSeason: isTv ? 'Dizi' : 'Film',
    cast: [],
    language: item.original_language || '',
    originalLanguage: item.original_language || '',
    tmdbId: item.id,
    platforms: [{
      key: 'justwatch',
      name: 'JustWatch',
      url: `https://www.justwatch.com/tr/arama?q=${encodeURIComponent(title)}`,
    }],
  };
}

function mapPerson(item: any) {
  if (item.media_type !== 'person' || !item.name) return null;
  return {
    kind: 'person',
    id: item.id,
    name: item.name,
    department: item.known_for_department || 'Oyuncu',
    posterUrl: item.profile_path ? `${TMDB_IMAGE_BASE}${item.profile_path}` : '',
    knownFor: Array.isArray(item.known_for)
      ? item.known_for.slice(0, 3).map((known: any) => known.title || known.name).filter(Boolean)
      : [],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  const includePeople = searchParams.get('includePeople') === 'true';

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const c = credentials();
  if (!c) {
    return NextResponse.json({ error: 'TMDB kimlik bilgisi bulunamadı.' }, { status: 500 });
  }

  try {
    const url = makeUrl(query, 1);
    const headers: HeadersInit = { accept: 'application/json' };
    if (c.bearer) {
      headers.Authorization = c.bearer.startsWith('Bearer ') ? c.bearer : `Bearer ${c.bearer}`;
    }

    const res = await fetch(url.toString(), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`TMDB ${res.status}`);
    }

    const data = await res.json();
    const results = (data.results || [])
      .map((item: any) => (includePeople ? mapMovie(item) || mapPerson(item) : mapMovie(item)))
      .filter(Boolean)
      .slice(0, 15);

    return NextResponse.json(results);
  } catch (error) {
    console.error('search route error', error);
    return NextResponse.json({ error: 'Arama servisine ulaşılamadı.' }, { status: 500 });
  }
}
