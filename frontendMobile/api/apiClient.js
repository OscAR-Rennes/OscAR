import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://10.101.0.56:5000/api" //Constants.expoConfig?.extra?.apiUrl;

export async function apiClient(
  path,
  { method = "GET", body, headers = {} } = {}
) {
  const token = await SecureStore.getItemAsync("token");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let errorMessage = "API error";
    let errorDetails = undefined;

    if (contentType.includes("application/json")) {
      try {
        const err = await res.json();
        errorMessage = err?.message || "API error";
        errorDetails = err?.details;
      } catch {}
    } else {
      try {
        errorMessage = await res.text();
      } catch {}
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