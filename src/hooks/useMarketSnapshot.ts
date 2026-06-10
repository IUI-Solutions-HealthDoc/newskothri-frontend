"use client";

import { useEffect, useState } from "react";
import type { MarketSnapshot } from "../lib/markets/fetchMarketSnapshot";

export function useMarketSnapshot(enabled = true) {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setSnapshot(null);
      setLoading(false);
      setError(false);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(false);

    fetch("/api/markets/snapshot", { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<MarketSnapshot>;
      })
      .then((data) => {
        if (ac.signal.aborted) return;
        const hasData =
          (data.quotes?.length ?? 0) > 0 ||
          (data.topGainers?.length ?? 0) > 0 ||
          (data.topLosers?.length ?? 0) > 0;
        if (!hasData) {
          setSnapshot(null);
          setError(true);
          return;
        }
        setSnapshot(data);
        setError(false);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!ac.signal.aborted) {
          setSnapshot(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, [enabled]);

  return { snapshot, loading, error };
}
