import { apiClient } from '../apiClient';

export function addUser(userData) {
  return apiClient('/users/web', { method: 'POST', body: userData });
}

export function getAllUsers() {
  return apiClient('/users');
}

export function getUsersByCulturalCenter() {
  return apiClient(`/users/culturalcenter`)
}

export function activateDeactivateUsers(ids) {
  return apiClient('/users/switchactivation', {method: 'PUT', body: {ids}})
}