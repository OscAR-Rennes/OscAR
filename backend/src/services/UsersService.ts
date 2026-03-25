import { LightUserDTO } from "../common-lib/dto/users/LightUserDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { NewUserRequestDTO } from "../common-lib/dto/users/NewUserRequestDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";
import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { FullUserDTO } from "../common-lib/dto/users/FullUserDTO.js";

export interface UsersService {
  getAllUsers(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightUserDTO>>;
  createUserWeb(userData: NewUserRequestDTO): Promise<NewUserResponseDTO>;
  getAllUsersByCulturalCenter(culturalcenter_id: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightUserDTO>>;
  switchUsersStatus(ids: string[]): Promise<boolean>;
  getById(id: string, user:AuthResponseDTO) : Promise<FullUserDTO>;
}