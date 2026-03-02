import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { steps } from "@prisma/client";
import { LightStepDTO } from "../common-lib/dto/step/LightStepDTO.js";

export const stepMapper = {

  toCreateResponseDto(entity: steps): CreateStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: steps): LightStepDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description
      };
    },
};