import {
  MAPBOX_GEOCODING_COUNTRY,
  MAPBOX_GEOCODING_LANGUAGE,
  MAPBOX_GEOCODING_LIMIT,
} from '@/config/mapbox';
import { mapboxApi } from '@/lib/mapbox-api';
import type { Coordinates, MapboxDirectionsResponse, MapboxGeocodingResponse } from '@/types';

export const mapboxService = {
  getDirections: async (
    origin: Coordinates,
    destination: Coordinates
  ): Promise<MapboxDirectionsResponse> => {
    const originCoords = `${origin.longitude},${origin.latitude}`;
    const destCoords = `${destination.longitude},${destination.latitude}`;
    const { data } = await mapboxApi.get<MapboxDirectionsResponse>(
      `/directions/v5/mapbox/driving/${originCoords};${destCoords}`,
      {
        params: {
          geometries: 'geojson',
          overview: 'full',
          steps: false,
        },
      }
    );
    return data;
  },

  getReverseGeocode: async (
    latitude: number,
    longitude: number
  ): Promise<MapboxGeocodingResponse> => {
    const { data } = await mapboxApi.get<MapboxGeocodingResponse>(
      `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
      {
        params: {
          country: MAPBOX_GEOCODING_COUNTRY,
          limit: 1,
          language: MAPBOX_GEOCODING_LANGUAGE,
        },
      }
    );
    return data;
  },

  getForwardGeocode: async (query: string): Promise<MapboxGeocodingResponse> => {
    const { data } = await mapboxApi.get<MapboxGeocodingResponse>(
      `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          country: MAPBOX_GEOCODING_COUNTRY,
          limit: MAPBOX_GEOCODING_LIMIT,
          language: MAPBOX_GEOCODING_LANGUAGE,
        },
      }
    );
    return data;
  },
};
