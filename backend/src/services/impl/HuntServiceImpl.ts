import { HuntService } from "../HuntService.js";
import { CreateHuntRequestDTO } from "../../common-lib/dto/hunt/CreateHuntRequestDTO.js";
import { CreateHuntResponseDTO } from "../../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { huntMapper } from "../../mapper/HuntsMapper.js";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { LightHuntDTO } from "../../common-lib/dto/hunt/LightHuntDTO.js";
import { EditHuntRequestDTO } from "../../common-lib/dto/hunt/EditHuntRequestDTO.js";
import { EditHuntResponseDTO } from "../../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import logger from "../../common-lib/utils/logger.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { FullHuntDTO } from "../../common-lib/dto/hunt/FullHuntDTO.js";
import { assertUserCanAccessHunt } from "../../common-lib/utils/assertCanAccessHunt.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { HuntDashboardStatsDTO, HuntStatsDTO, HuntStatsScope } from "../../common-lib/dto/hunt/HuntStatsDTO.js";
import { ProgressionRepository } from "../../common-lib/repositories/ProgressionRepository.js";

const huntRepository = new HuntRepository();
const progressionRepository = new ProgressionRepository();

type StatsProgressionRecord = {
    hunt_id: string;
    user_id: string;
    step_id: string;
    created_at: Date;
    updated_at: Date;
    steps: {
        id: string;
        title: string;
        index_id: string;
        index: {
            id: string;
            index: number;
            name: string | null;
        };
    };
};

function average(values: number[]): number | null {
    if (values.length === 0) {
        return null;
    }

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAccessibleHuntsWhere(user: AuthResponseDTO) {
    if (user.rights.includes("ADMIN")) {
        return { role: "admin" as HuntStatsScope, where: {} };
    }

    if (user.rights.includes("CULTURAL_CENTER_MANAGER") && user.id_cultural_center) {
        return {
            role: "cultural_center_manager" as HuntStatsScope,
            where: { cultural_center_id: user.id_cultural_center },
        };
    }

    if (user.rights.includes("HUNT_MANAGER")) {
        return {
            role: "hunt_manager" as HuntStatsScope,
            where: { creator_id: user.id },
        };
    }

    throw new AppError({
        userMessage: "Vous n'avez pas les droits pour accéder aux statistiques des chasses",
        statusCode: 403,
    });
}

function buildHuntStats(hunt: Awaited<ReturnType<typeof huntRepository.getStatsHunts>>[number], progressions: StatsProgressionRecord[]): HuntStatsDTO {
    const orderedSteps = [...hunt.steps].sort((first, second) => first.index.index - second.index.index);
    const huntStepIds = new Set(orderedSteps.map((step) => step.id));
    const perUserProgressions = new Map<string, StatsProgressionRecord[]>();

    for (const progression of progressions) {
        if (!perUserProgressions.has(progression.user_id)) {
            perUserProgressions.set(progression.user_id, []);
        }

        perUserProgressions.get(progression.user_id)!.push(progression);
    }

    const participantsCount = perUserProgressions.size;
    const completionDurations: number[] = [];
    const stepDurationValues = new Map<string, number[]>();
    const stepCompletionCounts = new Map<string, Set<string>>();

    for (const step of orderedSteps) {
        stepDurationValues.set(step.id, []);
        stepCompletionCounts.set(step.id, new Set());
    }

    for (const [userId, userProgressions] of perUserProgressions.entries()) {
        const orderedUserProgressions = [...userProgressions].sort(
            (first, second) => first.created_at.getTime() - second.created_at.getTime()
        );

        const uniqueStepIds = new Set(orderedUserProgressions.map((progression) => progression.step_id));
        const isCompleted = orderedSteps.every((step) => uniqueStepIds.has(step.id));

        for (const progression of orderedUserProgressions) {
            if (huntStepIds.has(progression.step_id)) {
                stepCompletionCounts.get(progression.step_id)?.add(userId);
            }
        }

        if (isCompleted && orderedUserProgressions.length > 0) {
            const firstProgression = orderedUserProgressions[0];
            const lastProgression = orderedUserProgressions[orderedUserProgressions.length - 1];
            const completionDuration = lastProgression.updated_at.getTime() - firstProgression.created_at.getTime();

            if (completionDuration > 0) {
                completionDurations.push(completionDuration);
            }
        }

        for (const progression of orderedUserProgressions) {
            const duration = progression.updated_at.getTime() - progression.created_at.getTime();

            if (duration > 0 && stepDurationValues.has(progression.step_id)) {
                stepDurationValues.get(progression.step_id)!.push(duration);
            }
        }
    }

    const stepStats = orderedSteps.map((step) => ({
        id: step.id,
        title: step.title,
        index: step.index,
        averageDurationMs: average(stepDurationValues.get(step.id) ?? []),
        completionsCount: stepCompletionCounts.get(step.id)?.size ?? 0,
    }));

    const completedAttemptsCount = completionDurations.length;
    const averageCompletionTimeMs = average(completionDurations);
    const averageStepDurationMs = average(stepStats.flatMap((step) => (step.averageDurationMs === null ? [] : [step.averageDurationMs])));

    return {
        id: hunt.id,
        title: hunt.title,
        creator: {
            id: hunt.users.id,
            username: hunt.users.username,
        },
        culturalCenter: {
            id: hunt.cultural_centers.id,
            name: hunt.cultural_centers.name,
        },
        difficulty: {
            id: hunt.difficulty.id,
            name: hunt.difficulty.name,
        },
        totalSteps: hunt._count.steps,
        participantsCount,
        completedAttemptsCount,
        completionRate: participantsCount === 0 ? 0 : Math.round((completedAttemptsCount / participantsCount) * 100),
        averageCompletionTimeMs,
        averageStepDurationMs,
        stepStats,
    };
}

export class HuntServiceImpl implements HuntService {

    async createHunt(huntData: CreateHuntRequestDTO, userId: string, userCulturalCenterId:string ): Promise<CreateHuntResponseDTO> {
        try {
            const huntToCreate = {
                ...huntData,
                creator_id: userId,
                cultural_center_id: userCulturalCenterId
            };
            const hunt = await huntRepository.create(huntToCreate);
            return huntMapper.toCreateResponseDto(hunt);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la création de la chasse',
                statusCode: 500,
            });
        }
    }

    async getAllHunt(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightHuntDTO>> {
        try {
            const hunts = await huntRepository.getAll();
            return paginateArray(hunts.map(huntMapper.toLightDTO), pagination);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des chasses',
                statusCode: 500,
            });
        }
    }

    async editHunt(huntData: EditHuntRequestDTO, user: AuthResponseDTO): Promise<EditHuntResponseDTO> {
        try {
            const existingHunt = await huntRepository.getByID(huntData.id);
            if (!existingHunt) {
                throw new AppError({
                    userMessage: 'Chasse non trouvée',
                    statusCode: 404
                })
            }

            await assertUserCanAccessHunt(user, existingHunt, new UserRepository());
            const editedHunt = await huntRepository.edit(huntData);
            
            return huntMapper.toEditResponseDto(editedHunt)
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: 'Erreur lors de la modification de la chasse',
                statusCode: 500
            })
        }
    }

    async getHuntByCulturalCenter(id: string, user: AuthResponseDTO | undefined, pagination: PaginationParamsDTO, search: string, sort: string): Promise<PaginatedResponseDTO<LightHuntDTO>> {
        try {
            let items: LightHuntDTO[] = [];
            const rights = Array.isArray(user?.rights) ? user.rights : [];

            if (!user || rights.includes('USER')) {
                items = (await huntRepository.getByCulturalCenter(id)).map(huntMapper.toLightDTO);
            } else if (rights.includes('ADMIN')) {
                items = (await huntRepository.getAll()).map(huntMapper.toLightDTO);
            } else if (rights.includes('HUNT_MANAGER')) {
                items = (await huntRepository.getByCreator(user.id)).map(huntMapper.toLightDTO);
            } else if (rights.includes('CULTURAL_CENTER_MANAGER') && user.id_cultural_center) {
                items = (await huntRepository.getByCulturalCenter(user.id_cultural_center)).map(huntMapper.toLightDTO);
            } else {
                throw new AppError({
                    userMessage: "Vous n'avez pas les droits pour accéder aux chasses",
                    statusCode: 403,
                });
            }

            if (search) {
                items = items.filter(h => h.title.toLowerCase().includes(search.toLowerCase()));
            }

            items = items.sort((a, b) =>
                sort === "desc"
                    ? b.title.localeCompare(a.title)
                    : a.title.localeCompare(b.title)
            );

            return paginateArray(items, pagination);
        } catch (error) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des chasses',
                statusCode: error instanceof AppError ? error.statusCode : 500
            });
        }
    }

    async getHuntById(
        id: string
        ): Promise<FullHuntDTO | null> {
        try {
            const userRepository = new UserRepository();
            const hunt = await huntRepository.getByID(id);

            if (!hunt) {
            return null;
            }


            return huntMapper.toFullResponseDto(hunt);

        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError({
            userMessage: "Erreur lors de la récupération de la chasse",
            statusCode: 500,
            });
        }
    }

    async getDashboardStats(user: AuthResponseDTO): Promise<HuntDashboardStatsDTO> {
        try {
            const access = getAccessibleHuntsWhere(user);
            const hunts = await huntRepository.getStatsHunts(access.where);
            const huntIds = hunts.map((hunt) => hunt.id);
            const progressions = await progressionRepository.getProgressionsByHuntIds(huntIds) as StatsProgressionRecord[];

            const groupedProgressions = new Map<string, StatsProgressionRecord[]>();
            for (const progression of progressions) {
                if (!groupedProgressions.has(progression.hunt_id)) {
                    groupedProgressions.set(progression.hunt_id, []);
                }
                groupedProgressions.get(progression.hunt_id)!.push(progression);
            }

            const huntStats = hunts.map((hunt) => buildHuntStats(hunt, groupedProgressions.get(hunt.id) ?? []));

            const summaryCompletionDurations = huntStats
                .map((huntStat) => huntStat.averageCompletionTimeMs)
                .filter((value): value is number => typeof value === "number");

            const summaryStepDurations = huntStats
                .map((huntStat) => huntStat.averageStepDurationMs)
                .filter((value): value is number => typeof value === "number");

            return {
                scope: access.role,
                summary: {
                    huntsCount: huntStats.length,
                    participantsCount: huntStats.reduce((sum, huntStat) => sum + huntStat.participantsCount, 0),
                    completedAttemptsCount: huntStats.reduce((sum, huntStat) => sum + huntStat.completedAttemptsCount, 0),
                    averageCompletionTimeMs: average(summaryCompletionDurations),
                    averageStepDurationMs: average(summaryStepDurations),
                    averageCompletionRate: average(huntStats.map((huntStat) => huntStat.completionRate)),
                },
                hunts: huntStats,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: "Erreur lors de la récupération des statistiques des chasses",
                statusCode: 500,
            });
        }
    }

    async deleteHunt(user: AuthResponseDTO, ids: string[]): Promise<void> {
        try {
            const userRepository = new UserRepository();

            for (const id of ids) {
                const hunt = await huntRepository.getByID(id);

                if (!hunt) {
                    throw new AppError({
                        userMessage: "Chasse non trouvée",
                        statusCode: 404,
                    });
                }

                await assertUserCanAccessHunt(user, hunt, userRepository);

                await prisma.$transaction(async (tx: any) => {
                    const stepRepository = new StepRepository();
                    const indexRepository = new IndexRepository();
                    await stepRepository.deleteByHuntId(id, tx);
                    await indexRepository.deleteByHuntId(id, tx);
                    await huntRepository.delete(id, tx);
                });

                logger.info(`Hunt deleted successfully with ID: ${id}`, { huntId: id, deletedBy: user.id });
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: "Erreur lors de la suppression de la chasse",
                statusCode: 500,
            });
        }
    }
}