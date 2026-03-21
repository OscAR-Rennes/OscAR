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
import logger from "../../common-lib/utils/logger.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { FullHuntDTO } from "../../common-lib/dto/hunt/FullHuntDTO.js";
import { assertUserCanAccessHunt } from "../../common-lib/utils/assertCanAccessHunt.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import { StepRepository } from "../../common-lib/repositories/StepRepository.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";

const huntRepository = new HuntRepository();

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

    async getAllHunt(): Promise<LightHuntDTO[]> {
        try {
            const hunts = await huntRepository.getAll();
            return hunts.map(huntMapper.toLightDTO);
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

    async getHuntByCulturalCenter(id: string, user?: AuthResponseDTO): Promise<LightHuntDTO[]> {
        try {
            if (!user) {
                return (await huntRepository.getByCulturalCenter(id)).map(huntMapper.toLightDTO);
            }
            if (user.rights.includes('ADMIN')) {
                return (await huntRepository.getAll()).map(huntMapper.toLightDTO);
            }

            if (user.rights.includes('HUNT_MANAGER')) {
                return (await huntRepository.getByCreator(user.id)).map(huntMapper.toLightDTO);
            }

            if (
                user.rights.includes('CULTURAL_CENTER_MANAGER') &&
                user.id_cultural_center
            ) {
                return (await huntRepository.getByCulturalCenter(user.id_cultural_center)).map(huntMapper.toLightDTO);
            }

            throw new AppError({
                userMessage: "Vous n'avez pas les droits pour accéder aux chasses",
                statusCode: 403,
            });
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

    async deleteHunt(user: AuthResponseDTO, id: string): Promise<void> {
        try {
            const userRepository = new UserRepository();
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