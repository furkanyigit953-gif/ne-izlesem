import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://neizlesem-app.vercel.app'),
  title: 'NE İZLESEM? — Film & Dizi Keşfetmenin En Kolay Yolu',
  description: 'Ne izleyeceğine karar verme, biz seçelim! Akıllı çarkı çevir; Netflix, Disney+, Prime Video ve BluTV içeriklerini şansına bırakarak anında keşfet.',
  keywords: [
    'ne izlesem',
    'film önerileri',
    'dizi önerisi',
    'film çarkı',
    'rastgele film seçici',
    'bugün ne izlesem',
    'şansıma bırak film'
  ],
  authors: [{ name: 'NE İZLESEM?' }],
  creator: 'NE İZLESEM?',
  openGraph: {
    title: 'NE İZLESEM? — Film & Dizi Keşfetmenin En Kolay Yolu',
    description: 'Ne izleyeceğine karar verme, biz seçelim. Çarkı çevir, akşamın yapımını anında kap!',
    url: 'https://neizlesem-app.vercel.app',
    siteName: 'NE İZLESEM?',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NE İZLESEM? — Film & Dizi Keşfetmenin En Kolay Yolu',
    description: 'Kararsız kaldığında ne izleyeceğini şansına bırak!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inlineSvgIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32'%3E%3Crect width='32' height='32' rx='8' fill='%23050811'/%3E%3Ccircle cx='16' cy='16' r='10' stroke='%2306b6d4' stroke-width='2' stroke-dasharray='3 2' fill='none'/%3E%3Cpolygon points='13,10 21,16 13,22' fill='%2322d3ee'/%3E%3C/svg%3E`;

  return (
    <html lang="tr" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href={inlineSvgIcon} />
        <link rel="shortcut icon" href={inlineSvgIcon} />
      </head>
      <body className="bg-[#050811] text-slate-100 antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}