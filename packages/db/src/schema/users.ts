import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { userRoleEnum } from './enums.ts';
import { timestamps } from './timestamps.ts';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    role: userRoleEnum('role').notNull(),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    ...timestamps,
  },
  (t) => [index('users_role_idx').on(t.role), index('users_email_idx').on(t.email)]
);
