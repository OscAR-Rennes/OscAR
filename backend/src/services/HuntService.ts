import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { CreateHuntRequestDTO } from "../common-lib/dto/hunt/CreateHuntRequestDTO.js";
import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntRequestDTO } from "../common-lib/dto/hunt/EditHuntRequestDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { FullHuntDTO } from "../common-lib/dto/hunt/FullHuntDTO.js";
import { LightHuntDTO } from "../common-lib/dto/hunt/LightHuntDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";

export interface HuntService {
  createHunt(huntData: CreateHuntRequestDTO, userId: string, userCulturalCenterId: string): Promise<CreateHuntResponseDTO>;
  getAllHunt(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightHuntDTO>>;
  getHuntByCulturalCenter(id: string, user: AuthResponseDTO | undefined, pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<LightHuntDTO>>;
  editHunt(huntData: EditHuntRequestDTO, user: AuthResponseDTO): Promise<EditHuntResponseDTO>;
  getHuntById(id: string): Promise<FullHuntDTO | null>;
  deleteHunt(user: AuthResponseDTO, ids: string[]): Promise<void>;
}