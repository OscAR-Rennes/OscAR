import { StepService } from "../StepService.js";
import { CreateStepRequestDTO } from "../../common-lib/dto/step/CreateStepRequestDTO.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { stepMapper } from "../../mapper/StepMapper.js";
import { CreateStepResponseDTO } from "../../common-lib/dto/step/CreateStepResponseDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import { IndexServiceImpl } from "./IndexServiceImpl.js";
import logger from "../../common-lib/utils/logger.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { LightStepDTO } from "../../common-lib/dto/step/LightStepDTO.js";

const indexServiceImpl = new IndexServiceImpl();
const stepRepository = new StepRepository();
const indexRepository = new IndexRepository();

export class StepServiceImpl implements StepService {

    async createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO> {
        try {
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

    async deleteStep(stepId: string): Promise<void> {
        try {
            await prisma.$transaction(async (tx) => {
                const step = await stepRepository.getStepById(stepId);
                const stepIndexId = step.index_id;

                const stepsInIndex = await stepRepository.getStepsByIndexId(stepIndexId);
                if (stepsInIndex.length === 0) {
                    await indexServiceImpl.deleteIndex(stepIndexId);
                    logger.info(`Index deleted successfully with ID: ${stepIndexId}`, { indexId: stepIndexId });
                }
                await stepRepository.delete(stepId);
                logger.info(`Step deleted successfully with ID: ${stepId}`, { stepId });
            });
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la suppression de l\'étape',
                statusCode: 500,
            });
        }
    }

    async getStepsByCulturalCenter(user: AuthResponseDTO): Promise<LightStepDTO[]> {
        try {
            if (user.rights.includes('ADMIN')) {
                return (await stepRepository.getAll()).map(stepMapper.toLightDTO);
            }

            if (user.rights.includes('HUNT_MANAGER')) {
                return (await stepRepository.getByHuntCreator(user.id)).map(stepMapper.toLightDTO);
            }

            if (
                user.rights.includes('CULTURAL_CENTER_MANAGER') &&
                user.id_cultural_center
            ) {
                return (await stepRepository.getByCulturalCenter(user.id_cultural_center)).map(stepMapper.toLightDTO);
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
}