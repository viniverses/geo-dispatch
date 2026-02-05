import { boolean, geometry, index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { serviceCategoryEnum } from './enums.ts';
import { timestamps } from './timestamps.ts';

export const providers = pgTable(
  'providers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    category: serviceCategoryEnum('category').notNull(),
    isAvailable: boolean('is_available').notNull().default(false),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }),
    rating: integer('rating'),
    ...timestamps,
  },
  (t) => [
    index('providers_user_id_idx').on(t.userId),
    index('providers_category_idx').on(t.category),
    index('providers_is_available_idx').on(t.isAvailable),
    index('providers_last_seen_at_idx').on(t.lastSeenAt),
    index('providers_location_gist_idx').using('gist', t.location),
  ]
);
