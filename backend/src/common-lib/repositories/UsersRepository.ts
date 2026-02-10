import { PoolClient } from "pg";
import { pool } from "../config/database.js";
import { NewUserRequestDTO } from "../dto/users/NewUserRequestDTO.js";
import { UserEntity } from "../entity/UsersEntity.js";
import bcrypt from "bcrypt";
import { SwitchStatusUsersRequestDTO } from "../dto/users/SwitchStatusUsersRequestDTO.js";
import { RoleEnum } from "../enum/roleEnum.js";

export class UserRepository  {
  async findAll(): Promise<UserEntity[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  async createWithClient(client: PoolClient, userData: NewUserRequestDTO): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await client.query(
      `INSERT INTO users (email, username, password, id_cultural_center)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username`,
      [userData.email, userData.username, hashedPassword, userData.id_cultural_center]
    );
    const user = result.rows[0];
    const rightsResult = await client.query(
      `SELECT id, name FROM rights WHERE name = ANY($1)`,
      [userData.rights]
    );
    const rightIds = rightsResult.rows.map(r => r.id);
    const insertValues = rightIds
      .map((_, i) => `($1, $${i + 2})`)
      .join(", ");
    await client.query(
      `INSERT INTO right_user (user_id, right_id) VALUES ${insertValues}`,
      [user.id, ...rightIds]
    );
    return user;
  }

  async findAllByCulturalCenter(culturalcenter_id: string): Promise<UserEntity[]> {
    const result = await pool.query(
      `SELECT * FROM users WHERE id_cultural_center = ($1)`,
      [culturalcenter_id]
    );
    return result.rows;
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

  async switchUsersStatus(ids: SwitchStatusUsersRequestDTO): Promise<{ id: string; isActive: boolean }[]> {
    const result = await pool.query(
      `
        UPDATE users
        SET "isActive" = NOT "isActive"
        WHERE id = ANY($1)
        RETURNING id, "isActive"
      `,
      [ids]
    );
    return result.rows;
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