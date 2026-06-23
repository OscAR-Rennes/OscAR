import { FullUserDTO } from "../common-lib/dto/users/FullUserDTO.js";
import { LightUserDTO } from "../common-lib/dto/users/LightUserDTO.js";
import { NewUserResponseDTO } from "../common-lib/dto/users/NewUserResponseDTO.js";
import { users } from "@prisma/client";

type UserWithRights = users & {
  right_user?: Array<{ rights?: { name?: string } }>;
};

export const userMapper = {
  toLightDTO(entity: UserWithRights): LightUserDTO {
    return {
      id: entity.id,
      email: entity.email,
      isActive: entity.isActive,
      username: entity.username,
      rights: Array.isArray(entity.right_user)
        ? entity.right_user.map((ru: any) => ru.rights?.name).filter(Boolean)
        : [],
    };
  },

  toDTONewUser(entity: users): NewUserResponseDTO {
    return {
      id: entity.id,
      username: entity.username
    };
  },

  toFullDto(entity: users): FullUserDTO {
    return {
      id: entity.id,
      username: entity.username,
      firstname: entity.firstname,
      lastname: entity.lastname,
      points: entity.points,
      email: entity.email,
      age: entity.age
    }
  }
};