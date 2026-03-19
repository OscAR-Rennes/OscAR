import { LightUserDTO } from "../common-lib/dto/users/LightUserDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { NewUserRequestDTO } from "../common-lib/dto/users/NewUserRequestDTO.js";
import { SwitchStatusUsersRequestDTO } from "../common-lib/dto/users/SwitchStatusUsersRequestDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";

export interface UsersService {
  getAllUsers(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightUserDTO>>;
  createUserWeb(userData: NewUserRequestDTO): Promise<NewUserResponseDTO>;
  getAllUsersByCulturalCenter(culturalcenter_id: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightUserDTO>>;
  switchUsersStatus(ids: string[]): Promise<boolean>;
  //TODO: createUserMobile without cultural center creation / cultural center affiliation and auto role USER
}