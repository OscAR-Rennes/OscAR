import { CreateIndexResponseDTO } from "../common-lib/dto/index/CreateIndexResponseDTO.js";
import { CreateIndexRequestDTO } from "../common-lib/dto/index/CreateIndexRequestDTO.js";
import { GetIndexByHuntResponseDTO } from "../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import { GetIndexByHuntRequestDTO } from "../common-lib/dto/index/GetIndexByHuntRequestDTO.js"

export interface IndexService {
  createIndex(indexData: CreateIndexRequestDTO): Promise<CreateIndexResponseDTO>;
  getIndexByHunt(huntId: string): Promise<GetIndexByHuntResponseDTO[]>;
}