export interface FullCulturalCenterDTO {
    id: string;
    name: string;
    description: string;
    picture_path?: string | null;
    isActive: boolean;
    address: {
        longitude: number;
        latitude: number;
    }
}