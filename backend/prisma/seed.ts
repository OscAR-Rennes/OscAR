import bcrypt from "bcrypt";
import { prisma } from "../src/common-lib/config/prismaClient.js";

const SEED_CONFIG = {
  culturalCenters: 12,
  huntManagersPerCenter: 6,
  huntsPerCenter: 8,
  indexesPerHunt: 4,
  stepsPerIndex: 12,
} as const;

const CITY_PROFILES = {
  Rennes: {
    zipPrefix: "35",
    centerLat: 48.1173,
    centerLng: -1.6778,
  },
  Paris: {
    zipPrefix: "75",
    centerLat: 48.8566,
    centerLng: 2.3522,
  },
} as const;

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
  for (let c = 1; c <= SEED_CONFIG.culturalCenters; c++) {
    const cityName = c <= SEED_CONFIG.culturalCenters / 2 ? "Rennes" : "Paris";
    const cityProfile = CITY_PROFILES[cityName];

    // Keep slight offset so each seeded center has a unique point in the same city.
    const centerLat = cityProfile.centerLat + c * 0.001;
    const centerLng = cityProfile.centerLng + c * 0.001;

    // ADDRESS
    let address = await prisma.address.findFirst({
      where: { zip: `${cityProfile.zipPrefix}${String(c).padStart(3, "0")}`, street_number: `${c}` },
    });
    if (!address) {
      address = await prisma.address.create({
        data: {
          zip: `${cityProfile.zipPrefix}${String(c).padStart(3, "0")}`,
          city: cityName,
          street: `Rue Culturelle ${c}`,
          street_number: `${c}`,
          latitude: centerLat,
          longitude: centerLng,
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
    for (let hm = 1; hm <= SEED_CONFIG.huntManagersPerCenter; hm++) {
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
    for (let h = 1; h <= SEED_CONFIG.huntsPerCenter; h++) {
      let hunt = await prisma.hunts.findFirst({
        where: { title: `Chasse ${h} Centre ${c}`, cultural_center_id: center.id },
      });
      if (!hunt) {
        const creator = huntManagers[Math.floor(Math.random() * huntManagers.length)];
        const difficulty = Object.values(difficulties)[Math.floor(Math.random() * 3)];

        const huntLat = centerLat + h * 0.002;
        const huntLng = centerLng + h * 0.002;

        hunt = await prisma.hunts.create({
          data: {
            title: `Chasse ${h} Centre ${c}`,
            description: `Description chasse ${h} centre ${c}`,
            difficulty_id: difficulty.id,
            isactive: true,
            points: 100 * h,
            latitude: huntLat,
            longitude: huntLng,
            creator_id: creator.id,
            cultural_center_id: center.id,
          },
        });
      }

      const huntLatBase = hunt.latitude;
      const huntLngBase = hunt.longitude;

      // INDEXES
      for (let i = 1; i <= SEED_CONFIG.indexesPerHunt; i++) {
        const indexName = `Index ${String(i).padStart(2, "0")}`;

        let huntIndex = await prisma.index.findFirst({
          where: { name: indexName, hunt_id: hunt.id },
        });

        if (!huntIndex) {
          huntIndex = await prisma.index.create({
            data: { name: indexName, index: i, hunt_id: hunt.id },
          });
        }

        // STEPS
        for (let s = 1; s <= SEED_CONFIG.stepsPerIndex; s++) {
          const stepTitle = `Step ${String(s).padStart(2, "0")}`;
          let step = await prisma.steps.findFirst({
            where: { title: stepTitle, index_id: huntIndex.id },
          });

          if (!step) {
            const stepLat = huntLatBase + i * 0.0008 + s * 0.0002;
            const stepLng = huntLngBase + i * 0.0008 + s * 0.0002;

            await prisma.steps.create({
              data: {
                title: stepTitle,
                description: `Step ${s} description for hunt ${h} center ${c} index ${i}`,
                points: 10 + s,
                hunt_id: hunt.id,
                latitude: stepLat,
                longitude: stepLng,
                index_id: huntIndex.id,
              },
            });
          }
        }
      }
    }
  }

  const totalHunts = SEED_CONFIG.culturalCenters * SEED_CONFIG.huntsPerCenter;
  const totalIndexes = totalHunts * SEED_CONFIG.indexesPerHunt;
  const totalSteps = totalIndexes * SEED_CONFIG.stepsPerIndex;

  console.log("Seed terminé !");
  console.log(`Volumes cibles: ${SEED_CONFIG.culturalCenters} centres, ${totalHunts} hunts, ${totalIndexes} index, ${totalSteps} steps`);
  console.log("Admin: admin@oscar.com / Admin1234!");
  console.log(`Managers centres: ${SEED_CONFIG.culturalCenters} comptes cc_manager_X@oscar.com`);
  console.log(`Hunt managers: ${SEED_CONFIG.culturalCenters * SEED_CONFIG.huntManagersPerCenter} comptes hunt_manager_X_Y@oscar.com`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
