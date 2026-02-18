import { CreateIndexResponseDTO } from "../common-lib/dto/index/CreateIndexResponseDTO.js";
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
  }

};