import { apiClient } from '../apiClient';

export function getActiveCulturalCenter() {
  return apiClient('/culturalcenter/active');
}

export function getCulturalCenterById(id) {
  return apiClient(`/culturalcenter/active/getById/${id}`);
}
