import { pool } from "../config/database";
import { CreateHuntRequestDTO } from "../dto/hunt/CreateHuntRequestDTO";
import { EditHuntRequestDTO } from "../dto/hunt/EditHuntRequestDTO";
import { HuntEntity } from "../entity/HuntEntity";

export class HuntRepository {

    async create (huntData: CreateHuntRequestDTO): Promise<HuntEntity> {
        const result = await pool.query(
            "INSERT INTO hunts (title, description, creator_id, difficulty_id, points, latitude, longitude, picture_path, cultural_center_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
                huntData.title,
                huntData.description,
                huntData.creator_id,
                huntData.difficulty_id,
                huntData.points,
                huntData.latitude,
                huntData.longitude,
                huntData.picture_path || null,
                huntData.cultural_center_id
            ]
        )
        return result.rows[0];
    }

    async getAll(): Promise<HuntEntity[]> {
        const result = await pool.query("SELECT * FROM hunts")
        return result.rows
    }

    async edit(huntData: EditHuntRequestDTO, userId: string, userRights: string[]): Promise<HuntEntity> {
        const result = await pool.query("") 
        return result.rows[0]
    }   

    async getByID(id: string): Promise<HuntEntity | null> {
        const result = await pool.query("SELECT * FROM hunts WHERE id = $1", [id])
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
}