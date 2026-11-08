import BrowsePage from '@/components/BrowsePage';

export const metadata = { title: 'Diziler | Ne İzlesem', description: 'Popüler dizi keşifleri, puanlar ve türler.' };

export default function TvPage() {
  return <BrowsePage type="tv" />;
}
