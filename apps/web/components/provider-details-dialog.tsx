'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Separator } from '@workspace/ui/components/separator';
import { Battery, Car, Truck } from 'lucide-react';
import { useMemo } from 'react';

import { SERVICE_TYPE_LABELS } from '@/constants';
import type { ServiceProvider } from '@/contexts/providers-context';
import { formatDistance } from '@/utils/geolocation';

const ICONS = {
  taxi: Car,
  guincho: Truck,
  bateria: Battery,
};

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function estimatePrice(provider: ServiceProvider) {
  const km = provider.distance ?? null;

  if (provider.serviceType === 'taxi') {
    const base = 8;
    const perKm = 3.5;
    const estimate = km == null ? null : Math.max(15, base + km * perKm);
    return {
      label: 'Estimativa',
      value: estimate,
      details: `Base ${formatBRL(base)} + ${formatBRL(perKm)}/km`,
    };
  }

  if (provider.serviceType === 'guincho') {
    const base = 120;
    const perKm = 8;
    const estimate = km == null ? null : base + km * perKm;
    return {
      label: 'Estimativa',
      value: estimate,
      details: `Saida ${formatBRL(base)} + ${formatBRL(perKm)}/km`,
    };
  }

  const flat = 180;
  return { label: 'Servico', value: flat, details: 'Troca/recarga sob disponibilidade' };
}

export function ProviderDetailsDialog({
  provider,
  open,
  onOpenChange,
}: {
  provider: ServiceProvider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = provider ? ICONS[provider.serviceType] : null;

  const price = useMemo(() => {
    if (!provider) return null;
    return estimatePrice(provider);
  }, [provider]);

  const isOpen = open && !!provider;

  if (!provider) {
    return <Dialog open={false} onOpenChange={onOpenChange} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="size-5 text-primary" />}
            {provider.name}
          </DialogTitle>
          <DialogDescription>
            {SERVICE_TYPE_LABELS[provider.serviceType]} • ⭐ {provider.rating}
            {formatDistance(provider.distance) ? ` • ${formatDistance(provider.distance)}` : ''}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-muted-foreground">Disponibilidade</div>
            <div className="col-span-2 font-medium">
              {provider.available ? 'Disponivel' : 'Indisponivel'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-muted-foreground">Latitude</div>
            <div className="col-span-2 font-medium tabular-nums">{provider.latitude}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-muted-foreground">Longitude</div>
            <div className="col-span-2 font-medium tabular-nums">{provider.longitude}</div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-2">
          <div className="text-sm font-medium">Valores</div>
          <div className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">{price?.label}</div>
              <div className="text-sm font-semibold tabular-nums">
                {price?.value == null ? 'Sob consulta' : formatBRL(price.value)}
              </div>
            </div>
            {price?.details && (
              <div className="text-muted-foreground mt-1 text-xs">{price.details}</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
