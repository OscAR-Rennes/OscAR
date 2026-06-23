import { CreateCulturalCenterRequestDTO } from "../dto/culturalcenter/CreateCulturalCenterRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { cultural_centers } from "@prisma/client";

export interface CulturalCenterMapFilters {
    search?: string;
    minLat?: number;
    maxLat?: number;
    minLng?: number;
    maxLng?: number;
}


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

    async getAllActiveForMap(filters: CulturalCenterMapFilters) {
        const hasLatBounds = Number.isFinite(filters.minLat) && Number.isFinite(filters.maxLat);
        const hasLngBounds = Number.isFinite(filters.minLng) && Number.isFinite(filters.maxLng);

        return prisma.cultural_centers.findMany({
            where: {
                isActive: true,
                ...(filters.search
                    ? {
                        name: {
                            contains: filters.search,
                            mode: "insensitive",
                        },
                    }
                    : {}),
                ...(hasLatBounds && hasLngBounds
                    ? {
                        address: {
                            latitude: {
                                gte: filters.minLat,
                                lte: filters.maxLat,
                            },
                            longitude: {
                                gte: filters.minLng,
                                lte: filters.maxLng,
                            },
                        },
                    }
                    : {}),
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                description: true,
                picture_path: true,
                address: {
                    select: {
                        latitude: true,
                        longitude: true,
                    },
                },
            },
        });
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

    async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
        await (tx ?? prisma).cultural_centers.delete({
            where: { id },
        });
    }

    async getById(id: string, tx?: Prisma.TransactionClient): Promise<cultural_centers | null> {
        const center = await (tx ?? prisma).cultural_centers.findUnique({
            where: { id },
            include: {
                address: {
                    select: {
                        longitude: true,
                        latitude: true,
                    }
                }
            }
        })
        return center
    }
}