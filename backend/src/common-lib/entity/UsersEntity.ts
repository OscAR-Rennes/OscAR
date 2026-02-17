export class UserEntity {
  id!: string;
  email!: string;
  username!: string;
  rights!: string[];
  id_cultural_center?: string | null;
  isActive!: boolean;
  password!: string;
  created_at!: Date;
  updated_at!: Date;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}