import { GetAllDifficultyResponseDTO } from "../common-lib/dto/difficulty/GetAllDifficultyResponseDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";

export interface DifficultyService {
  getAllDifficulty(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllDifficultyResponseDTO>>;
}