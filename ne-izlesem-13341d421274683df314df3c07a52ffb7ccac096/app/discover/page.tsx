import BrowsePage from '@/components/BrowsePage';

export const metadata = { title: 'Keşfet | Ne İzlesem', description: 'Film ve dizileri filtreleyerek keşfet.' };

export default function DiscoverPage() {
  return <BrowsePage type="all" />;
}
