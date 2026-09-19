import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MovieDetailPage from '@/components/MovieDetailPage';
import { getTmdbDetail } from '@/lib/tmdb';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const detail = await getTmdbDetail('tv', id);
    const title = detail.name || 'Dizi';
    const year = (detail.first_air_date || '').slice(0, 4);
    const description = detail.overview || `${title} dizi detayları ve puan bilgisi.`;
    return {
      title: `${title} (${year}) | Ne İzlesem`,
      description,
      alternates: { canonical: `https://neizlesem-app.vercel.app/tv/${id}` },
      openGraph: {
        title: `${title} (${year}) | Ne İzlesem`,
        description,
        url: `https://neizlesem-app.vercel.app/tv/${id}`,
        siteName: 'NE İZLESEM?',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} (${year}) | Ne İzlesem`,
        description,
      },
    };
  } catch {
    return {
      title: 'Dizi | Ne İzlesem',
      description: 'Ne izleyeceğine karar veremiyorsan dizi ve film önerilerini keşfet.',
      alternates: { canonical: 'https://neizlesem-app.vercel.app' },
    };
  }
}

export default async function TvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let detail;
  try { detail = await getTmdbDetail('tv', id); } catch { notFound(); }
  return <MovieDetailPage detail={detail} type="tv" />;
}
