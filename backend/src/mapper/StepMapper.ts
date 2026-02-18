import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { steps } from "@prisma/client";

export const stepMapper = {

  toCreateResponseDto(entity: steps): CreateStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

};