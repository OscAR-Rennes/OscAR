import { apiClient } from '../apiClient';

function toPaginationQuery(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 15;
  return `?page=${page}&limit=${limit}`;
}

export function getActiveCulturalCenter(params = {}) {
  return apiClient(`/culturalcenter/active${toPaginationQuery(params)}`);
}

export function getAllCulturalCenters(params = {}) {
  return apiClient(`/culturalcenter${toPaginationQuery(params)}`);
}

export function activateDeactivateCulturalCenter(ids) {
  return apiClient('/culturalcenter/switchactivation', {method: 'PUT', body: {ids}})
}