const API_URL = process.env.REACT_APP_API_URL;
import { useNotificationStore } from '../common/store/notificationStore';

export async function apiClient(
  path,
  {
    method = 'GET',
    body,
    headers = {},
    suppressErrorNotification = false,
  } = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || '';

  if (!res.ok) {
    let errorMessage = 'API error';
    let errorDetails = undefined;
    let statusCode = res.status;

    if (contentType.includes('application/json')) {
      try {
        const err = await res.json();
        errorMessage = err?.message || 'API error';
        errorDetails = err?.details;
      } catch (parseErr) {
        errorMessage = 'API error';
      }
    } else {
      try {
        errorMessage = await res.text();
      } catch (parseErr) {
        errorMessage = 'API error';
      }
    }

    const shouldSuppress =
      typeof suppressErrorNotification === 'function'
        ? suppressErrorNotification(statusCode, path)
        : Boolean(suppressErrorNotification);

    if (!shouldSuppress) {
      useNotificationStore.getState().addNotification(errorMessage, errorDetails, statusCode);
    }

    return null;
  }

  if (res.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}