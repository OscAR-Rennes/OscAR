export interface EditHuntFormDto {
  title: string;
  description: string;
  difficulty_id: string;
  points: number | string;
  latitude: number | string;
  longitude: number | string;
  picture_path?: string;
  active: boolean;
}