import { useEffect, useState, useCallback } from "react";

import { useAuth } from '@clerk/clerk-react'

export const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getToken } = useAuth()

  const fetchData = useCallback(() => {
    if (!url) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function run() {
      try {
        const token = await getToken()
        const response = await fetch( url, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          } 
        );
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
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
