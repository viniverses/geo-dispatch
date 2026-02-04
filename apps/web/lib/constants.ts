import type { ServiceType } from '@/lib/types';

export const QUERY_STALE_TIME = 30_000;

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  taxi: 'Táxi',
  guincho: 'Guincho',
  bateria: 'Bateria',
};

export const SERVICE_TYPE_OPTIONS: Array<{ value: ServiceType; label: string }> = [
  { value: 'taxi', label: SERVICE_TYPE_LABELS.taxi },
  { value: 'guincho', label: SERVICE_TYPE_LABELS.guincho },
  { value: 'bateria', label: SERVICE_TYPE_LABELS.bateria },
];

export const SERVICE_TYPES: ServiceType[] = ['taxi', 'guincho', 'bateria'];

