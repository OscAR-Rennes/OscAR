import bcrypt from "bcrypt";
import { prisma } from "../src/common-lib/config/prismaClient.js";


async function main() {
  // 1. Rights
  const rightAdmin = await prisma.rights.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const rightUser = await prisma.rights.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  const rightAnimator = await prisma.rights.upsert({
    where: { name: "animator" },
    update: {},
    create: { name: "animator" },
  });

  // 2. Difficulties
  const easy = await prisma.difficulty.upsert({
    where: { name: "Facile" },
    update: {},
    create: { name: "Facile", multiplicator: 1.0 },
  });

  const medium = await prisma.difficulty.upsert({
    where: { name: "Moyen" },
    update: {},
    create: { name: "Moyen", multiplicator: 1.5 },
  });

  const hard = await prisma.difficulty.upsert({
    where: { name: "Difficile" },
    update: {},
    create: { name: "Difficile", multiplicator: 2.0 },
  });

  // 3. Address
  const address = await prisma.address.create({
    data: {
      zip: "75001",
      city: "Paris",
      street: "Rue de Rivoli",
      street_number: "1",
      latitude: 48,
      longitude: 2,
    },
  });

  // 4. Cultural Center
  const center = await prisma.cultural_centers.upsert({
    where: { name: "Centre Culturel Paris" },
    update: {},
    create: {
      name: "Centre Culturel Paris",
      description: "Un centre culturel au cœur de Paris.",
      isActive: true,
      address_id: address.id,
    },
  });

  // 5. Users
  const hashedPassword = await bcrypt.hash("Admin1234!", 10);

  const adminUser = await prisma.users.upsert({
    where: { email: "admin@oscar.com" },
    update: {},
    create: {
      username: "admin",
      firstname: "Admin",
      lastname: "OscAR",
      email: "admin@oscar.com",
      password: hashedPassword,
      isActive: true,
      isSecure: true,
      id_cultural_center: center.id,
    },
  });

  const regularUser = await prisma.users.upsert({
    where: { email: "user@oscar.com" },
    update: {},
    create: {
      username: "user1",
      firstname: "Jean",
      lastname: "Dupont",
      email: "user@oscar.com",
      password: hashedPassword,
      isActive: true,
      age: 25,
    },
  });

  // 6. Assign rights
  await prisma.right_user.upsert({
    where: {
      user_id_right_id: { user_id: adminUser.id, right_id: rightAdmin.id },
    },
    update: {},
    create: { user_id: adminUser.id, right_id: rightAdmin.id },
  });

  await prisma.right_user.upsert({
    where: {
      user_id_right_id: { user_id: regularUser.id, right_id: rightUser.id },
    },
    update: {},
    create: { user_id: regularUser.id, right_id: rightUser.id },
  });

  // 7. Hunt
  const hunt = await prisma.hunts.create({
    data: {
      title: "Chasse au trésor Paris",
      description: "Explorez les secrets de Paris !",
      difficulty_id: easy.id,
      isactive: true,
      points: 100,
      latitude: 48.8566,
      longitude: 2.3522,
      creator_id: adminUser.id,
      cultural_center_id: center.id,
    },
  });

  // 8. Hunt period
  await prisma.hunts_period.create({
    data: {
      beginning: new Date("2025-06-01"),
      ending: new Date("2025-08-31"),
      hunt_id: hunt.id,
    },
  });

  // 9. Index + Steps
  const huntIndex = await prisma.index.create({
    data: {
      name: "Étape principale",
      index: 1,
      hunt_id: hunt.id,
    },
  });

  await prisma.steps.create({
    data: {
      title: "La Tour Eiffel",
      description: "Trouvez le monument emblématique de Paris.",
      points: 50,
      hunt_id: hunt.id,
      latitude: 48.8584,
      longitude: 2.2945,
      index_id: huntIndex.id,
    },
  });

  console.log("Seed terminé avec succès !");
  console.log(`   - Admin : admin@oscar.com / Admin1234!`);
  console.log(`   - User  : user@oscar.com  / Admin1234!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });