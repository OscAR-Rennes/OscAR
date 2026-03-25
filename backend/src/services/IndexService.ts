import { CreateIndexResponseDTO } from "../common-lib/dto/index/CreateIndexResponseDTO.js";
import { CreateIndexRequestDTO } from "../common-lib/dto/index/CreateIndexRequestDTO.js";
import { GetIndexByHuntResponseDTO } from "../common-lib/dto/index/GetIndexByHuntResponseDTO.js";
import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";
import { EditIndexRequestDTO } from "../common-lib/dto/index/EditIndexRequestDTO.js";
import { EditIndexResponseDTO } from "../common-lib/dto/index/EditIndexResponseDTO.js";

export interface IndexService {
  createIndex(indexData: CreateIndexRequestDTO): Promise<CreateIndexResponseDTO>;
  editIndex(indexData: EditIndexRequestDTO, user: AuthResponseDTO): Promise<EditIndexResponseDTO>;
  getIndexByHunt(huntId: string, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetIndexByHuntResponseDTO>>;
  deleteIndex(user: AuthResponseDTO, indexIds: string[]): Promise<void>;
}