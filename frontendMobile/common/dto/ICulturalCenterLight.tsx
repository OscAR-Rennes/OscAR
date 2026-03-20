export interface CulturalCenterLight {
    id: string;
    name: string;
    address: {
        longitude: string;
        latitude: string;
    }
    description: string;
    picture_path?:string;
}