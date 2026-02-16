export class StepEntity {
  id!: string;
  title!: string;
  description!: string;
  points!: number;
  latitude!: number;
  longitude!: number;
  hunt_id!: string;
  index_id!: string;
  created_at!: Date;
  updated_at!: Date;

  constructor(data: Partial<StepEntity>) {
    Object.assign(this, data);
  }
}