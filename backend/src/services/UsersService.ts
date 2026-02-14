import { LightUserDTO } from "../common-lib/dto/users/UsersGetAllDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { NewUserRequestDTO } from "../common-lib/dto/users/NewUserRequestDTO.js";
import { SwitchStatusUsersRequestDTO } from "../common-lib/dto/users/SwitchStatusUsersRequestDTO.js";

export interface UsersService {
  getAllUsers(): Promise<LightUserDTO[]>;
  createUserWeb(userData: NewUserRequestDTO): Promise<NewUserResponseDTO>;
  getAllUsersByCulturalCenter(culturalcenter_id: string): Promise<LightUserDTO[]>;
  switchUsersStatus(ids: SwitchStatusUsersRequestDTO): Promise<boolean>;
  //TODO: createUserMobile without cultural center creation / cultural center affiliation and auto role USER
}