/** @type {import('next-sitemap').IConfig} */
const TMDB_BASE = 'https://api.themoviedb.org/3';

function tmdbHeaders() {
  const bearer = process.env.TMDB_API_TOKEN || process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;
  return bearer ? { Authorization: bearer.startsWith('Bearer ') ? bearer : `Bearer ${bearer}` } : undefined;
}

// Millions of TMDB ids exist, so the sitemap only lists currently popular titles instead of every possible id.
async function fetchPopularIds(mediaType, pages) {
  const apiKey = process.env.TMDB_API_KEY;
  const headers = tmdbHeaders();
  if (!headers && !apiKey) return [];

  const ids = [];
  for (let page = 1; page <= pages; page += 1) {
    const url = new URL(`${TMDB_BASE}/${mediaType}/popular`);
    url.searchParams.set('language', 'tr-TR');
    url.searchParams.set('page', String(page));
    if (apiKey && !headers) url.searchParams.set('api_key', apiKey);

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) break;
      const data = await response.json();
      for (const item of data.results || []) {
        if (item?.id) ids.push(item.id);
      }
    } catch {
      break;
    }
  }
  return ids;
}

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://neizlesem-app.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*', '/movie/[id]', '/tv/[id]'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: path === '/' ? 1.0 : config.priority,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async (config) => {
    const [movieIds, tvIds] = await Promise.all([
      fetchPopularIds('movie', 5),
      fetchPopularIds('tv', 5),
    ]);

    const moviePaths = movieIds.map((id) => config.transform(config, `/movie/${id}`));
    const tvPaths = tvIds.map((id) => config.transform(config, `/tv/${id}`));

    return Promise.all([...moviePaths, ...tvPaths]);
  },
};
