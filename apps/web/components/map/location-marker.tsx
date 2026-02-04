'use client';

import { MapPin } from 'lucide-react';
import { Marker } from 'react-map-gl/mapbox';

interface LocationMarkerProps {
  latitude: number;
  longitude: number;
  variant?: 'primary' | 'destructive' | 'default';
  draggable?: boolean;
  onDrag?: (event: { lngLat: { lat: number; lng: number } }) => void;
}

export const LocationMarker = ({
  latitude,
  longitude,
  variant = 'default',
  draggable = false,
  onDrag,
}: LocationMarkerProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary fill-primary';
      case 'destructive':
        return 'text-destructive fill-destructive';
      default:
        return 'text-foreground fill-foreground';
    }
  };

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      draggable={draggable}
      onDrag={onDrag}
      anchor="bottom"
    >
      <div className="relative">
        <MapPin className={`size-10 ${getVariantClasses()} drop-shadow-lg`} />
      </div>
    </Marker>
  );
};

