export interface MapboxDirectionsResponse {
  code: string;
  routes: MapboxDirectionsRoute[];
  waypoints?: MapboxDirectionsWaypoint[];
}

export interface MapboxDirectionsRoute {
  geometry: {
    coordinates: [number, number][];
  };
  distance: number;
  duration: number;
}

export interface MapboxDirectionsWaypoint {
  name: string;
  location: [number, number];
}

export interface MapboxGeocodingResponse {
  type?: string;
  features: MapboxGeocodingFeature[];
}

export interface MapboxGeocodingFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number];
}
