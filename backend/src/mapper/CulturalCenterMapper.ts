import { cultural_centers } from "@prisma/client";
import { GetMapCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetMapCulturalCenterResponseDTO.js";

type CulturalCenterMapEntity = Pick<cultural_centers, "id" | "name" | "description" | "picture_path"> & {
    address: {
        latitude: number;
        longitude: number;
    };
};

export const culturalCenterMapper = {
    toLightDTO(culturalCenter: cultural_centers) {  
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            isActive: culturalCenter.isActive
        };
    },

    toLightWithouActiveDTO(culturalCenter: cultural_centers) {
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            isActive: culturalCenter.isActive
        }
    },

    toMapDTO(culturalCenter: CulturalCenterMapEntity): GetMapCulturalCenterResponseDTO {
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            description: culturalCenter.description,
            picture_path: culturalCenter.picture_path,
            latitude: culturalCenter.address.latitude,
            longitude: culturalCenter.address.longitude,
        };
    }
};