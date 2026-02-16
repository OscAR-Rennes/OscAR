import { pool } from "../config/database.js";
import { CreateCulturalCenterRequestDTO } from "../dto/culturalcenter/CreateCulturalCenterRequestDTO.js";
import { CulturalCenterEntity } from "../entity/CulturalCenterEntity.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";
import { prisma } from "../config/prismaClient";
import { PrismaClient } from "@prisma/client";


export class CulturalCenterRepository  {

    async create(
        data: CreateCulturalCenterRequestDTO,
        prismaClient?: PrismaClient
    ): Promise<CulturalCenterEntity> {
        const client = prismaClient || prisma;
        const formattedData = {
            name: data.name,
            description: data.description,
            address_id: data.address_id,
            picture_path: data.picture_path ?? null,
        };
        const culturalCenterRecord = await client.cultural_centers.create({ data: formattedData });
        return new CulturalCenterEntity(culturalCenterRecord);
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