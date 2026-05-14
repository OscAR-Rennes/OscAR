import { apiClient } from '../apiClient';

function toPaginationQuery(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 15;
  
  const query = new URLSearchParams({ page, limit });
  
  if (params.search) query.append("search", params.search);
  if (params.sort) query.append("sort", params.sort);
  
  return `?${query.toString()}`;
}

export function addUser(userData) {
  return apiClient('/users/web', { method: 'POST', body: userData });
}

export function getAllUsers(params = {}) {
  return apiClient(`/users${toPaginationQuery(params)}`);
}

export function getUsersByCulturalCenter(params = {}) {
  return apiClient(`/users/culturalcenter${toPaginationQuery(params)}`)
}

export function activateDeactivateUsers(ids) {
  return apiClient('/users/switchactivation', {method: 'PUT', body: {ids}})
}