import { StepService } from "../StepService.js";
import { CreateStepRequestDTO } from "../../common-lib/dto/step/CreateStepRequestDTO.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { stepMapper } from "../../mapper/StepMapper.js";
import { CreateStepResponseDTO } from "../../common-lib/dto/step/CreateStepResponseDTO.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import { IndexServiceImpl } from "./IndexServiceImpl.js";

const indexServiceImpl = new IndexServiceImpl();
const stepRepository = new StepRepository();
const indexRepository = new IndexRepository();

export class StepServiceImpl implements StepService {

    async createStep(stepData: CreateStepRequestDTO): Promise<CreateStepResponseDTO> {
        try {
            let stepToCreate = stepData;
            if (!stepData.index_id) {
                const index = await indexRepository.createIncrementEmpty(stepData.hunt_id);
                stepData.index_id = index.id;
                stepToCreate = {
                    ...stepData,
                    index_id: index.id,
                };

            }

            const step = await stepRepository.create(stepToCreate);
            return stepMapper.toCreateResponseDto(step);

        } catch (error: any) {
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
                console.log("Step to delete:", step);
                const stepIndexId = step.index_id;

                const stepsInIndex = await stepRepository.getStepsByIndexId(stepIndexId);
                if (stepsInIndex.length === 0) {
                    await indexServiceImpl.deleteIndex(stepIndexId);
                }
                await stepRepository.delete(stepId);
            });
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la suppression de l\'étape',
                statusCode: 500,
            });
        }
    }
}