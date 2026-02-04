'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  MAPBOX_GEOCODING_COUNTRY,
  MAPBOX_GEOCODING_LANGUAGE,
  MAPBOX_GEOCODING_LIMIT,
} from '@/lib/config/mapbox';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { getErrorMessage } from '@/lib/error-utils';
import { mapboxApi } from '@/lib/mapbox-api';

import { useDebounce } from './use-debounce';

export interface AddressSuggestion {
  id: string;
  address: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

interface UseAddressAutocompleteProps {
  query: string;
  enabled?: boolean;
  debounceMs?: number;
}

export const useAddressAutocomplete = ({
  query,
  enabled = true,
  debounceMs = 300,
}: UseAddressAutocompleteProps) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  const normalizedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);
  const shouldFetch = enabled && normalizedQuery.length >= 3;

  const suggestionsQuery = useQuery({
    queryKey: ['address-autocomplete', normalizedQuery],
    enabled: shouldFetch,
    queryFn: async () => {
      const { data } = await mapboxApi.get(
        `/geocoding/v5/mapbox.places/${encodeURIComponent(normalizedQuery)}.json`,
        {
          params: {
            country: MAPBOX_GEOCODING_COUNTRY,
            limit: MAPBOX_GEOCODING_LIMIT,
            language: MAPBOX_GEOCODING_LANGUAGE,
          },
        }
      );

      const formattedSuggestions: AddressSuggestion[] = data.features.map(
        (feature: {
          id: string;
          place_name: string;
          text: string;
          center: [number, number];
        }) => ({
          id: feature.id,
          address: feature.place_name,
          placeName: feature.text,
          latitude: feature.center[1],
          longitude: feature.center[0],
        })
      );

      return formattedSuggestions;
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    suggestions: shouldFetch ? suggestionsQuery.data ?? [] : [],
    isLoading: suggestionsQuery.isLoading,
    error: getErrorMessage(suggestionsQuery.error),
  };
};
