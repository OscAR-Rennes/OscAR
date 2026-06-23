export interface CreateHuntDto {
    title: string;
    description: string;
    creator_id: string;
    difficulty_id: string;
    points: number;
    latitude: number;
    longitude: number;
    picture_path?: string | null;
}