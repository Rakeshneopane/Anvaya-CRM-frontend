// hooks/useAuthFetch.js
import { useAuth } from "@clerk/clerk-react";

export function useAuthFetch() {
  const { getToken } = useAuth();

  return async (url, options = {}) => {
    const token = await getToken();
    if (!token) throw new Error("No auth token available");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}