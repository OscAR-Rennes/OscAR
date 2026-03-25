const API_URL = process.env.REACT_APP_API_URL;

export async function apiClient(
  path,
  { method = 'GET', body, headers = {} } = {}
) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
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

    useNotificationStore.getState().addNotification(errorMessage, errorDetails, statusCode);
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