export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isValidLatitude = (latitude: number): boolean => {
  return latitude >= -90 && latitude <= 90;
};

export const isValidLongitude = (longitude: number): boolean => {
  return longitude >= -180 && longitude <= 180;
};

export const isValidCoordinates = (latitude: number, longitude: number): boolean => {
  return isValidLatitude(latitude) && isValidLongitude(longitude);
};

export const areCoordinatesValid = (
  latitude: number | null,
  longitude: number | null
): boolean => {
  return latitude != null && longitude != null && isValidCoordinates(latitude, longitude);
};

