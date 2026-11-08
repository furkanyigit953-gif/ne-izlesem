import { NextResponse } from 'next/server';

export interface MovieItem {
  title: string;
  year: string;
  genre: string;
  imdb: string;
  duration?: string;
  durationMinutes?: number;
  summary: string;
  contentType: 'Film' | 'Dizi';
  platforms: { name: string; color: string; badge: string }[];
  posterUrl: string;
}

export const MOVIE_DATABASE: MovieItem[] = [
  {
    title: 'Kurtlar Vadisi',
    year: '2003',
    genre: 'Aksiyon, Suç',
    imdb: '8.9',
    duration: '97 Bölüm',
    durationMinutes: 70,
    summary: 'Polat Alemdar kimliğiyle mafya konseyinin içine sızan istihbaratçı Ali Candan’ın efsanevi mücadelesi.',
    contentType: 'Dizi',
    platforms: [{ name: 'blutv', color: '#00a3ff', badge: 'blu' }, { name: 'Prime Video', color: '#00a8e1', badge: 'prime' }],
    posterUrl: 'https://images.alphacoders.com/884/884210.jpg',
  },
  {
    title: 'Ezel',
    year: '2009',
    genre: 'Dram, Suç',
    imdb: '8.7',
    duration: '2 Sezon',
    durationMinutes: 90,
    summary: 'En yakın arkadaşları ve sevdiği kadın tarafından ihanete uğrayan Ömer’in intikam için Ezel olarak dönüşü.',
    contentType: 'Dizi',
    platforms: [{ name: 'Netflix', color: '#e50914', badge: 'N' }],
    posterUrl: 'https://images.alphacoders.com/131/1314482.jpeg',
  },
  {
    title: 'Gibi',
    year: '2021',
    genre: 'Komedi',
    imdb: '9.0',
    duration: '5 Sezon',
    durationMinutes: 30,
    summary: 'Yılmaz ve İlkkan’ın sıradan hayatlarını absürt ve içinden çıkılmaz maceralara dönüştürme serüveni.',
    contentType: 'Dizi',
    platforms: [{ name: 'blutv', color: '#00a3ff', badge: 'blu' }],
    posterUrl: 'https://occ-0-2774-2773.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8UECpeNqqs/AAAABUfD_Z53Z0a0b6m2UqJ7.jpg',
  },
  {
    title: 'Şahsiyet',
    year: '2018',
    genre: 'Suç, Dram',
    imdb: '9.0',
    duration: '2 Sezon',
    durationMinutes: 60,
    summary: 'Alzheimer teşhisi konan emekli adliye memuru Agâh Beyoğlu’nun geçmişin hesabını sorma kararı.',
    contentType: 'Dizi',
    platforms: [{ name: 'blutv', color: '#00a3ff', badge: 'blu' }],
    posterUrl: 'https://images.alphacoders.com/978/978508.jpg',
  },
  {
    title: 'Ölümlü Dünya',
    year: '2018',
    genre: 'Komedi, Aksiyon',
    imdb: '7.6',
    duration: '1s 47dk',
    durationMinutes: 107,
    summary: 'Lokantacılık kisvesi altında nesillerdir kiralık katillik yapan Mermer Ailesi’nin ifşa olması.',
    contentType: 'Film',
    platforms: [{ name: 'Netflix', color: '#e50914', badge: 'N' }],
    posterUrl: 'https://occ-0-2774-2773.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8UECpeNqqs/AAAABbS8s7j9e_a0q7X0d8gGg3Kk.jpg',
  },
  {
    title: 'The Dark Knight',
    year: '2008',
    genre: 'Aksiyon, Suç',
    imdb: '9.0',
    duration: '2s 32dk',
    durationMinutes: 152,
    summary: 'Batman, Gotham kentini kaosa sürükleyen Joker ile amansız bir savaşa girer.',
    contentType: 'Film',
    platforms: [{ name: 'Netflix', color: '#e50914', badge: 'N' }],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
  },
  {
    title: 'The Batman',
    year: '2022',
    genre: 'Aksiyon, Suç',
    imdb: '7.8',
    duration: '2s 56dk',
    durationMinutes: 176,
    summary: 'Gotham’ın yozlaşmış yeraltı dünyasında cinayetler işleyen Riddler’ın peşine düşen Batman.',
    contentType: 'Film',
    platforms: [{ name: 'Max', color: '#002be7', badge: 'MAX' }],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg',
  },
  {
    title: 'Interstellar',
    year: '2014',
    genre: 'Bilim Kurgu, Dram',
    imdb: '8.7',
    duration: '2s 49dk',
    durationMinutes: 169,
    summary: 'İnsanlık için yeni bir yuva arayan astronotların solucan deliği yolculuğu.',
    contentType: 'Film',
    platforms: [{ name: 'Prime Video', color: '#00a8e1', badge: 'prime' }],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
  },
  {
    title: 'Breaking Bad',
    year: '2008',
    genre: 'Dram, Suç',
    imdb: '9.5',
    duration: '5 Sezon',
    durationMinutes: 47,
    summary: 'Kanser teşhisi konan lise kimya öğretmeninin uyuşturucu baronuna dönüşüm öyküsü.',
    contentType: 'Dizi',
    platforms: [{ name: 'Netflix', color: '#e50914', badge: 'N' }],
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Breaking_Bad_title_card.png',
  }
];

export async function POST(req: Request) {
  try {
    const { genre, platform, contentType, duration, minImdb, onlyNew, searchQuery, historyTitles } = await req.json();

    const seenTitles = (historyTitles || '')
      .split(',')
      .map((t: string) => t.trim().toLowerCase())
      .filter(Boolean);

    let pool = MOVIE_DATABASE;

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const searchMatches = pool.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q)
      );
      return NextResponse.json(searchMatches.length > 0 ? searchMatches[0] : pool[0]);
    }

    if (platform && platform !== 'Tümü') {
      const platFiltered = pool.filter((m) =>
        m.platforms.some((p) => p.name.toLowerCase() === platform.toLowerCase())
      );
      if (platFiltered.length > 0) pool = platFiltered;
    }

    if (contentType === 'Sadece Film') {
      const filmFiltered = pool.filter((m) => m.contentType === 'Film');
      if (filmFiltered.length > 0) pool = filmFiltered;
    } else if (contentType === 'Sadece Dizi') {
      const diziFiltered = pool.filter((m) => m.contentType === 'Dizi');
      if (diziFiltered.length > 0) pool = diziFiltered;
    }

    if (duration && duration !== 'all') {
      const durationFiltered = pool.filter((m) => {
        if (!m.durationMinutes) return true;
        if (duration === 'short') return m.durationMinutes <= 90;
        if (duration === 'medium') return m.durationMinutes > 90 && m.durationMinutes <= 120;
        if (duration === 'long') return m.durationMinutes > 120;
        return true;
      });
      if (durationFiltered.length > 0) pool = durationFiltered;
    }

    if (minImdb && !isNaN(parseFloat(minImdb))) {
      const minVal = parseFloat(minImdb);
      const imdbFiltered = pool.filter((m) => parseFloat(m.imdb) >= minVal);
      if (imdbFiltered.length > 0) pool = imdbFiltered;
    }

    if (onlyNew) {
      const newFiltered = pool.filter((m) => parseInt(m.year) >= 2020);
      if (newFiltered.length > 0) pool = newFiltered;
    }

    if (genre && genre !== 'Tümü') {
      const genreFiltered = pool.filter((m) =>
        m.genre.toLowerCase().includes(genre.toLowerCase())
      );
      if (genreFiltered.length > 0) pool = genreFiltered;
    }

    let unshown = pool.filter((m) => !seenTitles.includes(m.title.toLowerCase()));
    if (unshown.length === 0) unshown = pool;

    const selected = unshown[Math.floor(Math.random() * unshown.length)];
    return NextResponse.json(selected);
  } catch {
    return NextResponse.json(MOVIE_DATABASE[0]);
  }
}