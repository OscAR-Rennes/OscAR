import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { steps } from "@prisma/client";
import { GetAllStepsResponseDTO } from "../common-lib/dto/step/GetAllStepResponseDTO.js";

export const stepMapper = {

  toCreateResponseDto(entity: steps): CreateStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: steps): GetAllStepsResponseDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description
      };
    },
};