import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { StepEntity } from "../common-lib/entity/StepEntity.js";

export const stepMapper = {

  toCreateResponseDto(entity: StepEntity): CreateStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

};