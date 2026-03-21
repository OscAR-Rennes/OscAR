import { LightUserDTO } from "../common-lib/dto/users/LightUserDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { NewUserRequestDTO } from "../common-lib/dto/users/NewUserRequestDTO.js";
import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { FullUserDTO } from "../common-lib/dto/users/FullUserDTO.js";

export interface UsersService {
  getAllUsers(): Promise<LightUserDTO[]>;
  createUserWeb(userData: NewUserRequestDTO): Promise<NewUserResponseDTO>;
  getAllUsersByCulturalCenter(culturalcenter_id: string): Promise<LightUserDTO[]>;
  switchUsersStatus(ids: string[]): Promise<boolean>;
  getById(id: string, user:AuthResponseDTO) : Promise<FullUserDTO>;
}