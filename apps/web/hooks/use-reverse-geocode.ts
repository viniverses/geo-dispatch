'use client';

import { useQuery } from '@tanstack/react-query';

import { MAPBOX_GEOCODING_COUNTRY, MAPBOX_GEOCODING_LANGUAGE } from '@/lib/config/mapbox';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { getErrorMessage } from '@/lib/error-utils';
import { areCoordinatesValid } from '@/lib/geolocation';
import { mapboxApi } from '@/lib/mapbox-api';
import type { CoordinatesNullable } from '@/lib/types';

interface UseReverseGeocodeProps extends CoordinatesNullable {
  enabled?: boolean;
}

export const useReverseGeocode = ({
  latitude,
  longitude,
  enabled = true,
}: UseReverseGeocodeProps) => {
  const shouldFetch = enabled && areCoordinatesValid(latitude, longitude);

  const reverseGeocodeQuery = useQuery({
    queryKey: ['reverse-geocode', latitude, longitude],
    enabled: shouldFetch,
    queryFn: async () => {
      const { data } = await mapboxApi.get(
        `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            country: MAPBOX_GEOCODING_COUNTRY,
            limit: 1,
            language: MAPBOX_GEOCODING_LANGUAGE,
          },
        }
      );

      const feature = data.features?.[0];
      if (!feature?.place_name) {
        return null;
      }

      return feature.place_name as string;
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    address: reverseGeocodeQuery.data ?? null,
    isLoading: reverseGeocodeQuery.isLoading,
    error: getErrorMessage(reverseGeocodeQuery.error),
  };
};
