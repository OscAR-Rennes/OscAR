import { DifficultyService } from "../DifficultyService.js";
import { DifficultyRepository } from "../../common-lib/repositories/DifficultyRepository.js";
import { difficultyMapper } from "../../mapper/DifficultyMapper.js";
import AppError from "../../common-lib/errors/AppError.js";
import logger from "../../common-lib/utils/logger.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { GetAllDifficultyResponseDTO } from "../../common-lib/dto/difficulty/GetAllDifficultyResponseDTO.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";

const difficultyRepository = new DifficultyRepository();

export class DifficultyServiceImpl implements DifficultyService {
  async getAllDifficulty(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllDifficultyResponseDTO>> {
    try {
        const difficulties = await difficultyRepository.getAll();
        return paginateArray(difficulties.map(difficultyMapper.toLightDTO), pagination);
    } catch (error: any) {
        throw new AppError({
        userMessage: 'Erreur lors de la récupération des difficultées',
        statusCode: 500,
        }); 
    }
  }
}