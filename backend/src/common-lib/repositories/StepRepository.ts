import { pool } from "../config/database";
import { CreateStepRequestDTO } from "../dto/step/CreateStepRequestDTO";
import { StepEntity } from "../entity/StepEntity";

export class StepRepository {

    async create (stepData: CreateStepRequestDTO): Promise<StepEntity> {
        const result = await pool.query(
            "INSERT INTO steps (title, description, hunt_id, points, latitude, longitude, index_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
                stepData.title, 
                stepData.description, 
                stepData.hunt_id, 
                stepData.points, 
                stepData.latitude, 
                stepData.longitude, 
                stepData.index_id
            ]
        )
        return result.rows[0];
    }

    async getStepById(stepId: string): Promise<StepEntity> {
        console.log("Retrieving step with ID:", stepId);
        const result = await pool.query(
            "SELECT * FROM steps WHERE id = $1",
            [stepId]
        );
        console.log("Step retrieved:", result.rows[0]);
        return result.rows[0];
    }

    async getStepsByIndexId(indexId: string): Promise<StepEntity[]> {
        const result = await pool.query(
            "SELECT * FROM steps WHERE index_id = $1",
            [indexId]
        );
        return result.rows;
    }

    async delete(stepId: string): Promise<void> {
        await pool.query(
            "DELETE FROM steps WHERE id = $1",
            [stepId]
        );
    }
}