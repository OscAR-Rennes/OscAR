
import { prisma } from "../../common-lib/config/prismaClient.js";
import { GetAllActiveCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { GetMapCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetMapCulturalCenterResponseDTO.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import logger from "../../common-lib/utils/logger.js";
import { culturalCenterMapper } from "../../mapper/CulturalCenterMapper.js";
import { CulturalCenterService } from "../CulturalCenterService.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { RoleEnum } from "../../common-lib/enum/roleEnum.js";

const culturalCenterRepository = new CulturalCenterRepository();
const huntRepository = new HuntRepository();

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

      async getAllActiveCulturalCentersForMap(
        pagination: PaginationParamsDTO,
        filters: { search?: string; minLat?: number; maxLat?: number; minLng?: number; maxLng?: number }
      ): Promise<PaginatedResponseDTO<GetMapCulturalCenterResponseDTO>> {
        try {
          const culturalCenters = await culturalCenterRepository.getAllActiveForMap(filters);
          return paginateArray(culturalCenters.map(culturalCenterMapper.toMapDTO), pagination);
        }
        catch (error: any) {
          throw new AppError({
            userMessage: "Erreur lors de la récupération des centres culturels pour la carte",
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

  async deleteCulturalCenters(user: AuthResponseDTO, ids: string[]): Promise<void> {
    try {
      const userRepository = new UserRepository();

      const isAdmin = user.rights.includes(RoleEnum.ADMIN);
      const isCenterManager = user.rights.includes(RoleEnum.CULTURAL_CENTER_MANAGER);

      if (!isAdmin && !isCenterManager) {
        throw new AppError({
          userMessage: "Accès non autorisé",
          statusCode: 403,
        });
      }

      if (isCenterManager) {
        if (!user.id_cultural_center) {
          throw new AppError({
            userMessage: "Centre culturel du gérant introuvable",
            statusCode: 403,
          });
        }

        const hasUnauthorizedId = ids.some((id) => id !== user.id_cultural_center);
        if (hasUnauthorizedId) {
          throw new AppError({
            userMessage: "Un gérant ne peut supprimer que son propre centre culturel",
            statusCode: 403,
          });
        }
      }

      await prisma.$transaction(async (tx) => {
        for (const centerId of ids) {
          const existingCenter = await culturalCenterRepository.getById(centerId, tx);

          if (!existingCenter) {
            throw new AppError({
              userMessage: "Centre culturel non trouvé",
              statusCode: 404,
            });
          }

          const stepRepository = new StepRepository();
          const indexRepository = new IndexRepository();

          const hunts = await huntRepository.getByCulturalCenter(centerId);
          for (const hunt of hunts) {
            await stepRepository.deleteByHuntId(hunt.id, tx);
            await indexRepository.deleteByHuntId(hunt.id, tx);
            await huntRepository.delete(hunt.id, tx);
          }

          await userRepository.unassignUsersByCenter(centerId, tx);
          await culturalCenterRepository.delete(centerId, tx);

          logger.info(`Cultural center deleted successfully with ID: ${centerId}`, { culturalCenterId: centerId });
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        userMessage: "Erreur lors de la suppression des centres culturels",
        statusCode: 500,
      });
    }
  }
}