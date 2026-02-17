import { HuntService } from "../HuntService.js";
import { CreateHuntRequestDTO } from "../../common-lib/dto/hunt/CreateHuntRequestDTO.js";
import { CreateHuntResponseDTO } from "../../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { huntMapper } from "../../mapper/HuntsMapper.js";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { GetAllHuntResponseDTO } from "../../common-lib/dto/hunt/GetAllHuntResponseDTO.js";
import { EditHuntRequestDTO } from "../../common-lib/dto/hunt/EditHuntRequestDTO.js";

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

    async getAllHunt(): Promise<GetAllHuntResponseDTO[]> {
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

    async editHunt(huntData: EditHuntRequestDTO, userId: string, userRights: string[]) {
        try {

            const existingHunt = await huntRepository.getByID(huntData.id);
            if (!existingHunt) {
                throw new AppError({
                    userMessage: 'Chasse non trouvée',
                    statusCode: 404
                })
            }
            const hasRights =
                existingHunt.creator_id === userId ||
                userRights.includes('ADMIN') ||
                (userRights.includes('CULTURAL_CENTER_MANAGER') && existingHunt.cultural_center_id === userId);

            if (!hasRights) {
                throw new AppError({
                userMessage: 'Vous n\'avez pas les droits pour modifier cette chasse',
                statusCode: 403,
                });
            }

            const editedHunt = await huntRepository.edit(huntData);
            return huntMapper.toEditResponseDto(editedHunt)
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la modification de la chasse',
                statusCode: 500
            })
        }
    }
}