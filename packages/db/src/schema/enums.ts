import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CUSTOMER', 'PROVIDER', 'ADMIN']);

export const serviceCategoryEnum = pgEnum('service_category', [
  'TOWING',
  'TAXI',
  'LOCKSMITH',
  'PLUMBER',
  'ELECTRICIAN',
]);

export const requestStatusEnum = pgEnum('request_status', [
  'CREATED',
  'DISPATCHING',
  'ASSIGNED',
  'COMPLETED',
  'CANCELED',
  'FAILED_NO_PROVIDERS',
]);

export const offerStatusEnum = pgEnum('offer_status', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'TAKEN',
  'EXPIRED',
  'CANCELED',
]);
