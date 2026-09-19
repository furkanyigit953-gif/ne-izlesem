import { NextResponse } from 'next/server';

const RATE_LIMIT_BUCKETS = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim() || 'unknown';

  return 'unknown';
}

export function enforceRateLimit({
  request,
  key,
  maxRequests,
  windowMs,
}: {
  request: Request;
  key: string;
  maxRequests: number;
  windowMs: number;
}) {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const bucket = RATE_LIMIT_BUCKETS.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    RATE_LIMIT_BUCKETS.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (bucket.count >= maxRequests) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function rateLimitResponse({
  request,
  key,
  maxRequests,
  windowMs,
  message,
}: {
  request: Request;
  key: string;
  maxRequests: number;
  windowMs: number;
  message: string;
}) {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const bucket = RATE_LIMIT_BUCKETS.get(bucketKey);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(((bucket?.resetAt ?? now + windowMs) - now) / 1000)
  );

  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(maxRequests),
        'X-RateLimit-Window': String(windowMs),
      },
    }
  );
}

export async function readJsonWithLimit(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; data: any } | { ok: false; response: NextResponse }> {
  const rawBody = await request.text();

  if (Buffer.byteLength(rawBody, 'utf8') > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'İstek çok büyük.' },
        {
          status: 413,
        }
      ),
    };
  }

  if (!rawBody) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'İstek gövdesi boş.' },
        {
          status: 400,
        }
      ),
    };
  }

  try {
    return {
      ok: true,
      data: JSON.parse(rawBody),
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Geçersiz JSON.' },
        {
          status: 400,
        }
      ),
    };
  }
}

export function buildCacheHeaders({
  maxAge,
  staleWhileRevalidate,
}: {
  maxAge: number;
  staleWhileRevalidate: number;
}) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}
