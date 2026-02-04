'use client';

import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/mapbox';

interface RouteLayerProps {
  route: { coordinates: number[][] } | null;
}

export const RouteLayer = ({ route }: RouteLayerProps) => {
  const routeGeoJson = useMemo(() => {
    if (!route) return null;

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: route.coordinates,
      },
      properties: {},
    };
  }, [route]);

  const routeColor = 'rgba(255, 255, 255, 0.5)';

  if (!routeGeoJson) return null;

  return (
    <Source id="route" type="geojson" data={routeGeoJson}>
      <Layer
        id="route-line"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round',
        }}
        paint={{
          'line-color': routeColor,
          'line-width': 4,
          'line-opacity': 0.8,
        }}
      />
    </Source>
  );
};

