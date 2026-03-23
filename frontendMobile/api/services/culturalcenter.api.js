import { apiClient } from '../apiClient';

export async function getActiveCulturalCenter() {
  return apiClient('/culturalcenter/active');
}

export async function getActiveCulturalCenterMap() {
  return apiClient('/culturalcenter/active/map');
}

export async function getActiveCulturalCenterMapByBounds({ minLat, maxLat, minLng, maxLng, limit = 200 }) {
  const query = new URLSearchParams({
    minLat: String(minLat),
    maxLat: String(maxLat),
    minLng: String(minLng),
    maxLng: String(maxLng),
    limit: String(limit),
  });

  return apiClient(`/culturalcenter/active/map?${query.toString()}`);
}

export function getCulturalCenterById(id) {
  return apiClient(`/culturalcenter/active/getById/${id}`);
}
