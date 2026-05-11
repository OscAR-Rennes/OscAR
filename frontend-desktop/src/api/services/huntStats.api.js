import { apiClient } from '../apiClient';

export function getDashboardStats() {
  return apiClient('/hunt/stats');
}
