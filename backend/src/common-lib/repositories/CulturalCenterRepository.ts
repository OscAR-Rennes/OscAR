import { CreateCulturalCenterRequestDTO } from "../dto/culturalcenter/CreateCulturalCenterRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { PrismaClient } from "@prisma/client";
import { cultural_centers } from "@prisma/client";


export class CulturalCenterRepository  {

    async create(
        data: CreateCulturalCenterRequestDTO,
        prismaClient?: PrismaClient
    ): Promise<cultural_centers> {
        const client = prismaClient || prisma;
        const formattedData = {
            name: data.name,
            description: data.description,
            address_id: data.address_id,
            picture_path: data.picture_path ?? null,
        };
        const culturalCenterRecord = await client.cultural_centers.create({ data: formattedData });
        return culturalCenterRecord;
    }

     async getAllActive(): Promise<cultural_centers[]> {
        const centers = await prisma.cultural_centers.findMany({
        where: { isActive: true },
        include: {
            address: {
                select: {
                    longitude: true,
                    latitude: true,
                }
            }
        }
        });
        return centers;
    }

    async getAll(): Promise<cultural_centers[]> {
        const centers = await prisma.cultural_centers.findMany();
        return centers;
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