import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";

export interface CulturalCenterService {
    getAllActiveCulturalCenters(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllActiveCulturalCenterResponseDTO>>;
    getAllCulturalCenter(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllCulturalCenterResponseDTO>>;
    switchCulturalCenterStatus(ids: string[]): Promise<boolean>;
}