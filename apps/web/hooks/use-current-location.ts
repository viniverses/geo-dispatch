'use client';

import { toast } from 'sonner';

interface UseCurrentLocationProps {
  onLocationObtained: (lat: number, lng: number) => void;
}

export const useCurrentLocation = ({ onLocationObtained }: UseCurrentLocationProps) => {
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationObtained(lat, lng);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error(
          'Não foi possível obter sua localização. Verifique as permissões do navegador.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { handleGetCurrentLocation };
};
