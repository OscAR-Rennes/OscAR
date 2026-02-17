import { CreateIndexResponseDTO } from "../common-lib/dto/index/CreateIndexResponseDTO.js";
import { GetIndexByHuntResponseDTO } from "../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import { IndexEntity } from "../common-lib/entity/IndexEntity.js";

export const indexMapper = {

  toCreateResponseDto(entity: IndexEntity): CreateIndexResponseDTO {
    return {
      id: entity.id,
      name: entity.name ?? ""
    };
  },

  toLightDTO(entity: IndexEntity): GetIndexByHuntResponseDTO {
    return {
        id: entity.id,
        name: entity.name ?? "",
        index: entity.index
    }
  }

};