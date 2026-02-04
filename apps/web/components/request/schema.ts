import { z } from 'zod';

import { SERVICE_TYPES } from '@/constants';

export const serviceRequestSchema = z
  .object({
    serviceType: z.enum(SERVICE_TYPES as [string, ...string[]], {
      required_error: 'Selecione um tipo de serviço',
    }),
    originAddress: z
      .string()
      .max(200, 'Local de origem deve ter no máximo 200 caracteres')
      .optional()
      .or(z.literal('')),
    destinationAddress: z
      .string()
      .max(200, 'Local de destino deve ter no máximo 200 caracteres')
      .optional()
      .or(z.literal('')),
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    phone: z
      .string()
      .min(10, 'Telefone inválido')
      .regex(/^[\d\s()\-+]+$/, 'Telefone deve conter apenas números e caracteres especiais'),
    observations: z
      .string()
      .max(500, 'Observações devem ter no máximo 500 caracteres')
      .optional()
      .or(z.literal('')),
    latitude: z
      .number({
        required_error: 'Localização é obrigatória',
      })
      .min(-90, 'Latitude inválida')
      .max(90, 'Latitude inválida'),
    longitude: z
      .number({
        required_error: 'Localização é obrigatória',
      })
      .min(-180, 'Longitude inválida')
      .max(180, 'Longitude inválida'),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType !== 'bateria' && !data.destinationAddress?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Local de destino é obrigatório para Taxi/Guincho',
        path: ['destinationAddress'],
      });
    }
  });

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;
