'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_TIME } from '@/lib/constants';
import { getErrorMessage } from '@/lib/error-utils';
import { areCoordinatesValid } from '@/lib/geolocation';
import { mapboxApi } from '@/lib/mapbox-api';
import type { Coordinates } from '@/lib/types';

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

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

      const originCoords = `${originLng},${originLat}`;
      const destCoords = `${destLng},${destLat}`;

      const { data } = await mapboxApi.get(
        `/directions/v5/mapbox/driving/${originCoords};${destCoords}`,
        {
          params: {
            geometries: 'geojson',
            overview: 'full',
            steps: false,
          },
        }
      );

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('Rota não encontrada');
      }

      const routeData = data.routes[0];
      const coordinates = routeData.geometry.coordinates as [number, number][];

      return {
        coordinates,
        distance: routeData.distance / 1000,
        duration: routeData.duration / 60,
      } satisfies RouteData;
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    route: routeQuery.data ?? null,
    isLoading: routeQuery.isLoading,
    error: getErrorMessage(routeQuery.error),
  };
};
