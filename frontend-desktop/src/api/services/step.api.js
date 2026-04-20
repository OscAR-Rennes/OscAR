import { apiClient } from '../apiClient';


function toPaginationQuery(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 15;
  return `?page=${page}&limit=${limit}`;
}

export function addStep(stepData, modelFile, imageFile) {
  const formData = new FormData();

  formData.append('title', stepData.title);
  formData.append('description', stepData.description);
  formData.append('points', String(stepData.points));
  formData.append('hunt_id', stepData.hunt_id);
  if (stepData.latitude) formData.append('latitude', String(stepData.latitude));
  if (stepData.longitude) formData.append('longitude', String(stepData.longitude));
  if (stepData.index_id) formData.append('index_id', stepData.index_id);

  if (modelFile) formData.append('model_file', modelFile);
  if (imageFile) formData.append('image_file', imageFile);

  return apiClient('/step', { method: 'POST', body: formData });
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

