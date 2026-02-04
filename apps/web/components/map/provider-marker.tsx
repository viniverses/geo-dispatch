'use client';

import { Battery, Car, Truck } from 'lucide-react';
import { Marker } from 'react-map-gl/mapbox';

import { ServiceProvider } from '@/contexts/providers-context';
import { formatDistance } from '@/utils/geolocation';

interface ProviderMarkerProps {
  provider: ServiceProvider;
  onClick?: (provider: ServiceProvider) => void;
}

const ICON_COMPONENTS: Record<ServiceProvider['serviceType'], React.ElementType> = {
  taxi: Car,
  guincho: Truck,
  bateria: Battery,
};

export const ProviderMarker = ({ provider, onClick }: ProviderMarkerProps) => {
  const IconComponent = ICON_COMPONENTS[provider.serviceType];

  return (
    <Marker longitude={provider.longitude} latitude={provider.latitude} anchor="bottom">
      <div className="relative group">
        <button
          type="button"
          className="bg-background border-2 border-primary rounded-full p-1.5 shadow-lg cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Prevent Mapbox map click handler from firing when clicking the marker.
            e.nativeEvent.stopImmediatePropagation();
            onClick?.(provider);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          aria-label={`Abrir detalhes do prestador ${provider.name}`}
        >
          <IconComponent className="size-6 text-primary" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-background border border-border rounded-md px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="text-sm font-medium">{provider.name}</p>
            <p className="text-xs text-muted-foreground">
              ⭐ {provider.rating} • {formatDistance(provider.distance)}
            </p>
          </div>
        </div>
      </div>
    </Marker>
  );
};
