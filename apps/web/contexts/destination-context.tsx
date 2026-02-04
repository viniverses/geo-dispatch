'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import type { Coordinates } from '@/types';

interface DestinationWithAddress extends Coordinates {
  address: string;
}

interface DestinationContextType {
  destination: DestinationWithAddress | null;
  setDestination: (destination: DestinationWithAddress | null) => void;
  clearDestination: () => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [destination, setDestination] = useState<DestinationWithAddress | null>(null);

  const clearDestination = () => {
    setDestination(null);
  };

  return (
    <DestinationContext.Provider value={{ destination, setDestination, clearDestination }}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestination = () => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};
