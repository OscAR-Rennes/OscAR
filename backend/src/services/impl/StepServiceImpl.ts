import { StepService } from "../StepService";
import { CreateStepRequestDTO } from "../../common-lib/dto/step/CreateStepRequestDTO";
import { StepRepository } from "../../common-lib/repositories/StepRepository";
import { stepMapper } from "../../mapper/StepMapper";
import { CreateStepResponseDTO } from "../../common-lib/dto/step/CreateStepResponseDTO";
import { AppError } from "../../common-lib/errors/AppError";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository";

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
}