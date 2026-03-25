import { FullCulturalCenterDTO } from "../common-lib/dto/culturalcenter/FullCulturalCenterDTO.js";
import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { PaginationParamsDTO } from "../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../common-lib/dto/common/PaginatedResponseDTO.js";
import { GetMapCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetMapCulturalCenterResponseDTO.js";
import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
export interface CulturalCenterService {
    getAllActiveCulturalCenters(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllActiveCulturalCenterResponseDTO>>;
    getAllActiveCulturalCentersForMap(pagination: PaginationParamsDTO, filters: { search?: string; minLat?: number; maxLat?: number; minLng?: number; maxLng?: number }): Promise<PaginatedResponseDTO<GetMapCulturalCenterResponseDTO>>;
    getAllCulturalCenter(pagination: PaginationParamsDTO): Promise<PaginatedResponseDTO<GetAllCulturalCenterResponseDTO>>;
    switchCulturalCenterStatus(ids: string[]): Promise<boolean>;
    deleteCulturalCenters(user: AuthResponseDTO, ids: string[]): Promise<void>;
    getActiveById(id: string): Promise<FullCulturalCenterDTO>;
}