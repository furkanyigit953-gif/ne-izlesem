'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const HomePageContext = createContext<any>(null);

export function HomePageProvider({ value, children }: { value: any; children: ReactNode }) {
  return <HomePageContext.Provider value={value}>{children}</HomePageContext.Provider>;
}

export function useHomePageContext() {
  const value = useContext(HomePageContext);
  if (!value) throw new Error('useHomePageContext must be used inside HomePageProvider');
  return value;
}
