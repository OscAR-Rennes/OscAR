
import { pool } from "../../common-lib/config/database";
import { GetAllActiveCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO";
import { GetAllCulturalCenterResponseDTO } from "../../common-lib/dto/culturalcenter/GetAllCulturalCenterResponseDTO";
import { SwitchStatusCulturalCenterRequestDTO } from "../../common-lib/dto/culturalcenter/SwitchStatusCulturalCenterRequestDTO";
import { AppError } from "../../common-lib/errors/AppError";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository";
import { UserRepository } from "../../common-lib/repositories/UsersRepository";
import { culturalCenterMapper } from "../../mapper/CulturalCenterMapper";
import { CulturalCenterService } from "../CulturalCenterService";

const culturalCenterRepository = new CulturalCenterRepository();
const userRepository = new UserRepository();

export class CulturalCenterServiceImpl implements CulturalCenterService {
    async getAllActiveCulturalCenters(): Promise<GetAllActiveCulturalCenterResponseDTO[]> {
        try {
            const culturalCenters = await culturalCenterRepository.getAllActive();
            return culturalCenters.map(culturalCenterMapper.toLightWithouActiveDTO);
        }
        catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des centres culturels actifs',
                statusCode: 500,
            });
        }
    }

    async getAllCulturalCenter(): Promise<GetAllCulturalCenterResponseDTO[]> {
        try {
            const culturalCenters = await culturalCenterRepository.getAll();
            return culturalCenters.map(culturalCenterMapper.toLightDTO)
        }
        catch (error: any) {
            throw new AppError({
                userMessage: 'Erreur lors de la récupération des centres culturels',
                statusCode: 500,
            });
        }
    }

    async switchCulturalCenterStatus(ids: SwitchStatusCulturalCenterRequestDTO): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const centers = await culturalCenterRepository.switchCulturalCenterStatus(ids);

            for (const center of centers) {
            const centerId = center.id;

            if (center.isActive === false) {
                await userRepository.deactivateUsersByCenter(centerId);
            } else {
                await userRepository.activateManagersByCenter(centerId);
            }
            }

            await client.query("COMMIT");
            return true;

        } catch (err) {
            await client.query("ROLLBACK");
            throw new AppError({
            userMessage: "Erreur lors du changement de statut des centres culturels",
            statusCode: 500,
            });
        } finally {
            client.release();
        }
    }
}