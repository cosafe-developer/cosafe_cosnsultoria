import { useState, useEffect, useCallback } from "react";

/**
 * Generic async data fetcher with loading / error states.
 * @param {string} url  - API endpoint
 * @param {object} opts - fetch options (optional)
 */
export function useFetch(url, opts = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.data ?? json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
}
