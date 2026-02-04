'use client';

import { useEffect, useState } from 'react';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface UseMapViewStateProps {
  latitude: number | null;
  longitude: number | null;
  destination: { latitude: number; longitude: number } | null;
  defaultLongitude?: number;
  defaultLatitude?: number;
  defaultZoom?: number;
}

export const useMapViewState = ({
  latitude,
  longitude,
  destination,
  defaultLongitude = -46.566696,
  defaultLatitude = -23.693492,
  defaultZoom = 14,
}: UseMapViewStateProps) => {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: longitude || defaultLongitude,
    latitude: latitude || defaultLatitude,
    zoom: defaultZoom,
  });

  useEffect(() => {
    if (latitude && longitude) {
      if (destination) {
        const bounds = {
          minLat: Math.min(latitude, destination.latitude),
          maxLat: Math.max(latitude, destination.latitude),
          minLng: Math.min(longitude, destination.longitude),
          maxLng: Math.max(longitude, destination.longitude),
        };

        const centerLat = (bounds.minLat + bounds.maxLat) / 2;
        const centerLng = (bounds.minLng + bounds.maxLng) / 2;

        const latDiff = bounds.maxLat - bounds.minLat;
        const lngDiff = bounds.maxLng - bounds.minLng;
        const maxDiff = Math.max(latDiff, lngDiff);

        let zoom = 14;
        if (maxDiff > 0.1) zoom = 11;
        else if (maxDiff > 0.05) zoom = 12;
        else if (maxDiff > 0.02) zoom = 13;

        setViewState({
          longitude: centerLng,
          latitude: centerLat,
          zoom,
        });
      } else {
        setViewState({
          longitude,
          latitude,
          zoom: 14,
        });
      }
    }
  }, [latitude, longitude, destination]);

  return { viewState, setViewState };
};

