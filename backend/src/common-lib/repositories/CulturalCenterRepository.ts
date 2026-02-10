import { PoolClient } from "pg";
import { pool } from "../config/database.js";
import { CreateCulturalCenterRequestDTO } from "../dto/culturalcenter/CreateCulturalCenterRequestDTO.js";
import { CulturalCenterEntity } from "../entity/CulturalCenterEntity.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";

export class CulturalCenterRepository  {
    async createWithClient(client: PoolClient, culturalCenterData: CreateCulturalCenterRequestDTO): Promise<CulturalCenterEntity> {
        console.log(culturalCenterData)
        const result = await client.query(
        "INSERT INTO cultural_centers (name, description, address_id, picture_path) VALUES ($1, $2, $3, $4) RETURNING *",
        [culturalCenterData.name, culturalCenterData.description, culturalCenterData.address_id, culturalCenterData.picture_path]
        );
        return result.rows[0];
    }

    async getAllActive(): Promise<CulturalCenterEntity[]> {
        const result = await pool.query('SELECT * FROM cultural_centers WHERE "isActive" = TRUE');
        return result.rows;
    }

    async getAll(): Promise<CulturalCenterEntity[]> {
        const result = await pool.query(`SELECT * FROM cultural_centers`)
        return result.rows
    }

    async switchCulturalCenterStatus(ids: SwitchStatusCulturalCenterRequestDTO) {
        const result = await pool.query(
            `
            UPDATE cultural_centers
            SET "isActive" = NOT "isActive"
            WHERE id = ANY($1)
            RETURNING id, "isActive"
            `,
            [ids]
        );

        return result.rows;
    }
}