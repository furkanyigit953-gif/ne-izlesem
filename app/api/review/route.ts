import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildCacheHeaders,
  enforceRateLimit,
  rateLimitResponse,
  readJsonWithLimit,
} from '@/lib/apiSecurity';

const MAX_BODY_BYTES = 8192;
const MAX_OVERVIEW_LENGTH = 600;
const MAX_GENRES = 8;
const MAX_CAST = 10;
const AI_RATE_LIMIT_WINDOW_MS = 60_000;
const AI_RATE_LIMIT_MAX_REQUESTS = 10;

export async function POST(request: Request) {
  try {
    const allowed = enforceRateLimit({
      request,
      key: 'ai-review',
      maxRequests: AI_RATE_LIMIT_MAX_REQUESTS,
      windowMs: AI_RATE_LIMIT_WINDOW_MS,
    });

    if (!allowed) {
      return rateLimitResponse({
        request,
        key: 'ai-review',
        maxRequests: AI_RATE_LIMIT_MAX_REQUESTS,
        windowMs: AI_RATE_LIMIT_WINDOW_MS,
        message: 'Çok fazla inceleme isteği gönderildi. Lütfen birkaç saniye sonra tekrar deneyin.',
      });
    }

    const bodyResult = await readJsonWithLimit(request, MAX_BODY_BYTES);
    if (bodyResult.ok === false) {
      return bodyResult.response;
    }

    const data = bodyResult.data || {};
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const type = data.type === 'movie' || data.type === 'tv' ? data.type : 'movie';
    const year = typeof data.year === 'number' ? data.year : Number(data.year || 0);
    const overview = typeof data.overview === 'string' ? data.overview.trim().slice(0, MAX_OVERVIEW_LENGTH) : '';
    const director = typeof data.director === 'string' ? data.director.trim() : '';
    const rating = typeof data.rating === 'number' ? data.rating : Number(data.rating || 0);
    const genres = Array.isArray(data.genres) ? data.genres.filter((item: unknown) => typeof item === 'string').slice(0, MAX_GENRES) : [];
    const cast = Array.isArray(data.cast) ? data.cast.filter((item: unknown) => typeof item === 'string').slice(0, MAX_CAST) : [];

    if (!title) {
      return NextResponse.json({ success: false, error: 'Film veya dizi adı eksik.' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI servisi yapılandırılmamış.' }, { status: 503 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = [
      'Sen Türkçe konuşan bir film/dizi yorum uzmanısın.',
      'Yalnızca gerçek ve güvenilir bir değerlendirme yap. Uydurma bilgiler ekleme.',
      `Başlık: ${title}`,
      `Tür: ${type === 'movie' ? 'film' : 'dizi'}`,
      `Yıl: ${year || 'Bilinmiyor'}`,
      `Türler: ${genres.length ? genres.join(', ') : 'Belirtilmemiş'}`,
      `IMDb puanı: ${Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : 'Bilinmiyor'}`,
      `Yönetmen: ${director || 'Bilinmiyor'}`,
      `Oyuncular: ${cast.length ? cast.join(', ') : 'Bilinmiyor'}`,
      `Özet: ${overview || 'Özet yok'}`,
      'Cevabın şu formatta olsun:',
      '🎬 Genel değerlendirme',
      '⭐ Kimler sevebilir?',
      '🎭 Tür analizi',
      '⚡ Güçlü yönleri',
      '⚠️ Dikkat edilmesi gerekenler',
      'En fazla 6-8 cümlelik kısa ama anlaşılır bir yorum yaz.'
    ].join('\n');

    const responsePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const response = await Promise.race([
      responsePromise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI_TIMEOUT')), 8000);
      }),
    ]).catch((error) => {
      if (error instanceof Error && error.message === 'AI_TIMEOUT') {
        throw new Error('AI_TIMEOUT');
      }
      throw error;
    });

    const text = typeof response?.text === 'string' && response.text.trim() ? response.text.trim() : 'AI incelemesi şu anda hazır değil.';

    return NextResponse.json(
      { success: true, text, analysis: text },
      { headers: buildCacheHeaders({ maxAge: 0, staleWhileRevalidate: 0 }) }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'AI_TIMEOUT') {
      return NextResponse.json({ success: false, error: 'AI incelemesi zaman aşımına uğradı.' }, { status: 504 });
    }

    return NextResponse.json({ success: false, error: 'AI incelemesi şu anda kullanılamıyor. Lütfen birkaç saniye sonra tekrar deneyin.' }, { status: 502 });
  }
}
