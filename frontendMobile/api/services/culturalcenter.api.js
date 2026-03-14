import { apiClient } from '../apiClient';

export function getActiveCulturalCenter() {
  return apiClient('/culturalcenter/active');
}

export function getAllCulturalCenters() {
  return apiClient('/culturalcenter')
}

export function activateDeactivateCulturalCenter(ids) {
  return apiClient('/culturalcenter/switchactivation', {method: 'PUT', body: {ids}})
}