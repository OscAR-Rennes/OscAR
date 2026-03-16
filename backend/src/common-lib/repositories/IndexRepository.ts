import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO.js";
import { prisma } from "../config/prismaClient.js";
import { Prisma, index } from "@prisma/client";


export class IndexRepository {

    private getDb(tx?: Prisma.TransactionClient) {
        return tx ?? prisma;
    }

    async createIncrementEmpty(hunt_id: string, tx?: Prisma.TransactionClient): Promise<index> {
            const maxResult = await this.getDb(tx).index.aggregate({
            _max: { index: true },
            where: { hunt_id },
        });

        const nextIndex = (maxResult._max.index ?? 0) + 1;

        const indexRecord = await this.getDb(tx).index.create({
            data: {
                hunt_id,
                index: nextIndex,
            },
        });

        return indexRecord;
    }

    async create(indexData: CreateIndexRequestDTO, tx?: Prisma.TransactionClient): Promise<index> {
        const maxResult = await this.getDb(tx).index.aggregate({
            _max: { index: true },
            where: { hunt_id: indexData.hunt_id },
        });

        const nextIndex = (maxResult._max.index ?? 0) + 1;

        const indexRecord = await this.getDb(tx).index.create({
        data: {
            name: indexData.name,
            index: nextIndex,
            hunt_id: indexData.hunt_id,
        },
        });

        return indexRecord;
    }

    async getByHuntID(huntId: string, tx?: Prisma.TransactionClient): Promise<index[]> {
        const indexRecords = await this.getDb(tx).index.findMany({
            where: { hunt_id: huntId },
        });
        return indexRecords;
    }

    async delete(indexId: string, tx?: Prisma.TransactionClient): Promise<void> {
        await this.getDb(tx).index.delete({
            where: { id: indexId },
        });
    }

    async deleteByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<void> {
        await this.getDb(tx).index.deleteMany({
            where: { hunt_id: huntId },
        });
    }

    async countByHuntId(huntId: string, tx?: Prisma.TransactionClient): Promise<number> {
        return this.getDb(tx).index.count({
            where: { hunt_id: huntId },
        });
    }

    async getByIdWithHunt(indexId: string, tx?: Prisma.TransactionClient) {
        return this.getDb(tx).index.findUnique({
            where: { id: indexId },
            include: {
                hunts: true,
            },
        });
    }
}