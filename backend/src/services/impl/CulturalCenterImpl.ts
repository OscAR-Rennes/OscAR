
import { prisma } from "../../common-lib/config/prismaClient.js";
import { GetAllActiveCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import logger from "../../common-lib/utils/logger.js";
import { culturalCenterMapper } from "../../mapper/CulturalCenterMapper.js";
import { CulturalCenterService } from "../CulturalCenterService.js";

const culturalCenterRepository = new CulturalCenterRepository();
const userRepository = new UserRepository();

export class CulturalCenterServiceImpl implements CulturalCenterService {

    async getAllActiveCulturalCenters(): Promise<GetAllActiveCulturalCenterResponseDTO[]> {
        try {
            const culturalCenters = await culturalCenterRepository.getAllActive();
            return culturalCenters.map(culturalCenterMapper.toLightWithouActiveDTO);
        }
        catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des centres culturels actifs',
                statusCode: 500,
            });
        }
    }

    async getAllCulturalCenter(): Promise<GetAllCulturalCenterResponseDTO[]> {
        try {
            const culturalCenters = await culturalCenterRepository.getAll();
            return culturalCenters.map(culturalCenterMapper.toLightDTO)
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