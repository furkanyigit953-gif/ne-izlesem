import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildCacheHeaders,
  enforceRateLimit,
  rateLimitResponse,
  readJsonWithLimit,
} from '@/lib/apiSecurity';

const MAX_PROMPT_LENGTH = 500;
const MAX_BODY_BYTES = 4096;
const AI_RATE_LIMIT_WINDOW_MS = 60_000;
const AI_RATE_LIMIT_MAX_REQUESTS = 10;

export async function POST(request: Request) {
  try {
    const allowed = enforceRateLimit({
      request,
      key: 'ai-chat',
      maxRequests: AI_RATE_LIMIT_MAX_REQUESTS,
      windowMs: AI_RATE_LIMIT_WINDOW_MS,
    });

    if (!allowed) {
      return rateLimitResponse({
        request,
        key: 'ai-chat',
        maxRequests: AI_RATE_LIMIT_MAX_REQUESTS,
        windowMs: AI_RATE_LIMIT_WINDOW_MS,
        message: 'Çok fazla istek gönderildi. Lütfen kısa süre sonra tekrar deneyin.',
      });
    }

    const bodyResult = await readJsonWithLimit(request, MAX_BODY_BYTES);
    if (bodyResult.ok === false) {
      return bodyResult.response;
    }

    const { prompt } = bodyResult.data || {};
    const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : '';

    if (!cleanPrompt) {
      return NextResponse.json({ success: false, error: 'Bir istek yazın.' }, { status: 400 });
    }

    if (cleanPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ success: false, error: 'İstek metni çok uzun.' }, { status: 413 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI servisi yapılandırılmamış.' }, { status: 503 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responsePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Sen Ne İzlesem uygulamasının Türkçe film ve dizi danışmanısın. Kullanıcı isteğine kısa, dürüst ve uygulanabilir bir yanıt ver. Uydurma platform, puan veya yapım bilgisi verme. Kullanıcı isteği: ${cleanPrompt}`,
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

    const text = typeof response?.text === 'string' && response.text.trim() ? response.text.trim() : 'Şu anda öneri üretilemedi.';

    return NextResponse.json(
      { success: true, text, analysis: text, movies: [] },
      {
        headers: buildCacheHeaders({ maxAge: 0, staleWhileRevalidate: 0 }),
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'AI_TIMEOUT') {
      return NextResponse.json({ success: false, error: 'AI isteği zaman aşımına uğradı.' }, { status: 504 });
    }

    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: 'AI servisine şu anda ulaşılamıyor.' }, { status: 502 });
  }
}
