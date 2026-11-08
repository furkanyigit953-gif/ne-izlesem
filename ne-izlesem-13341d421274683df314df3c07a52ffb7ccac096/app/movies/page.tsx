import BrowsePage from '@/components/BrowsePage';

export const metadata = { title: 'Filmler | Ne İzlesem', description: 'Popüler film keşifleri, puanlar ve türler.' };

export default function MoviesPage() {
  return <BrowsePage type="movie" />;
}
