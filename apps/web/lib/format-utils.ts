export const formatDistance = (distance: number | null | undefined): string => {
  if (distance == null) {
    return '';
  }
  return `${distance.toFixed(1)} km`;
};

export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

