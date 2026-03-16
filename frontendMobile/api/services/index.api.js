import { apiClient } from '../apiClient';

export function getAllIndexByHunt(hunt_id) {
  return apiClient(`/index/hunt/${hunt_id}`, { method: 'GET' });
}
  