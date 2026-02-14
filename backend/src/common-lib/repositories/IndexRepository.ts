import { pool } from "../config/database";
import { CreateIndexRequestDTO } from "../dto/index/CreateIndexRequestDTO";
import { GetIndexByHuntRequestDTO } from "../dto/index/GetIndexByHuntRequestDTO";
import { IndexEntity } from "../entity/IndexEntity";

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

        const maxResult = await pool.query(
            `SELECT COALESCE(MAX(index), 0) AS max_index
             FROM index
             WHERE hunt_id = $1`,
            [indexData.hunt_id]
        );

        const nextIndex = maxResult.rows[0].max_index + 1;

        const result = await pool.query(
            "INSERT INTO index (name, index, hunt_id) VALUES ($1, $2, $3) RETURNING *",
            [
                indexData.name,
                nextIndex,
                indexData.hunt_id
            ]
        )

        return result.rows[0];
    }

    async getByHuntID(huntId: string): Promise<IndexEntity[]> {
        const result = await pool.query(
            "SELECT * FROM index WHERE hunt_id = ($1)",
            [huntId]
        )
        return result.rows;
    }
}