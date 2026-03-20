export interface EditStepBodyRequestDTO {
  title?: string;
  description?: string;
  points?: number;
  latitude?: number | null;
  longitude?: number | null;
  index_id?: string;
}
