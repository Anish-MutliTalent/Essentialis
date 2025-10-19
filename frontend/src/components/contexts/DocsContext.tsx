// src/context/DocsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface DocItem {
  token_id: string;
  token_uri: string;
  metadata?: {
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

interface DocsContextType {
  docs: DocItem[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  fetchDocs: () => Promise<void>;
  refreshDocs: () => Promise<void>;
  setDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // retryRef holds retry count and active timer id (number or null)
  const retryRef = React.useRef<{ count: number; timer?: number | null }>({ count: 0, timer: null });
  const MAX_RETRIES = 6;
  const BASE_RETRY_MS = 2000;

  // small wrapper to log syncing changes (helpful for debugging)
  const setSyncingAndLog = (val: boolean) => {
    // debug info — remove or comment out once you confirm behavior
    console.debug("[DocsContext] setSyncing:", val, { retryCount: retryRef.current.count, timer: retryRef.current.timer });
    setSyncing(val);
  };

  // load cached docs from localStorage (if any)
  useEffect(() => {
    const cached = localStorage.getItem("mydocs");
    if (cached) {
      try {
        setDocs(JSON.parse(cached) as DocItem[]);
        setLoading(false);
      } catch {
        localStorage.removeItem("mydocs");
      }
    }
  }, []);

  // persist docs to localStorage whenever they change
  useEffect(() => {
    try {
      if (docs.length > 0) {
        localStorage.setItem("mydocs", JSON.stringify(docs));
      } else {
        localStorage.removeItem("mydocs");
      }
    } catch (e) {
      console.warn("Failed to persist mydocs to localStorage", e);
    }
  }, [docs]);

  // defensive: whenever docs change (including becoming []), clear retries & stop syncing
  useEffect(() => {
    if (retryRef.current.timer) {
      try {
        clearTimeout(retryRef.current.timer as number);
      } catch (e) {
        // ignore clearing errors
      }
      retryRef.current.timer = null;
    }
    retryRef.current.count = 0;
    // always ensure syncing is false after a successful docs update
    setSyncingAndLog(false);
  }, [docs]);

  // single fetch implementation (used for both fetchDocs and refreshDocs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _fetchDocs = useCallback(async () => {
    setLoading(true);
    setError(null);
    // assume fresh start, not currently syncing
    setSyncingAndLog(false);

    try {
      const endpoints = [
        "/api/user/docs",
        "/api/doc/my_docs",
        "/api/user/nfts",
        "/api/nfts/user",
      ];

      let docsArray: any[] = [];
      let lastError: any = null;
      let successfulEndpoint: string | null = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, { credentials: "include" });
          if (!res.ok) {
            lastError = new Error(`Non-OK: ${res.status}`);
            continue;
          }

          const data = await res.json();
          let foundArray: any[] | null = null;

          if (Array.isArray(data)) foundArray = data;
          else if (Array.isArray(data.docs)) foundArray = data.docs;
          else if (Array.isArray(data.data)) foundArray = data.data;
          else if (Array.isArray(data.nfts)) foundArray = data.nfts;
          else {
            for (const key of Object.keys(data)) {
              if (Array.isArray((data as any)[key])) {
                foundArray = (data as any)[key];
                break;
              }
            }
          }

          if (foundArray !== null) {
            docsArray = foundArray;
            successfulEndpoint = endpoint;
            break;
          }
        } catch (err) {
          lastError = err;
          // continue to next endpoint
        }
      }

      if (!successfulEndpoint) {
        // No endpoint returned a usable array -> treat as a real error (retry)
        throw lastError || new Error("All endpoints failed or returned no array");
      }

      // Normalize/parse metadata (works even when docsArray is empty)
      const docsWithMetadata = docsArray.map((doc: any) => {
        const token_id = doc.token_id ?? doc.tokenID ?? doc.id ?? doc.tokenId ?? "unknown";
        const token_uri = doc.token_uri ?? doc.tokenURI ?? doc.uri ?? doc.url ?? "";
        try {
          if (typeof token_uri === "string" && token_uri.startsWith("data:application/json;base64,")) {
            const jsonStr = atob(token_uri.split(",")[1]);
            const metadata = JSON.parse(jsonStr);
            return { token_id, token_uri, metadata };
          }
          return {
            token_id,
            token_uri,
            metadata: {
              name: doc.name || `Document ${token_id}`,
              description: doc.description || "No description available",
              attributes: doc.attributes || [],
            },
          };
        } catch {
          return {
            token_id,
            token_uri,
            metadata: {
              name: `Document ${token_id}`,
              description: "Metadata parsing failed",
              attributes: [],
            },
          };
        }
      });

      // success (empty array is a valid success)
      setDocs(docsWithMetadata);
      console.log(`[DocsContext] Docs fetched (endpoint: ${successfulEndpoint}) count=${docsWithMetadata.length}`);

      // clear any pending retry and reset counters
      if (retryRef.current.timer) {
        try {
          clearTimeout(retryRef.current.timer as number);
        } catch {}
        retryRef.current.timer = null;
      }
      retryRef.current.count = 0;
      setSyncingAndLog(false);
    } catch (err: any) {
      console.error("[DocsContext] Error fetching docs:", err);
      setError(err?.message ?? String(err));

      // Only schedule retry on real error (network, server, parsing, or no endpoints)
      if (retryRef.current.count < MAX_RETRIES) {
        const delay = Math.round(BASE_RETRY_MS * Math.pow(2, retryRef.current.count));
        console.debug(`[DocsContext] Scheduling retry #${retryRef.current.count + 1} in ${delay}ms`);
        retryRef.current.count += 1;

        // mark syncing true because we're waiting for a retry
        setSyncingAndLog(true);

        // clear previous timer if any
        if (retryRef.current.timer) {
          try {
            clearTimeout(retryRef.current.timer as number);
          } catch {}
        }
        retryRef.current.timer = window.setTimeout(() => {
          // call _fetchDocs again (no increment here — we've already incremented count)
          _fetchDocs();
        }, delay) as unknown as number;
      } else {
        console.debug("[DocsContext] Retries exhausted — stopping sync");
        setSyncingAndLog(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch on first mount only if nothing cached
  useEffect(() => {
    if (docs.length === 0) {
      _fetchDocs();
    } else {
      // we already had cached docs from localStorage, keep loading false
      setLoading(false);
    }
  }, [_fetchDocs, docs.length]);

  // cleanup scheduled retry timers on unmount
  useEffect(() => {
    return () => {
      if (retryRef.current.timer) {
        try {
          window.clearTimeout(retryRef.current.timer as number);
        } catch {}
        retryRef.current.timer = null;
      }
      retryRef.current.count = 0;
    };
  }, []);

  const value: DocsContextType = {
    docs,
    loading,
    syncing,
    error,
    fetchDocs: _fetchDocs,
    refreshDocs: _fetchDocs,
    setDocs,
  };

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
};

// helper hook (throws if used outside provider)
export const useDocs = (): DocsContextType => {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used inside DocsProvider");
  return ctx;
};
