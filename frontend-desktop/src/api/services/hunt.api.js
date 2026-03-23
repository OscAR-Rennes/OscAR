import { apiClient } from '../apiClient';

function toPaginationQuery(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 15;
  return `?page=${page}&limit=${limit}`;
}

export function addHunt(huntData) {
  return apiClient('/hunt', { method: 'POST', body: huntData });
}

export function getAllHunts(params = {}) {
  return apiClient(`/hunt${toPaginationQuery(params)}`);
}

export function getHuntsByCulturalCenter(culturalCenterId, params = {}) {
  return apiClient(`/hunt/culturalcenter/${culturalCenterId}${toPaginationQuery(params)}`);
}

export function getHuntById(huntId) {
  return apiClient(`/hunt/getbyid/${huntId}`);
}

export function editHunt(huntId, huntData) {
  return apiClient(`/hunt/edit/${huntId}`, { method: 'PUT', body: huntData });
}

export function deleteHunt(huntId) {
  return apiClient(`/hunt/${huntId}`, { method: 'DELETE' });
}