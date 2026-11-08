export const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getPosterSrc = (posterUrl?: string) => {
  if (!posterUrl) return '';

  if (posterUrl.startsWith('/api/poster')) {
    return posterUrl;
  }

  if (posterUrl.includes('image.tmdb.org') || posterUrl.includes('media.themoviedb.org')) {
    return `/api/poster?url=${encodeURIComponent(posterUrl)}`;
  }

  return posterUrl;
};
