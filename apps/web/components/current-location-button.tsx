'use client';

import { Button } from '@workspace/ui/components/button';
import { Navigation } from 'lucide-react';

interface CurrentLocationButtonProps {
  onGetCurrentLocation: () => void;
  isLoading: boolean;
}

export const CurrentLocationButton = ({
  onGetCurrentLocation,
  isLoading,
}: CurrentLocationButtonProps) => {
  return (
    <div className="absolute top-4 right-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onGetCurrentLocation}
        disabled={isLoading}
        className="bg-background/90 backdrop-blur-sm"
        aria-label="Usar localização atual"
      >
        <Navigation className="size-4 mr-2" />
        {isLoading ? 'Obtendo...' : 'Usar localização atual'}
      </Button>
    </div>
  );
};

