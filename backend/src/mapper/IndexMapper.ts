import { CreateIndexResponseDTO } from "../common-lib/dto/index/CreateIndexResponseDTO.js";
import { EditIndexResponseDTO } from "../common-lib/dto/index/EditIndexResponseDTO.js";
import { GetIndexByHuntResponseDTO } from "../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import { IndexEntity } from "../common-lib/entity/IndexEntity.js";
import { index } from "@prisma/client";

export const indexMapper = {

  toCreateResponseDto(entity: index): CreateIndexResponseDTO {
    return {
      id: entity.id,
      name: entity.name??""
    };
  },

  toLightDTO(entity: index): GetIndexByHuntResponseDTO {
    return {
        id: entity.id,
        name: entity.name??"",
        index: entity.index
    }
  },

  toEditResponseDto(entity: index): EditIndexResponseDTO {
    return {
      id: entity.id,
      name: entity.name ?? "",
      index: entity.index,
      hunt_id: entity.hunt_id,
    };
  }

};