import { useEffect, useState, useCallback } from "react";

import { useAuth } from '@clerk/clerk-react'

export const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getToken, isLoaded, isSignedIn } = useAuth()

  const fetchData = useCallback(() => {
    if (!url || !isLoaded || !isSignedIn) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function run() {
      try {
        const token = await getToken();

        if (!token) {
          throw new Error("No auth token available");
        }

        const response = await fetch( url, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          } 
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || `Request failed with ${response.status}`);
        }

        const json = await response.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [url, isLoaded, isSignedIn]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
