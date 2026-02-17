import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { GetAllHuntResponseDTO } from "../common-lib/dto/hunt/GetAllHuntResponseDTO.js";
import { HuntEntity } from "../common-lib/entity/HuntEntity.js";

export const huntMapper = {

  toCreateResponseDto(entity: HuntEntity): CreateHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: HuntEntity): GetAllHuntResponseDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description
      };
    },

  toEditResponseDto(entity: HuntEntity): EditHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

};