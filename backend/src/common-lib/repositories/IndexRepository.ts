import { pool } from "../config/database.js";
import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO.js";
import { IndexEntity } from "../entity/IndexEntity.js";
import { prisma } from "../config/prismaClient.js";


export class IndexRepository {

    async createIncrementEmpty(hunt_id: string): Promise<IndexEntity> {
        // 1️⃣ Récupérer le max index
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

        return new IndexEntity(indexRecord);
    }

    async create(indexData: CreateIndexRequestDTO): Promise<IndexEntity> {
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

        return new IndexEntity(indexRecord);
    }

    async getByHuntID(huntId: string): Promise<IndexEntity[]> {
        const result = await pool.query(
            "SELECT * FROM index WHERE hunt_id = ($1)",
            [huntId]
        )
        return result.rows;
    }

    async getById(indexId: string): Promise<IndexEntity> {
        const result = await pool.query(
            "SELECT * FROM index WHERE id = ($1)",
            [indexId]
        )
        return result.rows[0];
    }

    async delete(indexId: string): Promise<void> {
        await pool.query(
            "DELETE FROM index WHERE id = ($1)",
            [indexId]
        )
    }
}