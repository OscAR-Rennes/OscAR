import { CreateStepResponseDTO } from "../common-lib/dto/step/CreateStepResponseDTO.js";
import { EditStepResponseDTO } from "../common-lib/dto/step/EditStepResponseDTO.js";
import { steps } from "@prisma/client";
import { LightStepDTO } from "../common-lib/dto/step/LightStepDTO.js";
import { FullStepDTO } from "../common-lib/dto/step/FullStepDTO.js";

export const stepMapper = {

  toCreateResponseDto(entity: steps): CreateStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: steps): LightStepDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        points: entity.points
      };
    },

  toEditResponseDto(entity: steps): EditStepResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      points: entity.points,
      latitude: entity.latitude,
      longitude: entity.longitude,
      hunt_id: entity.hunt_id,
      index_id: entity.index_id,
    };
  },

  toFullResponseDto(entity: any): FullStepDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      points: entity.points,
      latitude: entity.latitude,
      longitude: entity.longitude,

      hunt: {
        id: entity.hunts.id,
        title: entity.hunts.title,
        culturalCenter: {
          id: entity.hunts.cultural_centers.id,
          name: entity.hunts.cultural_centers.name
        },
        creator: {
          id: entity.hunts.users.id,
          username: entity.hunts.users.username
        }
      },

      index: {
        id: entity.index.id,
        name: entity.index.name,
        index: entity.index.index
      }
    };
  }
};