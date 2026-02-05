import { geometry, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { requestStatusEnum, serviceCategoryEnum } from './enums.ts';
import { timestamps } from './timestamps.ts';

export const requests = pgTable(
  'requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    category: serviceCategoryEnum('category').notNull(),
    status: requestStatusEnum('status').notNull().default('CREATED'),
    dispatchRound: integer('dispatch_round').notNull().default(0),
    pickup: geometry('pickup', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    providerId: uuid('provider_id'),
    notes: text('notes'),
    assignedAt: timestamp('assigned_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    canceledAt: timestamp('canceled_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('requests_user_id_idx').on(t.userId),
    index('requests_provider_id_idx').on(t.providerId),
    index('requests_status_idx').on(t.status),
    index('requests_category_idx').on(t.category),
    index('requests_created_at_idx').on(t.createdAt),
    index('requests_pickup_gist_idx').using('gist', t.pickup),
  ]
);
