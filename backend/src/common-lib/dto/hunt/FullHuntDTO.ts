import { LightStepDTO } from "../step/LightStepDTO.js";

export interface FullHuntDTO {
  id: string;
  title: string;
  description: string;
  culturalCenter: {
    id: string,
    name: string
  }
  difficulty: {
    id: string;
    name: string;
  };
  isActive: boolean;
  points: number;
  latitude: number;
  longitude: number;
  pictureUrl: string | null;
  creator: {
    id: string;
    username: string;
  };
  steps: {
    id: string,
    title: string;
  }[];
}