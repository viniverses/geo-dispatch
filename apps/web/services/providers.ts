import { mockProviders } from '@/mocks/providers';
import type { Coordinates, ServiceProvider, ServiceType } from '@/types';
import { calculateDistance } from '@/utils/geolocation';

const filterByServiceType = (
  providers: ServiceProvider[],
  serviceType: ServiceType
): ServiceProvider[] => {
  return providers.filter((provider) => provider.serviceType === serviceType && provider.available);
};

const sortByDistance = (
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
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    .slice(0, 10);
};

const FETCH_DELAY_MS = 500;

export const providersService = {
  getProviders: async (
    serviceType: ServiceType,
    coordinates: Coordinates
  ): Promise<ServiceProvider[]> => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY_MS));

    const fromDb = mockProviders;
    const filtered = filterByServiceType(fromDb, serviceType);
    return sortByDistance(filtered, coordinates);
  },
};
