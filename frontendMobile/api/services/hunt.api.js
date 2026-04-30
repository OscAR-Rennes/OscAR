import { apiClient } from '../apiClient';

export function getAllHunts() {
  return apiClient('/hunt');
}

export async function getHuntsByCulturalCenter(culturalCenterId) {
  const response = await apiClient(`/hunt/culturalcenter/${culturalCenterId}`);

  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

export function getHuntById(huntId) {
  return apiClient(`/hunt/getbyid/${huntId}`);
}