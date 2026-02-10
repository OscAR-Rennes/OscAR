import { HuntService } from "../HuntService";
import { CreateHuntRequestDTO } from "../../common-lib/dto/hunt/CreateHuntRequestDTO";
import { CreateHuntResponseDTO } from "../../common-lib/dto/hunt/CreateHuntResponseDTO";
import { huntMapper } from "../../mapper/HuntsMapper";
import { HuntRepository } from "../../common-lib/repositories/HuntRepository";
import { AppError } from "../../common-lib/errors/AppError";
import { GetAllHuntResponseDTO } from "../../common-lib/dto/hunt/GetAllHuntResponseDTO";

const huntRepository = new HuntRepository();

export class HuntServiceImpl implements HuntService {

    async createHunt(huntData: CreateHuntRequestDTO, userId: string): Promise<CreateHuntResponseDTO> {
        try {
            const huntToCreate = {
                ...huntData,
                creator_id: userId,
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
}