export interface CulturalCenterEntity {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  address_id: string;
  picture_path?: string;
  created_at: Date;
  updated_at: Date;
}