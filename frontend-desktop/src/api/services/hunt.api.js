import { apiClient } from '../apiClient';

export function addHunt(huntData) {
  return apiClient('/hunt', { method: 'POST', body: huntData });
}

export function getAllHunts() {
  return apiClient('/hunt');
}

export function getHuntsByCulturalCenter(culturalCenterId) {
  return apiClient(`/hunt/culturalcenter/${culturalCenterId}`);
}

export function getHuntById(huntId) {
  return apiClient(`/hunt/getbyid/${huntId}`);
}

export function editHunt(huntId, huntData) {
  return apiClient(`/hunt/edit/${huntId}`, { method: 'PUT', body: huntData });
}