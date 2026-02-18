import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { GetAllHuntResponseDTO } from "../common-lib/dto/hunt/GetAllHuntResponseDTO.js";
import { hunts } from "@prisma/client";

export const huntMapper = {

  toCreateResponseDto(entity: hunts): CreateHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: hunts): GetAllHuntResponseDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description
      };
    },

  toEditResponseDto(entity: hunts): EditHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

};