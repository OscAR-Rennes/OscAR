import { CulturalCenterEntity } from "../common-lib/entity/CulturalCenterEntity.js";

export const culturalCenterMapper = {
    toLightDTO(culturalCenter: CulturalCenterEntity) {  
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            isActive: culturalCenter.isActive
        };
    },

    toLightWithouActiveDTO(culturalCenter: CulturalCenterEntity) {
        return {
            id: culturalCenter.id,
            name: culturalCenter.name,
            isActive: culturalCenter.isActive
        }
    }
};