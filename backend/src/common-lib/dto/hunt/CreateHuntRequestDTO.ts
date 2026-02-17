export interface CreateHuntRequestDTO {
    title: string;
    description: string;
    creator_id: string;
    cultural_center_id: string;
    difficulty_id: string;
    points: number;
    latitude: number;
    longitude: number;
    picture_path: string;
}