import { apiClient } from '../apiClient';

export function getAllDifficulty() {
  return apiClient('/difficulty');
}
