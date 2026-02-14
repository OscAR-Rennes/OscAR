import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO";
import { GetAllCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO";
import { SwitchStatusCulturalCenterRequestDTO } from "../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO";

export interface CulturalCenterService {
    getAllActiveCulturalCenters(): Promise<GetAllActiveCulturalCenterResponseDTO[]>;
    getAllCulturalCenter(): Promise<GetAllCulturalCenterResponseDTO[]>;
    switchCulturalCenterStatus(ids: SwitchStatusCulturalCenterRequestDTO): Promise<boolean>;
}