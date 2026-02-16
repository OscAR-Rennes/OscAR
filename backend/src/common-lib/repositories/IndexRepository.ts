import { pool } from "../config/database";
import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO";
import { IndexEntity } from "../entity/IndexEntity";
import { prisma } from "../config/prismaClient";


export class IndexRepository {

    async createIncrementEmpty(hunt_id: string): Promise<IndexEntity> {

        const maxResult = await pool.query(
            `SELECT COALESCE(MAX(index), 0) AS max_index
             FROM index
             WHERE hunt_id = $1`,
            [hunt_id]
        );

        const nextIndex = maxResult.rows[0].max_index + 1;

        const insertResult = await pool.query(
            `INSERT INTO index (hunt_id, index)
             VALUES ($1, $2)
             RETURNING *`,
            [hunt_id, nextIndex]
        );

        return insertResult.rows[0];
    }

    async create(indexData: CreateIndexRequestDTO): Promise<IndexEntity> {
        const maxResult = await prisma.index.aggregate({
            _max: { index: true },
            where: { hunt_id: indexData.hunt_id },
        });

        const nextIndex = (maxResult._max.index ?? 0) + 1;

        // 2️⃣ Créer le nouvel index
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
}