'use client';

import { useState } from 'react';

import { CurrentLocationButton } from '@/components/current-location-button';
import { LoadingOverlay } from '@/components/loading-overlay';
import { MapView } from '@/components/map/map-view';
import { ProviderDetailsDialog } from '@/components/provider-details-dialog';
import { ServiceRequestPanel } from '@/components/request/request-panel';
import { useDestination } from '@/contexts/destination-context';
import { useLocation } from '@/contexts/location-context';
import type { ServiceProvider } from '@/contexts/providers-context';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useMapViewState } from '@/hooks/use-map-view-state';
import { useRoute } from '@/hooks/use-route';

export default function Page() {
  const { latitude, longitude, setLocation, isLoading } = useLocation();
  const { destination } = useDestination();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [providerDialogOpen, setProviderDialogOpen] = useState(false);

  const { viewState, setViewState } = useMapViewState({
    latitude,
    longitude,
    destination,
  });

  const { route } = useRoute({
    origin: latitude && longitude ? { latitude, longitude } : null,
    destination: destination ? destination: null,
    enabled: !!destination && !!latitude && !!longitude,
  });

  const { handleGetCurrentLocation } = useCurrentLocation({
    onLocationObtained: (lat, lng) => setLocation(lat, lng),
  });

  const handleMapClick = (event: { lngLat: { lat: number; lng: number } }) => {
    const { lat, lng } = event.lngLat;
    setLocation(lat, lng);
  };

  const handleMarkerDrag = (event: { lngLat: { lat: number; lng: number } }) => {
    const { lat, lng } = event.lngLat;
    setLocation(lat, lng);
  };

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setProviderDialogOpen(true);
  };

  return (
    <div className="flex relative h-svh">
      <ServiceRequestPanel />

      <MapView
        viewState={viewState}
        onViewStateChange={setViewState}
        onMapClick={handleMapClick}
        onMarkerDrag={handleMarkerDrag}
        route={route}
        onProviderClick={handleProviderClick}
      />

      <CurrentLocationButton
        onGetCurrentLocation={handleGetCurrentLocation}
        isLoading={isLoading}
      />

      <LoadingOverlay isLoading={isLoading} />

      <ProviderDetailsDialog
        provider={selectedProvider}
        open={providerDialogOpen}
        onOpenChange={(open) => {
          setProviderDialogOpen(open);
          if (!open) {
            setSelectedProvider(null);
          }
        }}
      />
    </div>
  );
}
