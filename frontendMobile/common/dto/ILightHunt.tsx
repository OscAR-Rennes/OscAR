export interface LightHuntDto {
    id: string
    title: string;
    difficulty: {
        name: string
    }
    points: number;
    steps: number;
}