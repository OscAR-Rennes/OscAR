import { StepService } from "../StepService.js";
import { CreateStepRequestDTO } from "../../common-lib/dto/step/CreateStepRequestDTO.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { stepMapper } from "../../mapper/StepMapper.js";
import { CreateStepResponseDTO } from "../../common-lib/dto/step/CreateStepResponseDTO.js";
import { EditStepRequestDTO } from "../../common-lib/dto/step/EditStepRequestDTO.js";
import { EditStepResponseDTO } from "../../common-lib/dto/step/EditStepResponseDTO.js";
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
import { FileUploadUtil } from "../../common-lib/utils/fileUpload.js";
import { StepArRepository } from "../../common-lib/repositories/StepArRepository.js";
import { downloadFromMinio } from "../../common-lib/utils/getMinioUrl.js";
import archiver from "archiver";

const stepRepository = new StepRepository();
const stepArRepository = new StepArRepository();

export class StepServiceImpl implements StepService {

    async createStep(stepData: any , imageFile?: Express.Multer.File, modelFile?: Express.Multer.File): Promise<CreateStepResponseDTO> {
        try {

            const fileUploadUtil = new FileUploadUtil();

            let targetPath: string | undefined;
            let objectPaths: { obj: string, mtl: string, jpg: string } | undefined;

            if (imageFile) {
                targetPath = await fileUploadUtil.uploadTarget(imageFile);
            }

            if (modelFile) {
                objectPaths = await fileUploadUtil.uploadObjectZip(modelFile);
            }

            const indexRepository = new IndexRepository();
            if (!stepData.index_id) {
                const index = await indexRepository.createIncrementEmpty(stepData.hunt_id);
                stepData.index_id = index.id;
            }

            const cleanData = {
                ...stepData,
                points: Number(stepData.points),
                latitude: stepData.latitude ? Number(stepData.latitude) : 0,
                longitude: stepData.longitude ? Number(stepData.longitude) : 0,
            };

            const createdStep = await stepRepository.create(cleanData);

            const stepArData = {
                step_id: createdStep.id,
                file_path_target: targetPath,
                file_path_object: objectPaths?.obj,
                file_path_mtl: objectPaths?.mtl,
                file_path_jpg: objectPaths?.jpg,
            }

            await stepArRepository.create(stepArData);

            return stepMapper.toCreateResponseDto(createdStep);

        } catch (error: any) {
            logger.error(`Error creating step: ${error.message}`, { error, stepData });
            throw new AppError({
                userMessage: "Erreur lors de la création de l'étape",
                statusCode: 500,
            });
        }
    }

    async editStep(stepData: EditStepRequestDTO, user: AuthResponseDTO): Promise<EditStepResponseDTO> {
        try {
            const userRepository = new UserRepository();
            const indexRepository = new IndexRepository();
            const existingStep = await stepRepository.getById(stepData.id);

            if (!existingStep) {
                throw new AppError({
                    userMessage: "Étape non trouvée",
                    statusCode: 404,
                });
            }

            await assertUserCanAccessHunt(user, existingStep.hunts, userRepository);

            if (stepData.index_id) {
                const targetIndex = await indexRepository.getByIdWithHunt(stepData.index_id);

                if (!targetIndex || targetIndex.hunt_id !== existingStep.hunt_id) {
                    throw new AppError({
                        userMessage: "L'index cible est invalide pour cette étape",
                        statusCode: 400,
                    });
                }
            }

            const editedStep = await stepRepository.edit(stepData);
            return stepMapper.toEditResponseDto(editedStep);
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError({
                userMessage: "Erreur lors de la modification de l'étape",
                statusCode: 500,
            });
        }
    }

    async deleteStep(user: AuthResponseDTO, stepIds: string[]): Promise<void> {
        try {
            const userRepository = new UserRepository();

            for (const stepId of stepIds) {
                const step = await stepRepository.getByIdWithHunt(stepId);
                if (!step) {
                    throw new AppError({
                        userMessage: "Étape non trouvée",
                        statusCode: 404,
                    });
                }

                await assertUserCanAccessHunt(user, step.hunts, userRepository);

                await prisma.$transaction(async (tx: any) => {
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
            }
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
    id: string
    ): Promise<FullStepDTO | null> {
    try {
        const step = await stepRepository.getById(id);

        if (!step) {
            return null;
        }
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

    async getStepsByHunt(id: string): Promise<LightStepDTO[]> {
        try {
            const steps = await stepRepository.getStepsByHuntId(id);
            return steps.map(stepMapper.toLightDTO);
        } catch (error) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des étapes par chasse',
                statusCode: 500,
            });
        }
    }

    async downloadStepAr(stepId: string): Promise<{ fileBuffer: Buffer; fileName: string }> {
        const stepAr = await stepArRepository.findFirst(stepId);
        if (!stepAr) throw new Error("StepAR not found");

        const objBuffer = await downloadFromMinio(stepAr.file_path_object);
        const mtlBuffer = stepAr.file_path_mtl ? await downloadFromMinio(stepAr.file_path_mtl) : null;
        const jpgBuffer = stepAr.file_path_jpg ? await downloadFromMinio(stepAr.file_path_jpg) : null;

        const archive = archiver("zip");

        const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            archive.on("data", (chunk) => chunks.push(chunk));
            archive.on("end", () => resolve(Buffer.concat(chunks)));
            archive.on("error", reject);

            archive.append(objBuffer, { name: "model.obj" });
            if (mtlBuffer) archive.append(mtlBuffer, { name: "model.mtl" });
            if (jpgBuffer) archive.append(jpgBuffer, { name: "texture.jpg" });

            archive.finalize();
        });

        return {
            fileBuffer,
            fileName: `step_ar_${stepId}.zip`,
        };
    }

    async downloadStepTarget(stepId: string): Promise<{ fileBuffer: Buffer; fileName: string }> {
        
        const stepAr = await stepArRepository.findFirst(stepId);

        if (!stepAr) throw new Error("StepAR not found");

        const fileBuffer = await downloadFromMinio(stepAr.file_path_target);
        const ext = stepAr.file_path_target.split(".").pop() ?? "bin";

        return {
            fileBuffer,
            fileName: `step_target_${stepId}.${ext}`,
        };
    }
    
}