import type { Coordinates } from './coordinates';

export type ServiceType = 'taxi' | 'guincho' | 'bateria';

export type ServiceProvider = Coordinates & {
  id: string;
  name: string;
  serviceType: ServiceType;
  rating: number;
  distance?: number;
  available: boolean;
};
