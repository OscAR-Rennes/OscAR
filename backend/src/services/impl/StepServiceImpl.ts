import { StepService } from "../StepService.js";
import { CreateStepRequestDTO } from "../../common-lib/dto/step/CreateStepRequestDTO.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { stepMapper } from "../../mapper/StepMapper.js";
import { CreateStepResponseDTO } from "../../common-lib/dto/step/CreateStepResponseDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import logger from "../../common-lib/utils/logger.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { LightStepDTO } from "../../common-lib/dto/step/LightStepDTO.js";
import { FullStepDTO } from "../../common-lib/dto/step/FullStepDTO.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { assertUserCanAccessHunt } from "../../common-lib/utils/assertCanAccessHunt.js";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";

const stepRepository = new StepRepository();

export class StepServiceImpl implements StepService {

    async createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO> {
        try {
            const indexRepository = new IndexRepository();
            let stepToCreate = stepData;
            if (!stepData.index_id) {
                const index = await indexRepository.createIncrementEmpty(stepData.hunt_id);
                logger.info(`Index created for new step with ID: ${index.id}`, { indexId: index.id, huntId: stepData.hunt_id });
                stepData.index_id = index.id;
                stepToCreate = {
                    ...stepData,
                    index_id: index.id,
                };

            }

            const step = await stepRepository.create(stepToCreate);
            logger.info(`Step created successfully with ID: ${step.id}`, { stepId: step.id, indexId: step.index_id });
            return stepMapper.toCreateResponseDto(step);

        } catch (error: any) {
            logger.error(`Error creating step: ${error.message}`, { error, stepData });
            throw new AppError({
                userMessage: 'Erreur lors de la création de l\'étape',
                statusCode: 500,
            });
        }
    }

    async deleteStep(user: AuthResponseDTO, stepId: string): Promise<void> {
        try {
            const userRepository = new UserRepository();
            const step = await stepRepository.getByIdWithHunt(stepId);

            if (!step) {
                throw new AppError({
                    userMessage: "Étape non trouvée",
                    statusCode: 404,
                });
            }

            await assertUserCanAccessHunt(user, step.hunts, userRepository);

            await prisma.$transaction(async (tx) => {
                const indexRepository = new IndexRepository();
                const huntRepository = new HuntRepository();
                await stepRepository.delete(stepId, tx);

                const remainingStepsInIndex = await stepRepository.countByIndexId(step.index_id, tx);

                if (remainingStepsInIndex === 0) {
                    const indexesInHunt = await indexRepository.countByHuntId(step.hunt_id, tx);

                    if (indexesInHunt === 1) {
                        await huntRepository.updateIsActive(step.hunt_id, false, tx);
                        logger.info(`Hunt disabled because its last index became empty: ${step.hunt_id}`, { huntId: step.hunt_id });
                    }

                    await indexRepository.delete(step.index_id, tx);
                    logger.info(`Index deleted successfully with ID: ${step.index_id}`, { indexId: step.index_id });
                }

                logger.info(`Step deleted successfully with ID: ${stepId}`, { stepId });
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: 'Erreur lors de la suppression de l\'étape',
                statusCode: 500,
            });
        }
    }

    async getStepsByCulturalCenter(user: AuthResponseDTO, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>> {
        try {
            if (user.rights.includes('ADMIN')) {
                return paginateArray((await stepRepository.getAll()).map(stepMapper.toLightDTO), pagination);
            }

            if (user.rights.includes('HUNT_MANAGER')) {
                return paginateArray((await stepRepository.getByHuntCreator(user.id)).map(stepMapper.toLightDTO), pagination);
            }

            if (
                user.rights.includes('CULTURAL_CENTER_MANAGER') &&
                user.id_cultural_center
            ) {
                return paginateArray((await stepRepository.getByCulturalCenter(user.id_cultural_center)).map(stepMapper.toLightDTO), pagination);
            }

            throw new AppError({
                userMessage: "Vous n'avez pas les droits pour accéder aux étapes",
                statusCode: 403,
            });
        } catch (error) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des étapes',
                statusCode: error instanceof AppError ? error.statusCode : 500
            });
        }
    }

    async getStepById(
    user: AuthResponseDTO,
    id: string
    ): Promise<FullStepDTO | null> {
    try {
        const userRepository = new UserRepository();
        const step = await stepRepository.getById(id);

        if (!step) {
        return null;
        }

        await assertUserCanAccessHunt(user, step.hunts, userRepository);

        return stepMapper.toFullResponseDto(step);

    } catch (error) {
        if (error instanceof AppError) throw error;

        throw new AppError({
        userMessage: "Erreur lors de la récupération de l'étape",
        statusCode: 500,
        });
    }
    }

    async getStepsByIndex(indexId: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightStepDTO>> {
        try {
            const steps = await stepRepository.getStepsByIndexId(indexId);
            return paginateArray(steps.map(stepMapper.toLightDTO), pagination);
        } catch (error) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des étapes par index',
                statusCode: 500,
            });
        }
    }
    
}