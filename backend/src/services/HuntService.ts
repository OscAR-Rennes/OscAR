import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { CreateHuntRequestDTO } from "../common-lib/dto/hunt/CreateHuntRequestDTO.js";
import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntRequestDTO } from "../common-lib/dto/hunt/EditHuntRequestDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { LightHuntDTO } from "../common-lib/dto/hunt/LightHuntDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";

export interface HuntService {
  createHunt(huntData: CreateHuntRequestDTO, userId: string, userCulturalCenterId: string): Promise<CreateHuntResponseDTO>;
  getAllHunt(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightHuntDTO>>;
  getHuntByCulturalCenter(user: AuthResponseDTO, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightHuntDTO>>;
  editHunt(huntData: EditHuntRequestDTO, userId: string, userRights: string[]): Promise<EditHuntResponseDTO>;
  getHuntById(user: AuthResponseDTO, id: string): Promise<LightHuntDTO | null>;
  deleteHunt(user: AuthResponseDTO, id: string): Promise<void>;
}