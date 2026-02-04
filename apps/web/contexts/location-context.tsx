'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { areCoordinatesValid } from '@/lib/geolocation';

interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lng: number) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const setLocation = (lat: number, lng: number) => {
    if (areCoordinatesValid(lat, lng)) {
      setLatitude(lat);
      setLongitude(lng);
    }
  };

  useEffect(() => {
    if (!hasRequestedLocation && navigator.geolocation) {
      setHasRequestedLocation(true);
      setIsLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation(lat, lng);
          setIsLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [hasRequestedLocation]);

  return (
    <LocationContext.Provider value={{ latitude, longitude, setLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
