import bcrypt from "bcrypt";
import { prisma } from "../src/common-lib/config/prismaClient.js";

const SEED_CONFIG = {
  culturalCenters: 50,
  huntManagersPerCenter: 2,
  huntsPerCenter: 4,
  indexesPerHunt: 3,
  stepsPerIndex: 3,
  playersPerCenter: 5,
} as const;

const FRANCE_CITIES = [
  { name: "Paris", zipPrefix: "75", lat: 48.8566, lng: 2.3522 },
  { name: "Marseille", zipPrefix: "13", lat: 43.2965, lng: 5.3698 },
  { name: "Lyon", zipPrefix: "69", lat: 45.764, lng: 4.8357 },
  { name: "Toulouse", zipPrefix: "31", lat: 43.6047, lng: 1.4442 },
  { name: "Nice", zipPrefix: "06", lat: 43.7102, lng: 7.262 },
  { name: "Nantes", zipPrefix: "44", lat: 47.2184, lng: -1.5536 },
  { name: "Montpellier", zipPrefix: "34", lat: 43.6119, lng: 3.8772 },
  { name: "Strasbourg", zipPrefix: "67", lat: 48.5734, lng: 7.7521 },
  { name: "Bordeaux", zipPrefix: "33", lat: 44.8378, lng: -0.5792 },
  { name: "Lille", zipPrefix: "59", lat: 50.6292, lng: 3.0573 },
  { name: "Rennes", zipPrefix: "35", lat: 48.1173, lng: -1.6778 },
  { name: "Reims", zipPrefix: "51", lat: 49.2583, lng: 4.0317 },
  { name: "Le Havre", zipPrefix: "76", lat: 49.4944, lng: 0.1079 },
  { name: "Saint-Etienne", zipPrefix: "42", lat: 45.4397, lng: 4.3872 },
  { name: "Toulon", zipPrefix: "83", lat: 43.1242, lng: 5.928 },
  { name: "Grenoble", zipPrefix: "38", lat: 45.1885, lng: 5.7245 },
  { name: "Dijon", zipPrefix: "21", lat: 47.322, lng: 5.0415 },
  { name: "Angers", zipPrefix: "49", lat: 47.4784, lng: -0.5632 },
  { name: "Nimes", zipPrefix: "30", lat: 43.8367, lng: 4.3601 },
  { name: "Clermont-Ferrand", zipPrefix: "63", lat: 45.7772, lng: 3.087 },
  { name: "Brest", zipPrefix: "29", lat: 48.3904, lng: -4.4861 },
  { name: "Tours", zipPrefix: "37", lat: 47.3941, lng: 0.6848 },
  { name: "Amiens", zipPrefix: "80", lat: 49.8941, lng: 2.2958 },
  { name: "Limoges", zipPrefix: "87", lat: 45.8336, lng: 1.2611 },
  { name: "Perpignan", zipPrefix: "66", lat: 42.6887, lng: 2.8948 },
  { name: "Metz", zipPrefix: "57", lat: 49.1193, lng: 6.1757 },
  { name: "Besancon", zipPrefix: "25", lat: 47.2378, lng: 6.0241 },
  { name: "Orleans", zipPrefix: "45", lat: 47.903, lng: 1.9093 },
  { name: "Mulhouse", zipPrefix: "68", lat: 47.7508, lng: 7.3359 },
  { name: "Ajaccio", zipPrefix: "20", lat: 41.9192, lng: 8.7386 },
] as const;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomOffset(base: number, spread: number): number {
  return base + randomBetween(-spread, spread);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function pickRandomCity() {
  return FRANCE_CITIES[Math.floor(Math.random() * FRANCE_CITIES.length)];
}

function getRandomProgressionDate(daysAgo: number = 30): Date {
  const now = new Date();
  const randomDays = randomInt(0, daysAgo);
  const randomHours = randomInt(0, 23);
  const randomMinutes = randomInt(0, 59);
  
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  date.setHours(randomHours, randomMinutes, 0, 0);
  return date;
}

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin1234!", 10);

  // =====================
  // RIGHTS
  // =====================
  const rights: Record<string, any> = {};
  for (const name of ["USER", "ADMIN", "CULTURAL_CENTER_MANAGER", "HUNT_MANAGER"]) {
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
    const city = pickRandomCity();
    const cityName = city.name;

    // Spread centers around city center so map feels natural and dense where needed.
    const centerLat = randomOffset(city.lat, 0.18);
    const centerLng = randomOffset(city.lng, 0.18);
    const zipSuffix = String(randomInt(1, 999)).padStart(3, "0");

    // ADDRESS
    let address = await prisma.address.findFirst({
      where: { zip: `${city.zipPrefix}${zipSuffix}`, street_number: `${c}` },
    });
    if (!address) {
      address = await prisma.address.create({
        data: {
          zip: `${city.zipPrefix}${zipSuffix}`,
          city: cityName,
          street: `Avenue Culturelle ${c}`,
          street_number: `${c}`,
          latitude: centerLat,
          longitude: centerLng,
        },
      });
    }

    // CULTURAL CENTER
    let center = await prisma.cultural_centers.findUnique({ where: { name: `Centre Culturel ${cityName} ${c}` } });
    if (!center) {
      center = await prisma.cultural_centers.create({
        data: {
          name: `Centre Culturel ${cityName} ${c}`,
          description: `Centre culturel ${cityName} #${c}`,
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

        const huntLat = randomOffset(centerLat, 0.03);
        const huntLng = randomOffset(centerLng, 0.03);

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
            const stepLat = randomOffset(huntLatBase, 0.006);
            const stepLng = randomOffset(huntLngBase, 0.006);

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

    // =====================
    // PLAYERS FOR THIS CENTER
    // =====================
    const players = [];
    for (let p = 1; p <= SEED_CONFIG.playersPerCenter; p++) {
      let player = await prisma.users.findUnique({
        where: { email: `player_${c}_${p}@oscar.com` },
      });
      if (!player) {
        player = await prisma.users.create({
          data: {
            username: `player_${c}_${p}`,
            firstname: `Joueur`,
            lastname: `${c}_${p}`,
            email: `player_${c}_${p}@oscar.com`,
            password: hashedPassword,
            isActive: true,
            id_cultural_center: center.id,
            age: randomInt(18, 65),
            points: 0,
          },
        });
      }

      const playerRight = await prisma.right_user.findUnique({
        where: { user_id_right_id: { user_id: player.id, right_id: rights.USER.id } },
      });
      if (!playerRight) {
        await prisma.right_user.create({
          data: { user_id: player.id, right_id: rights.USER.id },
        });
      }

      players.push(player);
    }

    // =====================
    // PROGRESSIONS FOR PLAYERS
    // =====================
    // Get all hunts for this center
    const centerHunts = await prisma.hunts.findMany({
      where: { cultural_center_id: center.id },
      include: {
        index: {
          include: {
            steps: {
              orderBy: { title: "asc" },
            },
          },
          orderBy: { index: "asc" },
        },
      },
    });

    for (const hunt of centerHunts) {
      // Get all steps for this hunt in order
      const huntSteps = [];
      for (const idx of hunt.index) {
        huntSteps.push(...idx.steps);
      }

      for (const player of players) {
        // Probability: 70% chance player attempts this hunt
        if (Math.random() > 0.7) {
          continue;
        }

        // Probability: 30% chance hunt is incomplete, 70% chance it's complete
        const isComplete = Math.random() > 0.3;
        const stepsToComplete = isComplete ? huntSteps.length : randomInt(1, Math.max(1, huntSteps.length - 1));

        // Create a start date for this hunt
        const huntStartDate = getRandomProgressionDate(60);
        const progressionWindowMinutes = randomInt(Math.max(stepsToComplete * 2, 5), Math.max(stepsToComplete * 30, 10));
        const minutesPerStep = Math.max(1, Math.floor(progressionWindowMinutes / Math.max(1, stepsToComplete - 1)));
        let currentProgressionStart = new Date(huntStartDate);

        // For each step the player completes
        for (let stepIndex = 0; stepIndex < stepsToComplete; stepIndex++) {
          const step = huntSteps[stepIndex];

          // Check if progression already exists
          const existingProgression = await prisma.progression.findFirst({
            where: {
              user_id: player.id,
              hunt_id: hunt.id,
              step_id: step.id,
            },
          });

          if (!existingProgression) {
            const stepCreatedAt = new Date(currentProgressionStart);
            const stepUpdatedAt = new Date(stepCreatedAt);

            if (isComplete || stepIndex < stepsToComplete - 1) {
              stepUpdatedAt.setMinutes(stepUpdatedAt.getMinutes() + minutesPerStep);
              stepUpdatedAt.setSeconds(stepUpdatedAt.getSeconds() + randomInt(10, 55));
            }

            await prisma.progression.create({
              data: {
                user_id: player.id,
                hunt_id: hunt.id,
                step_id: step.id,
                created_at: stepCreatedAt,
                updated_at: stepUpdatedAt,
              },
            });

            currentProgressionStart = new Date(stepUpdatedAt);
            currentProgressionStart.setMinutes(currentProgressionStart.getMinutes() + randomInt(1, 8));
          }
        }
      }
    }
  }

  const totalHunts = SEED_CONFIG.culturalCenters * SEED_CONFIG.huntsPerCenter;
  const totalIndexes = totalHunts * SEED_CONFIG.indexesPerHunt;
  const totalSteps = totalIndexes * SEED_CONFIG.stepsPerIndex;
  const totalPlayers = SEED_CONFIG.culturalCenters * SEED_CONFIG.playersPerCenter;

  console.log("Seed terminé !");
  console.log(`Volumes cibles: ${SEED_CONFIG.culturalCenters} centres, ${totalHunts} hunts, ${totalIndexes} index, ${totalSteps} steps`);
  console.log("Admin: admin@oscar.com / Admin1234!");
  console.log(`Managers centres: ${SEED_CONFIG.culturalCenters} comptes cc_manager_X@oscar.com`);
  console.log(`Hunt managers: ${SEED_CONFIG.culturalCenters * SEED_CONFIG.huntManagersPerCenter} comptes hunt_manager_X_Y@oscar.com`);
  console.log(`Joueurs: ${totalPlayers} comptes player_X_Y@oscar.com`);
  console.log(`Les données incluent des progressions partielles et complètes avec dates variées pour les dashboards.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
