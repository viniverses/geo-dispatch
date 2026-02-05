import { faker } from '@faker-js/faker';

import { db } from './client.ts';
import { offers, providers, requests, users } from './schema/index.ts';

const STATE_CENTERS: Array<{ lat: number; lng: number; radiusDeg: number }> = [
  { lat: -23.548, lng: -46.636, radiusDeg: 0.08 }, // SP - São Paulo
  { lat: -22.903, lng: -43.17, radiusDeg: 0.06 }, // RJ - Rio de Janeiro
  { lat: -19.916, lng: -43.934, radiusDeg: 0.06 }, // MG - Belo Horizonte
  { lat: -25.428, lng: -49.273, radiusDeg: 0.05 }, // PR - Curitiba
  { lat: -30.034, lng: -51.218, radiusDeg: 0.05 }, // RS - Porto Alegre
  { lat: -27.595, lng: -48.548, radiusDeg: 0.04 }, // SC - Florianópolis
  { lat: -12.971, lng: -38.501, radiusDeg: 0.05 }, // BA - Salvador
  { lat: -8.047, lng: -34.877, radiusDeg: 0.04 }, // PE - Recife
  { lat: -3.717, lng: -38.543, radiusDeg: 0.04 }, // CE - Fortaleza
  { lat: -15.78, lng: -47.929, radiusDeg: 0.04 }, // DF - Brasília
  { lat: -16.686, lng: -49.264, radiusDeg: 0.05 }, // GO - Goiânia
  { lat: -20.315, lng: -40.292, radiusDeg: 0.03 }, // ES - Vitória
  { lat: -5.794, lng: -35.211, radiusDeg: 0.03 }, // RN - Natal
  { lat: -7.119, lng: -34.855, radiusDeg: 0.03 }, // PB - João Pessoa
  { lat: -9.65, lng: -35.71, radiusDeg: 0.03 }, // AL - Maceió
  { lat: -10.947, lng: -37.073, radiusDeg: 0.03 }, // SE - Aracaju
  { lat: -2.529, lng: -44.303, radiusDeg: 0.04 }, // MA - São Luís
  { lat: -5.089, lng: -42.801, radiusDeg: 0.04 }, // PI - Teresina
  { lat: -1.455, lng: -48.502, radiusDeg: 0.04 }, // PA - Belém
  { lat: -3.101, lng: -60.025, radiusDeg: 0.05 }, // AM - Manaus
  { lat: -8.761, lng: -63.904, radiusDeg: 0.04 }, // RO - Porto Velho
  { lat: -15.601, lng: -56.097, radiusDeg: 0.04 }, // MT - Cuiabá
  { lat: -20.469, lng: -54.612, radiusDeg: 0.04 }, // MS - Campo Grande
];

const CATEGORIES = ['TOWING', 'TAXI', 'LOCKSMITH', 'PLUMBER', 'ELECTRICIAN'] as const;

const PROVIDER_COUNT_PER_STATE = 100;

const generateRandomPoint = (center: { lat: number; lng: number; radiusDeg: number }) => {
  const latOffset = faker.number.float({
    min: -center.radiusDeg,
    max: center.radiusDeg,
    fractionDigits: 8,
  });
  const lngOffset = faker.number.float({
    min: -center.radiusDeg,
    max: center.radiusDeg,
    fractionDigits: 8,
  });
  return {
    x: center.lng + lngOffset,
    y: center.lat + latOffset,
  };
};

const BATCH_SIZE = 1000;

const main = async () => {
  faker.seed(42);

  await db.delete(offers);
  await db.delete(requests);
  await db.delete(providers);
  await db.delete(users);

  let totalProviders = 0;

  for (const center of STATE_CENTERS) {
    console.log(`Starting seed for ${center.lat}, ${center.lng}`);
    for (let offset = 0; offset < PROVIDER_COUNT_PER_STATE; offset += BATCH_SIZE) {
      console.log(`Seeding batch ${offset + 1} of ${PROVIDER_COUNT_PER_STATE}`);
      const batchLength = Math.min(BATCH_SIZE, PROVIDER_COUNT_PER_STATE - offset);
      const insertedUsers = await db
        .insert(users)
        .values(
          Array.from({ length: batchLength }, () => ({
            role: 'PROVIDER' as const,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
          }))
        )
        .returning({ id: users.id });

      await db.insert(providers).values(
        insertedUsers.map((u) => ({
          userId: u.id,
          category: faker.helpers.arrayElement(CATEGORIES),
          isAvailable: faker.datatype.boolean(0.6),
          lastSeenAt: faker.date.recent({ days: 1 }),
          location: generateRandomPoint(center),
          rating: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 5 }), {
            probability: 0.8,
          }),
        }))
      );

      totalProviders += insertedUsers.length;
    }
  }

  console.log(
    `Seed concluído: conteúdo apagado e ${totalProviders} prestadores inseridos (${PROVIDER_COUNT_PER_STATE} por estado, ${STATE_CENTERS.length} estados).`
  );
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
