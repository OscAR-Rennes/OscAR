import { apiClient } from '../apiClient';

export function logUser(loginData) {
  return apiClient('/auth/login/web', { method: 'POST', body: loginData });

}

export function currentUser() {
  return apiClient('/auth/me');
}

export function logoutUser() {
  return apiClient('/auth/logout', { method: 'POST'});
}
