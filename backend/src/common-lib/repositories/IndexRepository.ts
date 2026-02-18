import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { index } from "@prisma/client";


export class IndexRepository {

    async createIncrementEmpty(hunt_id: string): Promise<index> {
            const maxResult = await prisma.index.aggregate({
            _max: { index: true },
            where: { hunt_id },
        });

        const nextIndex = (maxResult._max.index ?? 0) + 1;

        const indexRecord = await prisma.index.create({
            data: {
                hunt_id,
                index: nextIndex,
            },
        });

        return indexRecord;
    }

    async create(indexData: CreateIndexRequestDTO): Promise<index> {
        const maxResult = await prisma.index.aggregate({
            _max: { index: true },
            where: { hunt_id: indexData.hunt_id },
        });

        const nextIndex = (maxResult._max.index ?? 0) + 1;

        const indexRecord = await prisma.index.create({
        data: {
            name: indexData.name,
            index: nextIndex,
            hunt_id: indexData.hunt_id,
        },
        });

        return indexRecord;
    }

    async getByHuntID(huntId: string): Promise<index[]> {
        const indexRecords = await prisma.index.findMany({
            where: { hunt_id: huntId },
        });
        return indexRecords;
    }

    async delete(indexId: string): Promise<void> {
        await prisma.index.delete({
            where: { id: indexId },
        });
    }
}