import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO.js";
import { EditIndexRequestDTO } from "../dto/index/EditIndexRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { Prisma, index } from "@prisma/client";


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

    async edit(indexData: EditIndexRequestDTO): Promise<index> {
        const { id, ...data } = indexData;
        return prisma.index.update({
            where: { id },
            data,
        });
    }

    async getByHuntID(huntId: string): Promise<index[]> {
        const indexRecords = await prisma.index.findMany({
            where: { hunt_id: huntId },
        });
        return indexRecords;
    }

    async delete(indexId: string, tx?: Prisma.TransactionClient): Promise<void> {
        await (tx ?? prisma).index.delete({
            where: { id: indexId },
        });
    }

    async deleteByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<void> {
        await (tx ?? prisma).index.deleteMany({
            where: { hunt_id: huntId },
        });
    }

    async countByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<number> {
        return (tx ?? prisma).index.count({
            where: { hunt_id: huntId },
        });
    }

    async getByIdWithHunt(indexId: string, tx?: Prisma.TransactionClient) {
        return (tx ?? prisma).index.findUnique({
            where: { id: indexId },
            include: {
                hunts: true,
            },
        });
    }
}