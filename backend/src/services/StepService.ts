import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";
import { CreateStepRequestDTO } from "../common-lib/dto/step/CreateStepRequestDTO.js";
import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { FullStepDTO } from "../common-lib/dto/step/FullStepDTO.js";
import { LightStepDTO } from "../common-lib/dto/step/LightStepDTO.js";

export interface StepService {
  createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO>;
  deleteStep(user: AuthResponseDTO, stepIds: string[]): Promise<void>;
  getStepsByCulturalCenter(user: AuthResponseDTO, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>>;
  getStepById(user: AuthResponseDTO, id: string): Promise<FullStepDTO | null>;
  getStepsByIndex(indexId: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>>;
}