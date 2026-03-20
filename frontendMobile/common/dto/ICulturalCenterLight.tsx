export interface CulturalCenterLight {
    id: string;
    name: string;
    address: {
        longitude: number;
        latitude: number;
    }
    description: string;
    picture_path?:string;
}