'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_TIME } from '@/constants';
import { mapboxService } from '@/services/mapbox';
import type { Coordinates, Route } from '@/types';
import { getErrorMessage } from '@/utils/error';
import { areCoordinatesValid } from '@/utils/geolocation';

interface UseRouteProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  enabled?: boolean;
}

export const useRoute = ({ origin, destination, enabled = true }: UseRouteProps) => {
  const originLat = origin?.latitude ?? null;
  const originLng = origin?.longitude ?? null;
  const destLat = destination?.latitude ?? null;
  const destLng = destination?.longitude ?? null;

  const routeQuery = useQuery({
    queryKey: ['route', originLat, originLng, destLat, destLng],
    enabled: Boolean(
      enabled &&
      originLat != null &&
      originLng != null &&
      destLat != null &&
      destLng != null &&
      areCoordinatesValid(originLat, originLng) &&
      areCoordinatesValid(destLat, destLng)
    ),
    queryFn: async () => {
      if (originLat == null || originLng == null || destLat == null || destLng == null) {
        throw new Error('Origem ou destino inválidos');
      }

      if (!areCoordinatesValid(originLat, originLng) || !areCoordinatesValid(destLat, destLng)) {
        throw new Error('Coordenadas inválidas');
      }

      const data = await mapboxService.getDirections(
        { latitude: originLat, longitude: originLng },
        { latitude: destLat, longitude: destLng }
      );

      const routeData = data.routes?.[0];
      if (data.code !== 'Ok' || !routeData) {
        throw new Error('Rota não encontrada');
      }

      return {
        coordinates: routeData.geometry.coordinates,
        distance: routeData.distance / 1000,
        duration: routeData.duration / 60,
      } satisfies Route;
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    route: routeQuery.data ?? null,
    isLoading: routeQuery.isLoading,
    error: getErrorMessage(routeQuery.error),
  };
};
