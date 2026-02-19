import { LightUserDTO } from "../common-lib/dto/users/LightUserDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { users } from "@prisma/client";

export const userMapper = {
  toLightDTO(entity: users): LightUserDTO {
    return {
      id: entity.id,
      email: entity.email,
      isActive: entity.isActive,
      username: entity.username
    };
  },

  toDTONewUser(entity: users): NewUserResponseDTO {
    return {
      id: entity.id,
      username: entity.username
    };
  }
};