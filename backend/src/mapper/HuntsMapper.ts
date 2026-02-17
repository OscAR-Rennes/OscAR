import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO";
import { GetAllHuntResponseDTO } from "../common-lib/dto/hunt/GetAllHuntResponseDTO";
import { HuntEntity } from "../common-lib/entity/HuntEntity";

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