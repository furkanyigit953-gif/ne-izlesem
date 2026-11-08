export interface Platform {
  name: string;
  key: string;
  color: string;
  url: string;
}

export interface MovieItem {
  title: string;
  year: string;
  genre: string;
  imdb: string;
  durationOrSeason: string;
  summary: string;
  contentType: 'Film' | 'Dizi';
  isLocal: boolean;

  // TMDB / arama / sıralama için
  popularity?: number;
  voteCount?: number;
  tmdbId?: number;
  backdropUrl?: string;
  language?: string;
  originalLanguage?: string;

  platforms: Platform[];
  posterUrl: string;
  cast: string[];
}

export interface UserProfile {
  name: string;
  username: string;
  fullName: string;
  birthYear: string;
  email: string;
  avatarBg: string;
  provider?: string;
}