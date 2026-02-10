import { CreateCulturalCenterRequestDTO } from "../culturalcenter/CreateCulturalCenterRequestDTO";

export interface NewUserRequestDTO {
  username: string;
  email: string;
  password: string;
  rights: string[];
  id_cultural_center?: string;
  isNewCulturalCenter?: boolean;
  newCulturalCenter?: CreateCulturalCenterRequestDTO;
}