export interface EditStepResponseDTO {
  id: string;
  title: string;
  description: string;
  points: number;
  latitude: number | null;
  longitude: number | null;
  hunt_id: string;
  index_id: string;
}
