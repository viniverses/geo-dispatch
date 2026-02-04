'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { QUERY_STALE_TIME } from '@/constants';
import { mapboxService } from '@/services/mapbox';
import { getErrorMessage } from '@/utils/error';

import { useDebounce } from './use-debounce';

export type AddressSuggestion = {
  id: string;
  address: string;
  placeName: string;
  latitude: number;
  longitude: number;
};

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
      const data = await mapboxService.getForwardGeocode(normalizedQuery);
      return data.features.map((feature) => ({
        id: feature.id,
        address: feature.place_name,
        placeName: feature.text,
        latitude: feature.center[1],
        longitude: feature.center[0],
      }));
    },
    staleTime: QUERY_STALE_TIME,
  });

  return {
    suggestions: shouldFetch ? (suggestionsQuery.data ?? []) : [],
    isLoading: suggestionsQuery.isLoading,
    error: getErrorMessage(suggestionsQuery.error),
  };
};
