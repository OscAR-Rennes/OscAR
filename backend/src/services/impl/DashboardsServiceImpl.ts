import { DashboardsService } from "../DashboardsService.js";
import { DashboardsRepository } from "../../common-lib/repositories/DashboardsRepository.js";
import { difficultyMapper } from "../../mapper/DifficultyMapper.js";
import { NewUserRequestDTO } from "../../common-lib/dto/users/NewUserRequestDTO.js";
import AppError from "../../common-lib/errors/AppError.js";

const dashboardsRepository = new DashboardsRepository();

export class DashboardsServiceImpl implements DashboardsService {
  getDashboardByHunt(huntId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  getDashboardByCulturalCenter(culturalCenterId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
}