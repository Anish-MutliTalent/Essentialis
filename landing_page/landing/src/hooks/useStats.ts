import { useEffect, useState } from "react";
import { getStats } from "../lib/api";

interface UseStatsResult {
  /** Live community total, or null while loading / on error. */
  total: number | null;
  error: boolean;
}

/**
 * Live member count from `/api/public/stats`, refreshed on an interval so the
 * "LIVE" badge stays honest. Returns null until the first successful load.
 */
export function useStats(pollMs = 45000): UseStatsResult {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getStats();
        if (!active) return;
        setTotal(typeof data.total_community === "number" ? data.total_community : null);
        setError(false);
      } catch {
        if (active) setError(true);
      }
    };

    load();
    const id = window.setInterval(load, pollMs);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [pollMs]);

  return { total, error };
}
