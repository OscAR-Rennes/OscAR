export interface EditHuntRequestDTO {
    id: string,
    title: string;
    description: string;
    difficulty_id: string;
    points: number;
    latitude: number;
    longitude: number;
    picture_path: string;
}