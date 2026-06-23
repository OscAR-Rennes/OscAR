export class CulturalCenterEntity {
  id!: string;
  name!: string;
  description!: string;
  isActive!: boolean;
  address_id!: string;
  picture_path?: string | null;
  created_at!: Date;
  updated_at!: Date;

  constructor(data: Partial<CulturalCenterEntity>) {
    Object.assign(this, data);
  }
}