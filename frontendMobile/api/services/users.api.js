import { apiClient } from '../apiClient';

export function addUser(userData) {
  return apiClient('/users/mobile', { method: 'POST', body: userData });
}

export function getUserById(id) {
    return apiClient(`/users/getById/${id}`)
}
