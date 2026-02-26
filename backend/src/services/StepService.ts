import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { CreateStepRequestDTO } from "../common-lib/dto/step/CreateStepRequestDTO.js";
import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { GetAllStepsResponseDTO } from "../common-lib/dto/step/GetAllStepResponseDTO.js";

export interface StepService {
  createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO>;
  getStepsByCulturalCenter(user: AuthResponseDTO): Promise<GetAllStepsResponseDTO[]>;
}