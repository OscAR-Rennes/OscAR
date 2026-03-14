import { apiClient } from '../apiClient';

export function addStep(stepData) {
  return apiClient('/step', { method: 'POST', body: stepData });
}

export function getStepsByCulturalCenter() {
  return apiClient(`/step/culturalcenter`);
}

export function getStepById(stepId) {
  return apiClient(`/step/getById/${stepId}`);
}

