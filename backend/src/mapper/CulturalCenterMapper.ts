import { cultural_centers } from "@prisma/client";

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
    }
};