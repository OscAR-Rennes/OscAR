export class IndexEntity {
  id!: string;
  name?: string | null;
  index!: number;
  hunt_id!: string;
  created_at!: Date;
  updated_at!: Date;

  constructor(data: Partial<IndexEntity>) {
    Object.assign(this, data);
  }
}