import { cultural_centers } from "@prisma/client";
import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";

export const culturalCenterMapper = {
    toLightDTO(culturalCenter: cultural_centers) {  
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            isActive: culturalCenter.isActive
        };
    },

    toLightWithouActiveDTO(culturalCenter: any): GetAllActiveCulturalCenterResponseDTO {
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            address: {
                longitude: culturalCenter.address.longitude,
                latitude: culturalCenter.address.latitude
            },
            description: culturalCenter.description,
            picture_path: culturalCenter.picture_path
        }
    }
};