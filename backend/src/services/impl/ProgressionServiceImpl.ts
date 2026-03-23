import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { AddProgressionRequestDTO } from "../../common-lib/dto/progression/AddProgressionRequestDTO.js";
import { GetProgressionDTO } from "../../common-lib/dto/progression/GetProgressionDTO.js";
import AppError from "../../common-lib/errors/AppError.js";
import { ProgressionRepository } from "../../common-lib/repositories/ProgressionRepository.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { ProgressionService } from "../ProgressionService.js";

const progressionRepository = new ProgressionRepository();

export class ProgressionServiceImpl implements ProgressionService {

    async saveProgression(data: AddProgressionRequestDTO, user: AuthResponseDTO) {
        try {
            const userRepository = new UserRepository()

            const existing = await progressionRepository.findProgression(user.id, data.step_id);
            if (existing) {
                throw new AppError({
                    userMessage: "Cette étape a déjà été validée",
                    statusCode: 409,
                });
            }

            const step = await progressionRepository.getStepPoints(data.step_id);
            if (!step) {
                throw new AppError({
                    userMessage: "Étape introuvable",
                    statusCode: 404,
                });
            }

            await progressionRepository.saveProgression(data, user.id);
            await userRepository.incrementUserPoints(user.id, step.points);

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError({
                userMessage: "Erreur lors de l'enregistrement de la progression",
                statusCode: 500,
            });
        }
    }

    async getTotalProgression(user: AuthResponseDTO): Promise<GetProgressionDTO[]> {
        try {
            const { progressions, hunts } = await progressionRepository.getTotalProgression(user.id);

            const completedStepIds = new Set(progressions.map(p => p.step_id));

            const progression = hunts.map(hunt => {
                const allSteps = hunt.steps;
                const isComplete = allSteps.every(s => completedStepIds.has(s.id));

                if (isComplete) {
                    return { hunt_id: hunt.id, isComplete: true };
                }

                const indexMap = new Map<string, { indexObj: typeof allSteps[0]['index'], steps: typeof allSteps }>();
                for (const step of allSteps) {
                    if (!indexMap.has(step.index_id)) {
                        indexMap.set(step.index_id, { indexObj: step.index, steps: [] });
                    }
                    indexMap.get(step.index_id)!.steps.push(step);
                }

                const sortedIndexes = [...indexMap.values()].sort((a, b) => a.indexObj.index - b.indexObj.index);

                const currentIndex = sortedIndexes.find(({ steps }) =>
                    steps.some(s => !completedStepIds.has(s.id))
                );

                if (!currentIndex) {
                    return { hunt_id: hunt.id, isComplete: false };
                }

                const remainingSteps = currentIndex.steps
                    .filter(s => !completedStepIds.has(s.id))
                    .map(s => ({ id: s.id, title: s.title }));

                return {
                    hunt_id: hunt.id,
                    isComplete: false,
                    current_index: {
                        id: currentIndex.indexObj.id,
                        index: currentIndex.indexObj.index,
                        remaining_steps: remainingSteps,
                    }
                };
            });

            return  progression ;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError({
                userMessage: "Erreur lors de la récupération de la progression",
                statusCode: 500,
            });
        }
    }

    async getProgressionByHunt(user: AuthResponseDTO, hunt_id: string): Promise<GetProgressionDTO> {
        try {
            const { progressions, hunt } = await progressionRepository.getProgressionByHunt(user.id, hunt_id);

            if (!hunt) {
                throw new AppError({ userMessage: "Chasse introuvable", statusCode: 404 });
            }

            const completedStepIds = new Set(progressions.map(p => p.step_id));
            const allSteps = hunt.steps;
            const isComplete = allSteps.every(s => completedStepIds.has(s.id));

            if (isComplete) {
                return { hunt_id: hunt.id, isComplete: true };
            }

            const indexMap = new Map<string, { indexObj: typeof allSteps[0]['index'], steps: typeof allSteps }>();
            for (const step of allSteps) {
                if (!indexMap.has(step.index_id)) {
                    indexMap.set(step.index_id, { indexObj: step.index, steps: [] });
                }
                indexMap.get(step.index_id)!.steps.push(step);
            }

            const sortedIndexes = [...indexMap.values()].sort((a, b) => a.indexObj.index - b.indexObj.index);

            const currentIndex = sortedIndexes.find(({ steps }) =>
                steps.some(s => !completedStepIds.has(s.id))
            );

            if (!currentIndex) {
                return { hunt_id: hunt.id, isComplete: false };
            }

            const remainingSteps = currentIndex.steps
                .filter(s => !completedStepIds.has(s.id))
                .map(s => ({ id: s.id, title: s.title }));

            return {
                hunt_id: hunt.id,
                isComplete: false,
                current_index: {
                    id: currentIndex.indexObj.id,
                    index: currentIndex.indexObj.index,
                    remaining_steps: remainingSteps,
                }
            };

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError({
                userMessage: "Erreur lors de la récupération de la progression",
                statusCode: 500,
            });
        }
    }
}