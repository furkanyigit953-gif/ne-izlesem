'use client';

import React, { useState } from 'react';
import { MovieItem } from '../types/movie';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinWithRecommendations: (movies: MovieItem[]) => void;
}

const IconSparkles = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="M19 17v4M21 19h-4M4 3v4M6 5H2"/></svg>;
const IconSend = () => <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/></svg>;
const IconSpin = () => <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11a8.1 8.1 0 0 0-14.8-4.4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 14.8 4.4L21 15"/><path d="M21 20v-5h-5"/></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>;

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onSpinWithRecommendations }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ text: string; movies: MovieItem[] } | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;
    setIsLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      if (!res.ok) throw new Error('API Hatası');
      const data = await res.json();
      setAiResponse({ text: data?.text || 'Öneriler hazır.', movies: Array.isArray(data?.movies) ? data.movies : [] });
    } catch (error) {
      console.error('AI modal error:', error);
      setAiResponse({ text: 'Yapay zeka servisine şu anda bağlanılamıyor. Birkaç saniye sonra tekrar deneyebilirsin.', movies: [] });
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[#02050a]/80 p-4 backdrop-blur-xl animate-fade-in" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#080d18] shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_70px_rgba(34,211,238,0.08)] animate-modal-in">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.07] bg-white/[0.015] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.1)]"><IconSparkles /></div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black tracking-tight text-white sm:text-lg">AI Film &amp; Dizi Asistanı</h2>
              <p className="truncate text-[11px] font-medium text-slate-500">Ruh haline, türüne ve tarzına göre keşif önerileri</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"><IconClose /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          {aiResponse && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm leading-6 text-slate-300">{aiResponse.text}</div>
              {aiResponse.movies.length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {aiResponse.movies.map((movie, idx) => (
                    <article key={`${movie.title}-${idx}`} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#0d1421] p-3.5 transition hover:border-cyan-400/25 hover:bg-[#0f1827]">
                      <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-[#060b13]">
                        {movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-600"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 8 6 4-6 4V8Z"/></svg></div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2"><span className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-300/80">{movie.contentType || 'Yapım'} • {movie.year}</span><span className="shrink-0 rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-black text-amber-300">★ {movie.imdb}</span></div>
                        <h3 className="mt-1 truncate text-sm font-black text-white">{movie.title}</h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{movie.summary}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {aiResponse.movies.length > 0 && (
                <button type="button" onClick={() => onSpinWithRecommendations(aiResponse.movies)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 py-3.5 text-sm font-black text-cyan-200 transition hover:bg-cyan-400/15 hover:text-white active:scale-[0.99]"><IconSpin /> Bu Önerilerle Çarkı Çevir</button>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
              <span className="text-xs font-semibold text-cyan-200/70">Arşiv taranıyor, öneriler hazırlanıyor...</span>
            </div>
          )}

          {!aiResponse && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300"><IconSparkles /></div>
              <p className="max-w-md text-sm font-semibold leading-6 text-slate-400">Nasıl bir şey aradığını anlat. Örneğin: “Karanlık atmosferli bir bilim kurgu” veya “90 dakikalık hafif bir komedi”.</p>
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.07] bg-black/20 p-4 sm:p-5">
          <div className="relative flex items-center">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Aklındaki filmi, tarzı veya ruh halini yaz..." className="h-12 w-full rounded-2xl border border-white/10 bg-[#0f1724] pl-4 pr-28 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/45" />
            <button type="button" onClick={handleSend} disabled={isLoading || !prompt.trim()} className="absolute right-1.5 top-1.5 bottom-1.5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 text-xs font-black text-[#041016] shadow-[0_8px_24px_rgba(34,211,238,0.16)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-35"><IconSend /> Gönder</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
