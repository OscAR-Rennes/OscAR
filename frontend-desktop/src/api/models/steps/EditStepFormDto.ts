export interface EditStepFormDto {
  title: string;
  description: string;
  points: number | string;
  latitude: number | string | null;
  longitude: number | string | null;
  index_id?: string;
}