import { AppError } from "../../common-lib/errors/AppError.js";
import { IndexService } from "../IndexService.js";
import { IndexRepository } from "../../common-lib/repositories/IndexRepository.js";
import { CreateIndexRequestDTO } from "../../common-lib/dto/index/CreateIndexRequestDTO.js";
import { CreateIndexResponseDTO } from "../../common-lib/dto/index/CreateIndexResponseDTO.js";
import { indexMapper } from "../../mapper/IndexMapper.js";
import { GetIndexByHuntResponseDTO } from "../../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import logger from "../../common-lib/utils/logger.js";

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

    async deleteIndex(indexId: string): Promise<void> {
        try {
            await indexRepository.delete(indexId);
        } catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la suppression de l\'index',
                statusCode: 500,
            });
        }
    }
}