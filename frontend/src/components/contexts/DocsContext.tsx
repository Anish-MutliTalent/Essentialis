// src/context/DocsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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
  fetchDocs: (page?: number) => Promise<void>;
  refreshDocs: () => Promise<void>;
  loadMoreDocs: () => Promise<void>;
  setDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>;
  hasMore: boolean;
  page: number;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // assume true initially
  const LIMIT = 10;

  // retryRef holds retry count and active timer id (number or null)
  const retryRef = React.useRef<{ count: number; timer?: number | null }>({ count: 0, timer: null });
  const MAX_RETRIES = 6;
  const BASE_RETRY_MS = 2000;

  // small wrapper to log syncing changes (helpful for debugging)
  const setSyncingAndLog = (val: boolean) => {
    // debug info — remove or comment out once you confirm behavior
    // console.debug("[DocsContext] setSyncing:", val, { retryCount: retryRef.current.count, timer: retryRef.current.timer });
    setSyncing(val);
  };

  // load cached docs from localStorage (if any)
  // useEffect(() => {
  //   const cached = localStorage.getItem("mydocs");
  //   if (cached) {
  //     try {
  //       setDocs(JSON.parse(cached) as DocItem[]);
  //       setLoading(false);
  //     } catch {
  //       localStorage.removeItem("mydocs");
  //     }
  //   }
  // }, []);

  // persist docs to localStorage whenever they change
  // useEffect(() => {
  //   try {
  //     if (docs.length > 0) {
  //       localStorage.setItem("mydocs", JSON.stringify(docs));
  //     } else {
  //       localStorage.removeItem("mydocs");
  //     }
  //   } catch (e) {
  //     console.warn("Failed to persist mydocs to localStorage", e);
  //   }
  // }, [docs]);

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

  // single fetch implementation
  // pageNum: explicit page to fetch. If not provided, uses current 'page' state.
  // if pageNum === 1, we reset list.
  const _fetchDocs = useCallback(async (pageNum: number = 1) => {
    // If we're already loading specific page > 1, prevent dupes if needed, 
    // but simplified approach: just allow (calling component manages debounce/trigger)

    // If fetching page 1, set global loading
    // If fetching page > 1, set syncing (background load)
    if (pageNum === 1) {
      setLoading(true);
      setPage(1);
    } else {
      setSyncingAndLog(true);
    }

    setError(null);

    // assume fresh start for retry logic if page 1
    if (pageNum === 1) {
      setSyncingAndLog(false);
    }

    try {
      const endpoints = [
        `/api/user/docs?page=${pageNum}&limit=${LIMIT}`,
        // fallbacks might not support pagination, so appending query params might be ignored or work partially
        // Assuming primary endpoint works. If not, logic might be brittle for pagination on fallbacks.
        `/api/doc/my_docs?page=${pageNum}&limit=${LIMIT}`,
        `/api/user/nfts?page=${pageNum}&limit=${LIMIT}`,
        `/api/nfts/user?page=${pageNum}&limit=${LIMIT}`,
      ];

      let docsArray: any[] = [];
      let lastError: any = null;
      let successfulEndpoint: string | null = null;
      let responseHasMore = false; // from backend if available

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, { credentials: "include" });
          if (!res.ok) {
            lastError = new Error(`Non-OK: ${res.status}`);
            continue;
          }

          const data = await res.json();
          let foundArray: any[] | null = null;

          // Check for paginated structure first
          if (data.nfts && Array.isArray(data.nfts)) {
            foundArray = data.nfts;
            if (typeof data.has_more === 'boolean') {
              responseHasMore = data.has_more;
            } else {
              // fallback if backend doesn't return has_more
              responseHasMore = foundArray!.length === LIMIT;
            }
          }
          // Legacy structure checks
          else if (Array.isArray(data)) foundArray = data;
          else if (Array.isArray(data.docs)) foundArray = data.docs;
          else if (Array.isArray(data.data)) foundArray = data.data;
          else {
            // ... existing fallback ...
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
            // If we didn't get explicit has_more from backend but got array, guess
            if (data.has_more === undefined) {
              responseHasMore = docsArray.length === LIMIT;
            }
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
      if (pageNum === 1) {
        setDocs(docsWithMetadata);
      } else {
        setDocs(prev => {
          // deduplicate if needed based on token_id
          const existingIds = new Set(prev.map(d => d.token_id));
          const newDocs = docsWithMetadata.filter((d: DocItem) => !existingIds.has(d.token_id));
          return [...prev, ...newDocs];
        });
      }

      setHasMore(responseHasMore);
      // update current page ref
      setPage(pageNum);

      console.log(`[DocsContext] Docs fetched (endpoint: ${successfulEndpoint}) count=${docsWithMetadata.length} page=${pageNum}`);

      // clear any pending retry and reset counters
      if (retryRef.current.timer) {
        try {
          clearTimeout(retryRef.current.timer as number);
        } catch { }
        retryRef.current.timer = null;
      }
      retryRef.current.count = 0;
      setSyncingAndLog(false);
    } catch (err: any) {
      console.error("[DocsContext] Error fetching docs:", err);
      setError(err?.message ?? String(err));

      // Only schedule retry on real error (network, server, parsing, or no endpoints)
      // Retry logic typically makes sense for initial load (page 1) or vital updates.
      // For pagination loadMore, we might just show error or let user retry by scrolling again.
      // Keeping existing logic for now but focusing on page 1 retries mainly.

      if (pageNum === 1 && retryRef.current.count < MAX_RETRIES) {
        const delay = Math.round(BASE_RETRY_MS * Math.pow(2, retryRef.current.count));
        console.debug(`[DocsContext] Scheduling retry #${retryRef.current.count + 1} in ${delay}ms`);
        retryRef.current.count += 1;

        // mark syncing true because we're waiting for a retry
        setSyncingAndLog(true);

        // clear previous timer if any
        if (retryRef.current.timer) {
          try {
            clearTimeout(retryRef.current.timer as number);
          } catch { }
        }
        retryRef.current.timer = window.setTimeout(() => {
          // call _fetchDocs again (no increment here — we've already incremented count)
          _fetchDocs(1);
        }, delay) as unknown as number;
      } else {
        console.debug("[DocsContext] Retries exhausted — stopping sync");
        setSyncingAndLog(false);
      }
    } finally {
      if (pageNum === 1) setLoading(false);
      else setSyncingAndLog(false);
    }
  }, []); // dependencies empty as mostly static refs

  // fetch on first mount
  useEffect(() => {
    _fetchDocs(1);
  }, [_fetchDocs]);

  // cleanup scheduled retry timers on unmount
  useEffect(() => {
    return () => {
      if (retryRef.current.timer) {
        try {
          window.clearTimeout(retryRef.current.timer as number);
        } catch { }
        retryRef.current.timer = null;
      }
      retryRef.current.count = 0;
    };
  }, []);

  const refreshDocs = useCallback(async () => {
    await _fetchDocs(1);
  }, [_fetchDocs]);

  const loadMoreDocs = useCallback(async () => {
    if (!hasMore || loading || syncing) return;
    await _fetchDocs(page + 1);
  }, [hasMore, loading, syncing, page, _fetchDocs]);


  const value: DocsContextType = {
    docs,
    loading,
    syncing,
    error,
    fetchDocs: () => _fetchDocs(1),
    refreshDocs,
    loadMoreDocs,
    setDocs,
    hasMore,
    page
  };

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
};

// helper hook (throws if used outside provider)
export const useDocs = (): DocsContextType => {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used inside DocsProvider");
  return ctx;
};
