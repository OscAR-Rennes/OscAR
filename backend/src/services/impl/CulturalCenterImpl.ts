
import { pool } from "../../common-lib/config/database";
import { prisma } from "../../common-lib/config/prismaClient";
import { GetAllActiveCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO";
import { GetAllCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO";
import { SwitchStatusCulturalCenterRequestDTO } from "../../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO";
import { AppError } from "../../common-lib/errors/AppError";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository";
import { UserRepository } from "../../common-lib/repositories/UsersRepository";
import { culturalCenterMapper } from "../../mapper/CulturalCenterMapper";
import { CulturalCenterService } from "../CulturalCenterService";

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

    async switchCulturalCenterStatus(ids: SwitchStatusCulturalCenterRequestDTO): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const centers = await culturalCenterRepository.switchCulturalCenterStatus(ids.id);

        for (const center of centers) {
          if (center.isActive === false) {
            await userRepository.deactivateUsersByCenter(center.id);
          } else {
            await userRepository.activateManagersByCenter(center.id);
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