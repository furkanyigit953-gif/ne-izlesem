import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MovieDetailPage from '@/components/MovieDetailPage';
import { getTmdbDetail, imageUrl } from '@/lib/tmdb';
import { getTurkeyWatchProviders } from '@/lib/detailMedia';
import { buildMediaJsonLd, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const detail = await getTmdbDetail('tv', id);
    const title = detail.name || 'Dizi';
    const year = (detail.first_air_date || '').slice(0, 4);
    const cast = (detail.credits?.cast || []).slice(0, 3).map((person) => person.name).filter(Boolean);
    const { items: providers } = getTurkeyWatchProviders(detail);
    const platformNames = providers.slice(0, 3).map((provider) => provider.name);

    const pageTitle = `${title}${year ? ` (${year})` : ''} konusu, oyuncuları ve izleme platformları - Ne İzlesem`;

    const descriptionParts = [
      detail.overview?.trim() || `${title} dizisinin konusu, oyuncu kadrosu ve nerede izlenebileceği hakkında bilgi.`,
    ];
    if (cast.length) descriptionParts.push(`Oyuncular: ${cast.join(', ')}.`);
    if (platformNames.length) descriptionParts.push(`İzleme platformları: ${platformNames.join(', ')}.`);
    if (detail.vote_average) descriptionParts.push(`IMDb puanı: ${detail.vote_average.toFixed(1)}/10.`);
    const description = descriptionParts.join(' ').slice(0, 300);

    const poster = imageUrl(detail.poster_path, 'w500');
    const canonicalUrl = `${SITE_URL}/tv/${id}`;

    return {
      title: pageTitle,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: pageTitle,
        description,
        url: canonicalUrl,
        siteName: 'NE İZLESEM?',
        type: 'video.tv_show',
        images: poster ? [{ url: poster, width: 500, height: 750, alt: title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: poster ? [poster] : undefined,
      },
    };
  } catch {
    return {
      title: 'Dizi | Ne İzlesem',
      description: 'Ne izleyeceğine karar veremiyorsan dizi ve film önerilerini keşfet.',
      alternates: { canonical: SITE_URL },
    };
  }
}

export default async function TvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let detail;
  try { detail = await getTmdbDetail('tv', id); } catch { notFound(); }

  const jsonLd = buildMediaJsonLd(detail, 'tv', id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MovieDetailPage detail={detail} type="tv" />
    </>
  );
}

