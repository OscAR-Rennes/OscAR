import { HuntService } from "../HuntService";
import { CreateHuntRequestDTO } from "../../common-lib/dto/hunt/CreateHuntRequestDTO";
import { CreateHuntResponseDTO } from "../../common-lib/dto/hunt/CreateHuntResponseDTO";
import { huntMapper } from "../../mapper/HuntsMapper";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository";
import { AppError } from "../../common-lib/errors/AppError";
import { GetAllHuntResponseDTO } from "../../common-lib/dto/hunt/GetAllHuntResponseDTO";
import { EditHuntRequestDTO } from "../../common-lib/dto/hunt/EditHuntRequestDTO";

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
            const huntDTO: CreateHuntResponseDTO = huntMapper.toCreateResponseDto(hunt);
            return huntDTO;
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
            existingHunt.creator_id === userId || userRights.includes('ADMIN') || (userRights.includes('CULTURAL_CENTER_MANAGER') && existingHunt.cultural_center_id === userId) ? null :
            (() => { throw new AppError({
                userMessage: 'Vous n\'avez pas les droits pour modifier cette chasse',
                statusCode: 403
            })})()

            const editedHunt = await huntRepository.edit(huntData, userId, userRights)
            return huntMapper.toEditResponseDto(editedHunt)
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la modification de la chasse',
                statusCode: 500
            })
        }
    }
}