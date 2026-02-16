import { pool } from "../config/database.js";
import { NewUserRequestDTO } from "../dto/users/NewUserRequestDTO.js";
import { UserEntity } from "../entity/UsersEntity.js";
import bcrypt from "bcrypt";
import { RoleEnum } from "../enum/roleEnum.js";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/prismaClient";


export class UserRepository  {
  
  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.users.findMany();
    return users.map(user => new UserEntity(user));
  }

  async create(
    userData: NewUserRequestDTO,
    prismaClient?: PrismaClient
  ): Promise<UserEntity> {
    const client = prismaClient || prisma;

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userRecord = await client.users.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        id_cultural_center: userData.id_cultural_center,
      },
    });

    await Promise.all(
      userData.rights.map(async name => {
        const right = await prisma.rights.findUnique({ where: { name } });
        if (!right) throw new Error(`Right ${name} not found`);
        await prisma.right_user.create({
          data: {
            user_id: userRecord.id,
            right_id: right.id,
          },
        });
      })
    );
    return new UserEntity(userRecord);
  }

  async findAllByCulturalCenter(culturalcenter_id: string): Promise<UserEntity[]> {
    const users = await prisma.users.findMany({
      where: {
        id_cultural_center: culturalcenter_id,
      },
    });
    return users.map(user => new UserEntity(user));
  }


  //TODO : Create User for mobile (without rights managements and cultural center affiliation)

  async findByCredentials(email: string): Promise<UserEntity | null> {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        right_user: {
          include: { rights: true },
        },
      },
    });

    if (!user) return null;

    const rights = user.right_user.map(ru => ru.rights.name);

    return new UserEntity({ ...user, rights });
  }
  
  async findById(userId: string): Promise<UserEntity | null> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        right_user: { include: { rights: true } },
      },
    });

    if (!user) return null;

    const rights = user.right_user.map(ru => ru.rights.name);

    return new UserEntity({ ...user, rights });
  }

  async switchUsersStatus(ids: string[]): Promise<{ id: string; isActive: boolean }[]> {
    if (ids.length === 0) return [];
    const updatedUsers = await prisma.$queryRaw<
      { id: string; isActive: boolean }[]
    >`
      UPDATE "users"
      SET "isActive" = NOT "isActive"
      WHERE id = ANY(${ids})
      RETURNING id, "isActive";
    `;
    return updatedUsers;
  }

  async deactivateUsersByCenter(centerId: string) {
    await prisma.users.updateMany({
      where: { id_cultural_center: centerId },
      data: { isActive: false },
    });
  }

  async activateManagersByCenter(centerId: string) {
    await prisma.$executeRaw`
      UPDATE "users" u
      SET "isActive" = TRUE
      FROM "right_user" ru
      JOIN "rights" r ON r.id = ru.right_id
      WHERE u.id = ru.user_id
        AND u.id_cultural_center = ${centerId}
        AND r.name = ${RoleEnum.CULTURAL_CENTER_MANAGER};
    `;
  }
}