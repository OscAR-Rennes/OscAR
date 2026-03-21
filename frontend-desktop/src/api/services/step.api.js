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

export function editStep(stepId, stepData) {
  return apiClient(`/step/edit/${stepId}`, { method: 'PUT', body: stepData });
}

export function deleteStep(stepId) {
  return apiClient(`/step/${stepId}`, { method: 'DELETE' });
}

