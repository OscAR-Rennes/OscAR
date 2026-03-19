import { AppError } from "../../common-lib/errors/AppError.js";
import { IndexService } from "../IndexService.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { CreateIndexRequestDTO } from "../../common-lib/dto/index/CreateIndexRequestDTO.js";
import { CreateIndexResponseDTO } from "../../common-lib/dto/index/CreateIndexResponseDTO.js";
import { indexMapper } from "../../mapper/IndexMapper.js";
import { GetIndexByHuntResponseDTO } from "../../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { assertUserCanAccessHunt } from "../../common-lib/utils/assertCanAccessHunt.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import logger from "../../common-lib/utils/logger.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";

const indexRepository = new IndexRepository();

export class IndexServiceImpl implements IndexService {

    async createIndex(indexData: CreateIndexRequestDTO): Promise<CreateIndexResponseDTO> {
        try {
            const index = await indexRepository.create(indexData);
            return indexMapper.toCreateResponseDto(index);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la création de l\'index',
                statusCode: 500,
            });
        }
    }

    async getIndexByHunt(huntId: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetIndexByHuntResponseDTO>> {
        try {
            const indexes = await indexRepository.getByHuntID(huntId);
            return paginateArray(indexes.map(indexMapper.toLightDTO), pagination);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des index de la chasse',
                statusCode: 500,
            });
        }
    }


    async deleteIndex(user: AuthResponseDTO, indexId: string): Promise<void> {
        try {
            const userRepository = new UserRepository();
            const index = await indexRepository.getByIdWithHunt(indexId);

            if (!index) {
                throw new AppError({
                    userMessage: "Index non trouvé",
                    statusCode: 404,
                });
            }

            await assertUserCanAccessHunt(user, index.hunts, userRepository);
            


            await prisma.$transaction(async (tx) => {
                const stepRepository = new StepRepository();
                const huntRepository = new HuntRepository();
                

                const indexesInHunt = await indexRepository.countByHuntId(index.hunt_id, tx);
                await stepRepository.deleteByIndexId(indexId, tx);
                
                if (indexesInHunt === 1) {
                    await huntRepository.updateIsActive(index.hunt_id, false, tx);
                    logger.info(`Hunt disabled because its last index became empty: ${index.hunt_id}`, { huntId: index.hunt_id });
                }

                await indexRepository.delete(indexId, tx);
                logger.info(`Index deleted successfully with ID: ${indexId}`, { indexId, huntId: index.hunt_id });
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: 'Erreur lors de la suppression de l\'index',
                statusCode: 500,
            });
        }
    }
}