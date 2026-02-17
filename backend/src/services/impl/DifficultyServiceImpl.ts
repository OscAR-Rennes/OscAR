import { DifficultyService } from "../DifficultyService.js";
import { DifficultyRepository } from "../../common-lib/repositories/DifficultyRepository.js";
import { difficultyMapper } from "../../mapper/DifficultyMapper.js";
import { NewUserRequestDTO } from "../../common-lib/dto/users/NewUserRequestDTO.js";
import AppError from "../../common-lib/errors/AppError.js";

const difficultyRepository = new DifficultyRepository();

export class DifficultyServiceImpl implements DifficultyService {
  async getAllDifficulty() {
    try {
        const difficulties = await difficultyRepository.getAll();
        return difficulties.map(difficultyMapper.toLightDTO);
    } catch (error: any) {
        throw new AppError({
        userMessage: 'Erreur lors de la récupération des difficultées',
        statusCode: 500,
        }); 
    }
  }
}