export interface ProgressionItem {
    hunt_id: string;
    isComplete: boolean;
    completed_steps?: number;
    total_steps?: number;
    completed_points?: number;
    total_points?: number;
    total_indexes?: number;
    current_index?: {
        index: number;
    };
};