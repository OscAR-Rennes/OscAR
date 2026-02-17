import { CreateHuntRequestDTO } from "../common-lib/dto/hunt/CreateHuntRequestDTO.js";
import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntRequestDTO } from "../common-lib/dto/hunt/EditHuntRequestDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { GetAllHuntResponseDTO } from "../common-lib/dto/hunt/GetAllHuntResponseDTO.js";

export interface HuntService {
  createHunt(huntData: CreateHuntRequestDTO, userId: string, userCulturalCenterId: string): Promise<CreateHuntResponseDTO>;
  getAllHunt(): Promise<GetAllHuntResponseDTO[]>;
  editHunt(huntData: EditHuntRequestDTO, userId: string, userRights: string[]): Promise<EditHuntResponseDTO>;
}