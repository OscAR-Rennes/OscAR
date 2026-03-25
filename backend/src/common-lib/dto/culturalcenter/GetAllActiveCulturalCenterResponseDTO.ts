export interface GetAllActiveCulturalCenterResponseDTO {
    id: string;
    name: string;
    address: {
        longitude: number;
        latitude: number;
    }
    description: string;
    picture_path?:string;
}