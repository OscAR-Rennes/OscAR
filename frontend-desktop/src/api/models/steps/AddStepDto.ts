export interface CreateStepDto {
    title: string;
    description: string;
    hunt_id: string;
    points: number;
    latitude: number;
    longitude: number;
    index_id?: string;
}