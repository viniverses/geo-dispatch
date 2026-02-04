'use client';

import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import Map from 'react-map-gl/mapbox';

import { useDestination } from '@/contexts/destination-context';
import { useLocation } from '@/contexts/location-context';
import { type ServiceProvider, useProviders } from '@/contexts/providers-context';
import { MAPBOX_MAP_STYLE } from '@/config/mapbox';

import { LocationMarker } from './location-marker';
import { ProviderMarker } from './provider-marker';
import { RouteLayer } from './route-layer';

interface MapViewProps {
  viewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  onViewStateChange: (viewState: { longitude: number; latitude: number; zoom: number }) => void;
  onMapClick: (event: { lngLat: { lat: number; lng: number } }) => void;
  onMarkerDrag: (event: { lngLat: { lat: number; lng: number } }) => void;
  route: { coordinates: number[][]; distance: number; duration: number } | null;
  onProviderClick?: (provider: ServiceProvider) => void;
}

export const MapView = ({
  viewState,
  onViewStateChange,
  onMapClick,
  onMarkerDrag,
  route,
  onProviderClick,
}: MapViewProps) => {
  const { latitude, longitude } = useLocation();
  const { providers } = useProviders();
  const { destination } = useDestination();

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const currentLat = latitude ?? viewState.latitude;
  const currentLng = longitude ?? viewState.longitude;

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-svh" ref={mapContainerRef}>
      <Map
        {...viewState}
        onMove={(evt) => onViewStateChange(evt.viewState)}
        onClick={onMapClick}
        style={{ width: '100%', height: '100svh' }}
        mapStyle={MAPBOX_MAP_STYLE}
      >
        {currentLat && currentLng && (
          <LocationMarker
            latitude={currentLat}
            longitude={currentLng}
            variant="primary"
            draggable
            onDrag={onMarkerDrag}
          />
        )}

        <RouteLayer route={route} />

        {destination && (
          <LocationMarker
            latitude={destination.latitude}
            longitude={destination.longitude}
            variant="destructive"
          />
        )}

        {providers.map((provider) => (
          <ProviderMarker key={provider.id} provider={provider} onClick={onProviderClick} />
        ))}
      </Map>
    </div>
  );
};
