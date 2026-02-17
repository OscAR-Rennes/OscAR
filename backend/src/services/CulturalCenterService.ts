import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { GetAllCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO.js";
import { SwitchStatusCulturalCenterRequestDTO } from "../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO.js";

export interface CulturalCenterService {
    getAllActiveCulturalCenters(): Promise<GetAllActiveCulturalCenterResponseDTO[]>;
    getAllCulturalCenter(): Promise<GetAllCulturalCenterResponseDTO[]>;
    switchCulturalCenterStatus(ids: string[]): Promise<boolean>;
}