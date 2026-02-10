import { AppError } from "../../common-lib/errors/AppError";
import { IndexService } from "../IndexService";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository";
import { CreateIndexRequestDTO } from "../../common-lib/dto/index/CreateIndexRequestDTO";
import { CreateIndexResponseDTO } from "../../common-lib/dto/index/CreateIndexResponseDTO";
import { indexMapper } from "../../mapper/IndexMapper";
import { GetIndexByHuntRequestDTO } from "../../common-lib/dto/index/GetIndexByHuntRequestDTO";
import { GetIndexByHuntResponseDTO } from "../../common-lib/dto/index/GetIndexByHuntResponseDTO";

const indexRepository = new IndexRepository();

export class IndexServiceImpl implements IndexService {

    async createIndex(indexData: CreateIndexRequestDTO): Promise<CreateIndexResponseDTO> {
        try {
            const index = await indexRepository.create(indexData);
            return indexMapper.toCreateResponseDto(index);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la création de l\'index',
                statusCode: 500,
            });
        }
    }

    async getIndexByHunt(huntId: string): Promise<GetIndexByHuntResponseDTO[]> {
        try {
            const indexes = await indexRepository.getByHuntID(huntId);
            return indexes.map(indexMapper.toLightDTO);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des index de la chasse',
                statusCode: 500,
            });
        }
    }
}