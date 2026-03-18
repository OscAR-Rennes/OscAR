import { apiClient } from '../apiClient';

export function getStepsByCulturalCenter() {
  return apiClient(`/step/culturalcenter`);
}

export function getStepById(stepId) {
  return apiClient(`/step/getById/${stepId}`);
}

export function getStepByHunt(huntId) {
  return apiClient(`/step/getByHunt/${huntId}`)
}
