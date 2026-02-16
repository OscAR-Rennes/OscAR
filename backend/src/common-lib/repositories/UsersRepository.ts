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
    const result = await pool.query(
      `SELECT 
          u.*,
          COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS rights
      FROM users u
      LEFT JOIN right_user ru ON ru.user_id = u.id
      LEFT JOIN rights r ON r.id = ru.right_id
      WHERE u.email = $1
      GROUP BY u.id`,
      [email]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }
  
  async findById(userId: string): Promise<UserEntity | null> {
    const result = await pool.query(
      `SELECT 
          u.*,
          COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS rights
      FROM users u
      LEFT JOIN right_user ru ON ru.user_id = u.id
      LEFT JOIN rights r ON r.id = ru.right_id
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const user = result.rows[0];
    return user;
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
    await pool.query(
      `
        UPDATE users
        SET "isActive" = FALSE
        WHERE id_cultural_center = $1
      `,
      [centerId]
    );
  }

  async activateManagersByCenter(centerId: string) {
    await pool.query(
      `
        UPDATE users u
        SET "isActive" = TRUE
        FROM right_user ru
        JOIN rights r ON r.id = ru.right_id
        WHERE u.id = ru.user_id
          AND u.id_cultural_center = $1
          AND r.name = $2
      `,
      [centerId, RoleEnum.CULTURAL_CENTER_MANAGER]
    );
  }
}