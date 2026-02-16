import { CreateStepRequestDTO } from "../common-lib/dto/step/CreateStepRequestDTO.js";
import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";

export interface StepService {
  createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO>;
  deleteStep(stepId: string): Promise<void>;
}