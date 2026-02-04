'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_STALE_TIME } from '@/constants';
import { mapboxService } from '@/services/mapbox';
import type { CoordinatesNullable } from '@/types';
import { getErrorMessage } from '@/utils/error';
import { areCoordinatesValid } from '@/utils/geolocation';

interface UseReverseGeocodeProps extends CoordinatesNullable {
  enabled?: boolean;
}

export const useReverseGeocode = ({
  latitude,
  longitude,
  enabled = true,
}: UseReverseGeocodeProps) => {
  const shouldFetch =
    enabled && latitude != null && longitude != null && areCoordinatesValid(latitude, longitude);

  const reverseGeocodeQuery = useQuery({
    queryKey: ['reverse-geocode', latitude, longitude],
    enabled: shouldFetch,
    queryFn: async () => {
      if (latitude == null || longitude == null) return null;
      const data = await mapboxService.getReverseGeocode(latitude, longitude);
      return data.features?.[0]?.place_name ?? null;
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    address: reverseGeocodeQuery.data ?? null,
    isLoading: reverseGeocodeQuery.isLoading,
    error: getErrorMessage(reverseGeocodeQuery.error),
  };
};
