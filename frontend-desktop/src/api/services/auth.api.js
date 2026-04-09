import { apiClient } from '../apiClient';

export function logUser(loginData) {
  return apiClient('/auth/login/web', { method: 'POST', body: loginData });

}

export function verifyTwoFactorCode(payload) {
  return apiClient('/auth/login/web/verify', { method: 'POST', body: payload });
}

export function resendTwoFactorCode(payload) {
  return apiClient('/auth/login/web/resend', { method: 'POST', body: payload });
}

export function currentUser() {
  return apiClient('/auth/me', { suppressErrorNotification: (statusCode) => statusCode === 401 });
}

export function logoutUser() {
  return apiClient('/auth/logout', { method: 'POST'});
}
