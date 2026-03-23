import { apiClient } from '../apiClient';

function toPaginationQuery(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 15;
  return `?page=${page}&limit=${limit}`;
}

export function addStep(stepData) {
  return apiClient('/step', { method: 'POST', body: stepData });
}

export function getStepsByCulturalCenter(params = {}) {
  return apiClient(`/step/culturalcenter${toPaginationQuery(params)}`);
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

