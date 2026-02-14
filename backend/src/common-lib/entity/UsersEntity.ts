import { RoleEnum } from "../enum/roleEnum";

export interface UserEntity {
  id: string;
  email: string;
  username: string;
  rights: string[];
  id_cultural_center?: string;
  isActive: boolean;
  password: string;
  created_at: Date;
  updated_at: Date;
}