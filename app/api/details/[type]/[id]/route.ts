import { NextResponse } from 'next/server';
import { getTmdbDetail } from '@/lib/tmdb';
import { buildCacheHeaders, enforceRateLimit, rateLimitResponse } from '@/lib/apiSecurity';

const detailCache = new Map<string, { expiresAt: number; data: any }>();

export async function GET(request: Request, context: { params: Promise<{ type: string; id: string }> }) {
  try {
    const allowed = enforceRateLimit({
      request,
      key: 'tmdb-detail',
      maxRequests: 40,
      windowMs: 60_000,
    });

    if (!allowed) {
      return rateLimitResponse({
        request,
        key: 'tmdb-detail',
        maxRequests: 40,
        windowMs: 60_000,
        message: 'Detay isteği sınırına ulaşıldı. Lütfen daha sonra tekrar deneyin.',
      });
    }

    const { type, id } = await context.params;
    if (type !== 'movie' && type !== 'tv') {
      return NextResponse.json({ error: 'Geçersiz içerik türü.' }, { status: 400 });
    }

    if (!/^[0-9]+$/.test(id)) {
      return NextResponse.json({ error: 'Geçersiz içerik kimliği.' }, { status: 400 });
    }

    const cacheKey = `${type}:${id}`;
    const cached = detailCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, {
        headers: buildCacheHeaders({ maxAge: 900, staleWhileRevalidate: 1800 }),
      });
    }

    const data = await getTmdbDetail(type, id);
    detailCache.set(cacheKey, { expiresAt: now + 15 * 60 * 1000, data });

    return NextResponse.json(data, {
      headers: buildCacheHeaders({ maxAge: 900, staleWhileRevalidate: 1800 }),
    });
  } catch {
    return NextResponse.json({ error: 'Yapım detayları alınamadı.' }, { status: 502 });
  }
}
