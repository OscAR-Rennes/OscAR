import { apiClient } from '../apiClient';

export function addHunt(huntData) {
  return apiClient('/hunt', { method: 'POST', body: huntData });
}

export function getAllHunts() {
  return apiClient('/hunt');
}

export function getHuntsByCulturalCenter() {
  return apiClient(`/hunt/culturalcenter`);
}

export function getHuntById(huntId) {
  return apiClient(`/hunt/getbyid/${huntId}`);
}