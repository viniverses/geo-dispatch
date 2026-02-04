'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';
import { Textarea } from '@workspace/ui/components/textarea';
import { useEffect, useRef, useState } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';

import { AddressAutocomplete } from '@/components/address-autocomplete';
import { SERVICE_TYPE_LABELS, SERVICE_TYPE_OPTIONS } from '@/constants';
import { useDestination } from '@/contexts/destination-context';
import { useLocation } from '@/contexts/location-context';
import { useProviders } from '@/contexts/providers-context';
import type { AddressSuggestion } from '@/hooks/use-address-autocomplete';
import { useLongPress } from '@/hooks/use-long-press';
import { useReverseGeocode } from '@/hooks/use-reverse-geocode';
import type { ServiceType } from '@/types';
import { formatCoordinates } from '@/utils/geolocation';

import { type ServiceRequestFormData, serviceRequestSchema } from './schema';

export type { ServiceRequestFormData } from './schema';

interface ServiceRequestFormProps {
  onSubmit: (data: ServiceRequestFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

const ServiceRequestForm = ({ onSubmit, isSubmitting = false }: ServiceRequestFormProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<ServiceRequestFormData | null>(null);
  const [isHoldingConfirm, setIsHoldingConfirm] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { latitude, longitude, setLocation } = useLocation();
  const { fetchProviders } = useProviders();
  const { setDestination, clearDestination } = useDestination();

  const { handleSubmit, control, setValue, watch } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: 'taxi',
      originAddress: '',
      destinationAddress: '',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      latitude: undefined,
      longitude: undefined,
      observations: 'Por favor, chegue o mais rápido possível.',
    },
  });

  const watchedServiceType = watch('serviceType');
  const watchedOriginAddress = watch('originAddress');

  const latitudeController = useController({ name: 'latitude', control });
  const longitudeController = useController({ name: 'longitude', control });
  const lastAutoOriginRef = useRef<string | null>(null);

  const { address: reverseGeocodedOrigin } = useReverseGeocode({
    latitude,
    longitude,
    enabled: latitude != null && longitude != null,
  });

  useEffect(() => {
    if (latitude && longitude) {
      setValue('latitude', latitude);
      setValue('longitude', longitude);
    }
  }, [latitude, longitude, setValue]);

  useEffect(() => {
    const normalizedAddress = reverseGeocodedOrigin?.trim();
    if (!normalizedAddress) return;

    const currentAddress = watchedOriginAddress?.trim() ?? '';
    if (!currentAddress || currentAddress === lastAutoOriginRef.current) {
      setValue('originAddress', normalizedAddress, { shouldValidate: true });
      lastAutoOriginRef.current = normalizedAddress;
    }
  }, [reverseGeocodedOrigin, watchedOriginAddress, setValue]);

  useEffect(() => {
    if (watchedServiceType && latitude && longitude) {
      fetchProviders(watchedServiceType as ServiceType, { latitude, longitude });
    }
  }, [watchedServiceType, latitude, longitude, fetchProviders]);

  useEffect(() => {
    if (watchedServiceType === 'bateria') {
      setValue('destinationAddress', '');
      clearDestination();
    }
  }, [watchedServiceType, setValue, clearDestination]);

  const onValidSubmit = (data: ServiceRequestFormData) => {
    setPendingSubmitData(data);
    setConfirmOpen(true);
  };

  const handleConfirmLongPress = async () => {
    if (isSubmitting || isConfirming) return;
    if (!pendingSubmitData) return;
    setIsConfirming(true);
    try {
      await onSubmit(pendingSubmitData);
    } finally {
      setIsConfirming(false);
    }
  };

  const confirmLongPressHandlers = useLongPress(handleConfirmLongPress, {
    threshold: 3000,
    onStart: () => {
      if (isSubmitting || isConfirming) return;
      if (!pendingSubmitData) return;

      setIsHoldingConfirm(true);
    },
    onCancel: () => {
      setIsHoldingConfirm(false);
    },
    onFinish: () => {
      setConfirmOpen(false);
      setIsHoldingConfirm(false);
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
        <FieldGroup className="gap-y-3 gap-x-4">
          <Controller
            name="serviceType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${field.name}-taxi`}>Tipo de serviço</FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-label="Tipo de serviço"
                  aria-invalid={fieldState.invalid ? 'true' : 'false'}
                  className="grid grid-cols-1 gap-2 @md/field-group:grid-cols-3"
                >
                  {SERVICE_TYPE_OPTIONS.map((option) => {
                    const isSelected = field.value === option.value;
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`${field.name}-${option.value}`}
                        data-state={isSelected ? 'checked' : 'unchecked'}
                        className="flex items-center gap-3 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-muted/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                      >
                        <RadioGroupItem
                          id={`${field.name}-${option.value}`}
                          value={option.value}
                          aria-label={option.label}
                        />
                        <span>{option.label}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="originAddress"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={
                  fieldState.invalid ||
                  latitudeController.fieldState.invalid ||
                  longitudeController.fieldState.invalid
                }
              >
                <FieldLabel htmlFor={field.name}>Local de origem</FieldLabel>
                <AddressAutocomplete
                  id={field.name}
                  label=""
                  placeholder="Digite o local de origem"
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value)}
                  onSelect={(suggestion) => {
                    field.onChange(suggestion.address);
                    setLocation(suggestion.latitude, suggestion.longitude);
                    setValue('latitude', suggestion.latitude, { shouldValidate: true });
                    setValue('longitude', suggestion.longitude, { shouldValidate: true });
                    lastAutoOriginRef.current = suggestion.address;
                  }}
                  aria-invalid={fieldState.invalid ? 'true' : 'false'}
                  aria-label="Local de origem"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                {(latitudeController.fieldState.invalid ||
                  longitudeController.fieldState.invalid) && (
                  <FieldError
                    errors={[
                      latitudeController.fieldState.error,
                      longitudeController.fieldState.error,
                    ]}
                  />
                )}
              </Field>
            )}
          />

          {watchedServiceType !== 'bateria' && (
            <Controller
              name="destinationAddress"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Local de destino</FieldLabel>
                  <AddressAutocomplete
                    id={field.name}
                    label=""
                    placeholder="Digite o local de destino"
                    value={field.value || ''}
                    onChange={(value) => {
                      field.onChange(value);
                      if (!value) {
                        clearDestination();
                      }
                    }}
                    onSelect={(suggestion: AddressSuggestion) => {
                      field.onChange(suggestion.address);
                      setDestination({
                        latitude: suggestion.latitude,
                        longitude: suggestion.longitude,
                        address: suggestion.address,
                      });
                    }}
                    aria-invalid={fieldState.invalid ? 'true' : 'false'}
                    aria-label="Local de destino"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Nome Completo <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Digite seu nome completo"
                  aria-invalid={fieldState.invalid}
                  aria-label="Nome completo"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Telefone <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  aria-invalid={fieldState.invalid}
                  aria-label="Telefone"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="observations"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>OBS</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Digite observações (opcional)"
                  className="min-h-[100px]"
                  aria-invalid={fieldState.invalid}
                  aria-label="OBS"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <input
          type="hidden"
          {...latitudeController.field}
          value={latitudeController.field.value ?? ''}
        />
        <input
          type="hidden"
          {...longitudeController.field}
          value={longitudeController.field.value ?? ''}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-label="Enviar solicitação de serviço"
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar Serviço'}
        </Button>
      </form>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) {
            setPendingSubmitData(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              Confira os dados abaixo. Para confirmar, clique e segure por 3 segundos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingSubmitData && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-muted-foreground">Origem</div>
                <div className="col-span-2 font-medium">
                  {pendingSubmitData.originAddress?.trim()
                    ? pendingSubmitData.originAddress
                    : formatCoordinates(pendingSubmitData.latitude, pendingSubmitData.longitude)}
                </div>
              </div>
              {pendingSubmitData.serviceType !== 'bateria' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-muted-foreground">Destino</div>
                  <div className="col-span-2 font-medium">
                    {pendingSubmitData.destinationAddress}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-muted-foreground">Serviço</div>
                <div className="col-span-2 font-medium">
                  {SERVICE_TYPE_LABELS[pendingSubmitData.serviceType as ServiceType]}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-muted-foreground">Nome</div>
                <div className="col-span-2 font-medium">{pendingSubmitData.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-muted-foreground">Telefone</div>
                <div className="col-span-2 font-medium">{pendingSubmitData.phone}</div>
              </div>
              {!!pendingSubmitData.observations && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-muted-foreground">OBS</div>
                  <div className="col-span-2 font-medium">{pendingSubmitData.observations}</div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting || isConfirming}>Cancelar</AlertDialogCancel>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                disabled={isSubmitting || isConfirming || !pendingSubmitData}
                {...confirmLongPressHandlers}
                aria-label="Clique e segure por 3 segundos para confirmar"
                className="relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isConfirming ? 'Confirmando...' : 'Confirmar (segure 3s)'}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 z-0 w-full origin-left bg-white/25 transition-transform duration-3000 ease-linear dark:bg-black/20"
                  style={{ transform: `scaleX(${isHoldingConfirm ? 1 : 0})` }}
                />
              </Button>
              <p className="text-muted-foreground text-xs">
                Solte antes de 3s para cancelar a confirmação.
              </p>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceRequestForm;
