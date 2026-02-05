import { index, pgTable, timestamp, uniqueIndex,uuid } from 'drizzle-orm/pg-core';

import { offerStatusEnum } from './enums.ts';
import { timestamps } from './timestamps.ts';

export const offers = pgTable(
  'offers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    requestId: uuid('request_id').notNull(),
    providerId: uuid('provider_id').notNull(),
    status: offerStatusEnum('status').notNull().default('PENDING'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    rejectedAt: timestamp('rejected_at', { withTimezone: true }),
    expiredAt: timestamp('expired_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('offers_request_id_idx').on(t.requestId),
    index('offers_provider_id_idx').on(t.providerId),
    index('offers_status_idx').on(t.status),
    index('offers_expires_at_idx').on(t.expiresAt),
    uniqueIndex('offers_request_provider_unique').on(t.requestId, t.providerId),
  ]
);
