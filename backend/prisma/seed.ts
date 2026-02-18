import bcrypt from "bcrypt";
import { prisma } from "../src/common-lib/config/prismaClient.js";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin1234!", 10);

  // =====================
  // RIGHTS
  // =====================
  const rights: Record<string, any> = {};
  for (const name of ["ADMIN", "CULTURAL_CENTER_MANAGER", "HUNT_MANAGER"]) {
    let right = await prisma.rights.findUnique({ where: { name } });
    if (!right) {
      right = await prisma.rights.create({ data: { name } });
    }
    rights[name] = right;
  }

  // =====================
  // DIFFICULTIES
  // =====================
  const difficulties: Record<string, any> = {};
  for (const [name, multiplicator] of [
    ["easy", 1],
    ["medium", 1.5],
    ["hard", 2],
  ] as const) {
    let diff = await prisma.difficulty.findUnique({ where: { name } });
    if (!diff) {
      diff = await prisma.difficulty.create({ data: { name, multiplicator } });
    }
    difficulties[name] = diff;
  }

  // =====================
  // GLOBAL ADMIN
  // =====================
  let admin = await prisma.users.findUnique({ where: { email: "admin@oscar.com" } });
  if (!admin) {
    admin = await prisma.users.create({
      data: {
        username: "admin",
        firstname: "Global",
        lastname: "Admin",
        email: "admin@oscar.com",
        password: hashedPassword,
        isActive: true,
        isSecure: true,
      },
    });
  }

  // ADMIN RIGHTS
  const adminRight = await prisma.right_user.findUnique({
    where: { user_id_right_id: { user_id: admin.id, right_id: rights.ADMIN.id } },
  });
  if (!adminRight) {
    await prisma.right_user.create({
      data: { user_id: admin.id, right_id: rights.ADMIN.id },
    });
  }

  // =====================
  // CULTURAL CENTERS LOOP
  // =====================
  for (let c = 1; c <= 5; c++) {
    // ADDRESS
    let address = await prisma.address.findFirst({
      where: { zip: `3500${c}`, street_number: `${c}` },
    });
    if (!address) {
      address = await prisma.address.create({
        data: {
          zip: `3500${c}`,
          city: "Rennes",
          street: `Rue Culturelle ${c}`,
          street_number: `${c}`,
          latitude: 48 + c,
          longitude: -1 + c,
        },
      });
    }

    // CULTURAL CENTER
    let center = await prisma.cultural_centers.findUnique({ where: { name: `Centre Culturel ${c}` } });
    if (!center) {
      center = await prisma.cultural_centers.create({
        data: {
          name: `Centre Culturel ${c}`,
          description: `Centre culturel numéro ${c}`,
          isActive: true,
          address_id: address.id,
        },
      });
    }

    // CULTURAL CENTER MANAGER
    let ccManager = await prisma.users.findUnique({ where: { email: `cc_manager_${c}@oscar.com` } });
    if (!ccManager) {
      ccManager = await prisma.users.create({
        data: {
          username: `cc_manager_${c}`,
          firstname: "Manager",
          lastname: `Centre${c}`,
          email: `cc_manager_${c}@oscar.com`,
          password: hashedPassword,
          isActive: true,
          id_cultural_center: center.id,
        },
      });
    }

    const ccRight = await prisma.right_user.findUnique({
      where: { user_id_right_id: { user_id: ccManager.id, right_id: rights.CULTURAL_CENTER_MANAGER.id } },
    });
    if (!ccRight) {
      await prisma.right_user.create({
        data: { user_id: ccManager.id, right_id: rights.CULTURAL_CENTER_MANAGER.id },
      });
    }

    // HUNT MANAGERS
    const huntManagers = [];
    for (let hm = 1; hm <= 3; hm++) {
      let manager = await prisma.users.findUnique({ where: { email: `hunt_manager_${c}_${hm}@oscar.com` } });
      if (!manager) {
        manager = await prisma.users.create({
          data: {
            username: `hunt_manager_${c}_${hm}`,
            firstname: "Hunt",
            lastname: `Manager${c}_${hm}`,
            email: `hunt_manager_${c}_${hm}@oscar.com`,
            password: hashedPassword,
            isActive: true,
            id_cultural_center: center.id,
          },
        });
      }

      const hmRight = await prisma.right_user.findUnique({
        where: { user_id_right_id: { user_id: manager.id, right_id: rights.HUNT_MANAGER.id } },
      });
      if (!hmRight) {
        await prisma.right_user.create({ data: { user_id: manager.id, right_id: rights.HUNT_MANAGER.id } });
      }

      huntManagers.push(manager);
    }

    // HUNTS
    for (let h = 1; h <= 3; h++) {
      let hunt = await prisma.hunts.findFirst({
        where: { title: `Chasse ${h} Centre ${c}`, cultural_center_id: center.id },
      });
      if (!hunt) {
        const creator = huntManagers[Math.floor(Math.random() * huntManagers.length)];
        const difficulty = Object.values(difficulties)[Math.floor(Math.random() * 3)];
        hunt = await prisma.hunts.create({
          data: {
            title: `Chasse ${h} Centre ${c}`,
            description: `Description chasse ${h} centre ${c}`,
            difficulty_id: difficulty.id,
            isactive: true,
            points: 100 * h,
            latitude: 48.1 + h,
            longitude: -1.6 + h,
            creator_id: creator.id,
            cultural_center_id: center.id,
          },
        });
      }

      // INDEX
      let huntIndex = await prisma.index.findFirst({
        where: { name: "Index principal", hunt_id: hunt.id },
      });
      if (!huntIndex) {
        huntIndex = await prisma.index.create({
          data: { name: "Index principal", index: 1, hunt_id: hunt.id },
        });
      }

      // STEPS
      for (let s = 1; s <= 4; s++) {
        let step = await prisma.steps.findFirst({
          where: { title: `Step ${s}`, index_id: huntIndex.id },
        });
        if (!step) {
          await prisma.steps.create({
            data: {
              title: `Step ${s}`,
              description: `Step ${s} description`,
              points: 25 * s,
              hunt_id: hunt.id,
              latitude: 48.11 + s,
              longitude: -1.61 + s,
              index_id: huntIndex.id,
            },
          });
        }
      }
    }
  }

  console.log("Seed terminé !");
  console.log("Admin: admin@oscar.com / Admin1234!");
  console.log("5 Cultural center managers: cc_manager_1@oscar.com → cc_manager_5@oscar.com");
  console.log("15 Hunt managers: hunt_manager_X_Y@oscar.com");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
