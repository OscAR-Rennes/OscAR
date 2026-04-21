import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";
import { CreateStepRequestDTO } from "../common-lib/dto/step/CreateStepRequestDTO.js";
import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { EditStepRequestDTO } from "../common-lib/dto/step/EditStepRequestDTO.js";
import { EditStepResponseDTO } from "../common-lib/dto/step/EditStepResponseDTO.js";
import { FullStepDTO } from "../common-lib/dto/step/FullStepDTO.js";
import { LightStepDTO } from "../common-lib/dto/step/LightStepDTO.js";

export interface StepService {
  createStep(stepData: any, imageFile?: Express.Multer.File, modelFile?: Express.Multer.File): Promise<CreateStepResponseDTO>;
  editStep(stepData: EditStepRequestDTO, user: AuthResponseDTO): Promise<EditStepResponseDTO>;
  deleteStep(user: AuthResponseDTO, stepIds: string[]): Promise<void>;
  getStepsByCulturalCenter(user: AuthResponseDTO, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>>;
  getStepsByIndex(indexId: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>>;
  getStepById(id: string): Promise<FullStepDTO | null>;
  downloadStepAr(stepId: string): Promise<{ fileBuffer: Buffer; fileName: string }>;
  downloadStepTarget(stepId: string): Promise<{ fileBuffer: Buffer; fileName: string }>;
}