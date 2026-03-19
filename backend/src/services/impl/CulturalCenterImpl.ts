
import { prisma } from "../../common-lib/config/prismaClient.js";
import { GetAllActiveCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import logger from "../../common-lib/utils/logger.js";
import { culturalCenterMapper } from "../../mapper/CulturalCenterMapper.js";
import { CulturalCenterService } from "../CulturalCenterService.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";

const culturalCenterRepository = new CulturalCenterRepository();

export class CulturalCenterServiceImpl implements CulturalCenterService {

    async getAllActiveCulturalCenters(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllActiveCulturalCenterResponseDTO>> {
        try {
            const culturalCenters = await culturalCenterRepository.getAllActive();
        return paginateArray(culturalCenters.map(culturalCenterMapper.toLightWithouActiveDTO), pagination);
        }
        catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des centres culturels actifs',
                statusCode: 500,
            });
        }
    }

    async getAllCulturalCenter(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllCulturalCenterResponseDTO>> {
        try {
            const culturalCenters = await culturalCenterRepository.getAll();
        return paginateArray(culturalCenters.map(culturalCenterMapper.toLightDTO), pagination)
        }
        catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des centres culturels',
                statusCode: 500,
            });
        }
    }

    async switchCulturalCenterStatus(ids: string[]): Promise<boolean> {
    try {
      const userRepository = new UserRepository();
      await prisma.$transaction(async (tx) => {
        const centers = await culturalCenterRepository.switchCulturalCenterStatus(ids);

        for (const center of centers) {
          if (center.isActive === false) {
            await userRepository.deactivateUsersByCenter(center.id);
            logger.info(`Users deactivated for cultural center ${center.id}`, { culturalCenterId: center.id });
          } else {
            await userRepository.activateManagersByCenter(center.id);
            logger.info(`Managers activated for cultural center ${center.id}`, { culturalCenterId: center.id });
          }
        }
      });

      return true;

    } catch (err) {
      throw new AppError({
        userMessage: "Erreur lors du changement de statut des centres culturels",
        statusCode: 500,
      });
    }
  }
}