import { FullCulturalCenterDTO } from "../common-lib/dto/culturalcenter/FullCulturalCenterDTO.js";
import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
 
export interface CulturalCenterService {
    getAllActiveCulturalCenters(): Promise<GetAllActiveCulturalCenterResponseDTO[]>;
    getAllCulturalCenter(): Promise<GetAllCulturalCenterResponseDTO[]>;
    switchCulturalCenterStatus(ids: string[]): Promise<boolean>;
    getActiveById(id: String):Promise<FullCulturalCenterDTO>;
}