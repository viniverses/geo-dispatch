import { calculateDistance } from '@/lib/geolocation';
import type { ServiceProvider, ServiceType } from '@/lib/types';
import type { Coordinates } from '@/lib/types';

export const filterProvidersByServiceType = (
  providers: ServiceProvider[],
  serviceType: ServiceType
): ServiceProvider[] => {
  return providers.filter((provider) => provider.serviceType === serviceType && provider.available);
};

export const calculateAndSortProvidersByDistance = (
  providers: ServiceProvider[],
  coordinates: Coordinates
): ServiceProvider[] => {
  return providers
    .map((provider) => ({
      ...provider,
      distance: calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        provider.latitude,
        provider.longitude
      ),
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, 10);
};

