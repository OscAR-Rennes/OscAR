import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";
import { AddProgressionRequestDTO } from "../common-lib/dto/progression/AddProgressionRequestDTO.js";
import { GetProgressionDTO } from "../common-lib/dto/progression/GetProgressionDTO.js";

export interface ProgressionService {
    saveProgression(data: AddProgressionRequestDTO ,userData: AuthResponseDTO): Promise<void>;
    getTotalProgression(user: AuthResponseDTO): Promise<GetProgressionDTO[]>
    getProgressionByHunt(user: AuthResponseDTO, id: string): Promise<GetProgressionDTO>
}