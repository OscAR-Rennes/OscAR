export interface GetProgressionDTO {
    hunt_id: string;
    isComplete: boolean;
    current_index?: {
        id: string;
        index: number;
        remaining_steps: {
            id: string;
            title: string;
        }[]
    }
}