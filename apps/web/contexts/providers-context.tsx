'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { QUERY_STALE_TIME } from '@/lib/constants';
import { mockProviders } from '@/lib/mocks/providers';
import {
  calculateAndSortProvidersByDistance,
  filterProvidersByServiceType,
} from '@/lib/services/providers-service';
import type { Coordinates, CoordinatesNullable, ServiceType } from '@/lib/types';

export interface ServiceProvider extends Coordinates {
  id: string;
  name: string;
  serviceType: ServiceType;
  rating: number;
  distance?: number;
  available: boolean;
}

interface ProvidersContextType {
  providers: ServiceProvider[];
  isLoading: boolean;
  fetchProviders: (serviceType: ServiceType | undefined, coordinates: CoordinatesNullable) => void;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export const ProvidersProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState<{
    serviceType: ServiceType | undefined;
    coordinates: CoordinatesNullable;
  }>({
    serviceType: undefined,
    coordinates: { latitude: null, longitude: null },
  });

  const fetchProviders = useCallback(
    (serviceType: ServiceType | undefined, coordinates: CoordinatesNullable) => {
      setParams({ serviceType, coordinates });
    },
    []
  );

  const queryKey = useMemo(
    () => ['providers', params.serviceType, params.coordinates.latitude, params.coordinates.longitude] as const,
    [params.serviceType, params.coordinates.latitude, params.coordinates.longitude]
  );

  const providersQuery = useQuery({
    queryKey,
    enabled: Boolean(
      params.serviceType && params.coordinates.latitude != null && params.coordinates.longitude != null
    ),
    queryFn: async () => {
      const { serviceType, coordinates } = params;
      if (!serviceType || !coordinates.latitude || !coordinates.longitude) {
        return [];
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const filteredProviders = filterProvidersByServiceType(mockProviders, serviceType);
      return calculateAndSortProvidersByDistance(filteredProviders, {
        latitude: coordinates.latitude!,
        longitude: coordinates.longitude!,
      });
    },
    staleTime: QUERY_STALE_TIME,
  });

  return (
    <ProvidersContext.Provider
      value={{
        providers: providersQuery.data ?? [],
        isLoading: providersQuery.isLoading,
        fetchProviders,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};

export const useProviders = () => {
  const context = useContext(ProvidersContext);
  if (context === undefined) {
    throw new Error('useProviders must be used within a ProvidersProvider');
  }
  return context;
};
