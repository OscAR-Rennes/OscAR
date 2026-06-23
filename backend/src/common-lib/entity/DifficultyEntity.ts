export class DifficultyEntity {
  id!: string;
  name!: string;
  multiplicator!: number;
  created_at!: Date;
  updated_at!: Date;

  constructor(data: Partial<DifficultyEntity>) {
    Object.assign(this, data);
  }
}