export interface GetProgressionDTO {
    hunt_id: string;
    isComplete: boolean;
    completed_steps?: number;
    total_steps?: number;
    completed_points?: number;
    total_points?: number;
    total_indexes?: number;
    current_index?: {
        id: string;
        index: number;
        remaining_steps: {
            id: string;
            title: string;
        }[]
    }
}