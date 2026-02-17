import { CreateCulturalCenterRequestDTO } from "../dto/culturalcenter/CreateCulturalCenterRequestDTO.js";
import { CulturalCenterEntity } from "../entity/CulturalCenterEntity.js";
import { prisma } from "../config/prismaClient.js";
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
        const centers = await prisma.cultural_centers.findMany({
        where: { isActive: true },
        });
        return centers.map(c => new CulturalCenterEntity(c));
    }

    async getAll(): Promise<CulturalCenterEntity[]> {
        const centers = await prisma.cultural_centers.findMany();
        return centers.map(c => new CulturalCenterEntity(c));
    }


    async switchCulturalCenterStatus(ids: string[]): Promise<{ id: string; isActive: boolean }[]> {
        if (ids.length === 0) return [];

        const updatedCenters = await prisma.$queryRaw<
        { id: string; isActive: boolean }[]
        >`
        UPDATE "cultural_centers"
        SET "isActive" = NOT "isActive"
        WHERE id = ANY(${ids})
        RETURNING id, "isActive";
        `;
        return updatedCenters;
    }
}