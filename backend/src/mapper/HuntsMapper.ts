import { CreateHuntResponseDTO } from "../common-lib/dto/hunt/CreateHuntResponseDTO.js";
import { EditHuntResponseDTO } from "../common-lib/dto/hunt/EditHuntResponseDTO.js";
import { FullHuntDTO } from "../common-lib/dto/hunt/FullHuntDTO.js";
import { LightHuntDTO } from "../common-lib/dto/hunt/LightHuntDTO.js";
import { hunts } from "@prisma/client";

export const huntMapper = {

  toCreateResponseDto(entity: hunts): CreateHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title
    };
  },

  toLightDTO(entity: hunts): LightHuntDTO {
      return {
        id: entity.id,
        title: entity.title,
        description: entity.description
      };
    },

  toEditResponseDto(entity: hunts): EditHuntResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      difficulty_id: entity.difficulty_id,
      points: entity.points,
      latitude: entity.latitude,
      longitude: entity.longitude,
      picture_path: entity.picture_path ?? null,
    };
  },

  toFullResponseDto(entity: hunts & {
    users: { id: string; username: string };
    difficulty: { id: string; name: string };
    cultural_centers: {id: string, name: string}
    steps: { id: string; title: string }[];
  }): FullHuntDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,

      culturalCenter: {
        id: entity.cultural_centers.id,
        name: entity.cultural_centers.name
      },

      difficulty: {
        id: entity.difficulty.id,
        name: entity.difficulty.name,
      },

      isActive: entity.isactive,
      points: entity.points,
      latitude: entity.latitude,
      longitude: entity.longitude,
      pictureUrl: entity.picture_path ?? null,

      creator: {
        id: entity.users.id,
        username: entity.users.username,
      },

      steps: entity.steps.map(step => ({
        id: step.id,
        title: step.title,
      })),
    };
  }

};