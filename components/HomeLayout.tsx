'use client';

import React from 'react';
import { useHomePageContext } from './HomePageContext';
import HomeHeader from './HomeHeader';
import HomeBanner from './HomeBanner';
import DiscoverySection from './DiscoverySection';
import RecommendationSection from './RecommendationSection';
import WheelSection from './WheelSection';
import HomeSidebar from './HomeSidebar';
import FloatingSpin from './FloatingSpin';
import Footer from './Footer';
import RecommendationModal from './RecommendationModal';
import MovieDetailSection from './MovieDetailSection';
import AIAssistantSection from './AIAssistantSection';
import ListsModal from './ListsModal';
import InfoModals from './InfoModals';
import AuthModal from './AuthModal';
import HistoryModal from './HistoryModal';

export default function HomeLayout() {
  const { toast } = useHomePageContext();

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden antialiased" style={{ fontFamily: 'Inter, SF Pro Display, Segoe UI, sans-serif' }}>
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-cyan-950/25 via-blue-950/15 to-transparent pointer-events-none" />
      <HomeHeader />
      {toast.visible && (
        <div className="fixed bottom-5 right-5 z-[80] rounded-full border border-cyan-300/20 bg-[#07121c]/90 px-4 py-2.5 text-sm font-bold text-cyan-100 shadow-[0_22px_50px_rgba(14,165,233,0.2)] backdrop-blur-xl">
          {toast.message}
        </div>
      )}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-col xl:flex-row gap-8 items-start my-6 z-10">
        <div className="w-full min-w-0 flex flex-col gap-8">
          <WheelSection />
          <HomeBanner />
          <DiscoverySection />
          <RecommendationSection />
        </div>
        <HomeSidebar />
      </main>
      <FloatingSpin />
      <Footer />
      <RecommendationModal />
      <MovieDetailSection />
      <AIAssistantSection />
      <ListsModal />
      <InfoModals />
      <AuthModal />
      <HistoryModal />
    </div>
  );
}
