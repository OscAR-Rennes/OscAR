export interface CulturalCenter {
    id: string;
    name: string;
    description: string;
    picture_path?: string | null;
    isActive: boolean;
    address: {
        longitude: string;
        latitude: string;
    }
}