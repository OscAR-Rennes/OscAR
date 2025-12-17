import { apiClient } from '../apiClient';

export function fetchHello() {
  return apiClient('/hello');
}
