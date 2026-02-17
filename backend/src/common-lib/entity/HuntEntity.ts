export class HuntEntity {
  id!: string;
  title!: string;
  description!: string;
  creator_id!: string;
  difficulty_id!: string;
  isActive!: boolean;
  points!: number;
  latitude!: number;
  longitude!: number;
  picture_path?: string | null;
  created_at!: Date;
  updated_at!: Date;
  cultural_center_id!: string;

  constructor(data: Partial<HuntEntity>) {
    Object.assign(this, data);
  }
}