import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { CreateStepRequestDTO } from "../common-lib/dto/step/CreateStepRequestDTO.js";
import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { FullStepDTO } from "../common-lib/dto/step/FullStepDTO.js";
import { LightStepDTO } from "../common-lib/dto/step/LightStepDTO.js";

export interface StepService {
  createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO>;
  getStepsByCulturalCenter(user: AuthResponseDTO): Promise<LightStepDTO[]>;
  getStepById(user: AuthResponseDTO, id: string): Promise<FullStepDTO | null>;
}