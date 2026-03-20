export interface GetMapCulturalCenterResponseDTO {
  id: string;
  name: string;
  description?: string;
  picture_path?: string | null;
  latitude: number;
  longitude: number;
}
