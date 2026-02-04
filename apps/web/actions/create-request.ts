'use server';

import { z } from 'zod';

import { actionClient } from '@/lib/safe-action';

const createRequestSchema = z.object({
  serviceType: z.string(),
  name: z.string(),
  phone: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  originAddress: z.string().optional(),
  destinationAddress: z.string().optional(),
  observations: z.string().optional(),
});

export const createRequest = actionClient
  .inputSchema(createRequestSchema)
  .action(async ({ parsedInput }) => {
    console.log(parsedInput);
  });
