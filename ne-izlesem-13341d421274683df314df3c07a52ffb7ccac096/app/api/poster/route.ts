import { NextResponse } from 'next/server';
import { buildCacheHeaders, enforceRateLimit, rateLimitResponse } from '@/lib/apiSecurity';

const ALLOWED_HOSTS = new Set([
  'image.tmdb.org',
  'media.themoviedb.org',
]);

const MAX_IMAGE_BYTES = 1_500_000;

export async function GET(request: Request) {
  try {
    const allowed = enforceRateLimit({
      request,
      key: 'poster-proxy',
      maxRequests: 60,
      windowMs: 60_000,
    });

    if (!allowed) {
      return rateLimitResponse({
        request,
        key: 'poster-proxy',
        maxRequests: 60,
        windowMs: 60_000,
        message: 'Poster sunucusuna çok fazla istek gönderildi.',
      });
    }

    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get('url');

    if (!rawUrl) {
      return new NextResponse('Poster URL eksik.', { status: 400 });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(rawUrl);
    } catch {
      return new NextResponse('Geçersiz poster URL.', { status: 400 });
    }

    if (targetUrl.protocol !== 'https:') {
      return new NextResponse('Yalnızca HTTPS poster URLlerine izin verilir.', { status: 403 });
    }

    if (!ALLOWED_HOSTS.has(targetUrl.hostname)) {
      return new NextResponse('Geçersiz poster kaynağı.', { status: 403 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(targetUrl.toString(), {
        cache: 'force-cache',
        signal: controller.signal,
      });

      if (!response.ok) {
        return new NextResponse('Poster alınamadı.', { status: response.status });
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      if (!contentType.startsWith('image/')) {
        return new NextResponse('Geçersiz içerik tipi.', { status: 415 });
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > MAX_IMAGE_BYTES) {
        return new NextResponse('Poster çok büyük.', { status: 413 });
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          ...buildCacheHeaders({ maxAge: 86400, staleWhileRevalidate: 604800 }),
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new NextResponse('Poster isteği zaman aşımına uğradı.', { status: 504 });
    }

    return new NextResponse('Poster servisi hatası.', { status: 500 });
  }
}