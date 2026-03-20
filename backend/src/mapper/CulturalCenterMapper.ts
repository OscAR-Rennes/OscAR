import { cultural_centers } from "@prisma/client";
import { GetMapCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetMapCulturalCenterResponseDTO.js";
type CulturalCenterMapEntity = Pick<cultural_centers, "id" | "name" | "description" | "picture_path"> & {
    address: {
        latitude: number;
        longitude: number;
    };
};
import { GetAllActiveCulturalCenterResponseDTO } from "../common-lib/dto/culturalcenter/GetAllActiveCulturalCenterResponseDTO.js";
import { FullCulturalCenterDTO } from "../common-lib/dto/culturalcenter/FullCulturalCenterDTO.js";

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
    },

    toFullResponse(culturalCenter: any): FullCulturalCenterDTO {
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            description: culturalCenter.description,
            picture_path: culturalCenter.picture_path ?? undefined,
            isActive: culturalCenter.isActive,
            address: {
                longitude: culturalCenter.address.longitude,
                latitude: culturalCenter.address.latitude
            }
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