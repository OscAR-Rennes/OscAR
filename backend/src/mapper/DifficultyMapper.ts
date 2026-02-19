import { DifficultyEntity } from "../common-lib/entity/DifficultyEntity.js";
import { GetAllDifficultyResponseDTO } from "../common-lib/dto/difficulty/GetAllDifficultyResponseDTO.js";
import { difficulty } from "@prisma/client";

export const difficultyMapper = {
  toLightDTO(entity: difficulty): GetAllDifficultyResponseDTO {
    return {
      id: entity.id,
      name: entity.name,
      multiplicator: entity.multiplicator
    };
  },

};