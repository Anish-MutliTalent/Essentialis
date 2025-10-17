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
  fetchDocs: () => Promise<void>; // keep old name for compatibility
  refreshDocs: () => Promise<void>; // alternative name
  setDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retryRef = React.useRef<{ count: number; timer?: number | null }>({ count: 0, timer: null });
  const MAX_RETRIES = 6;
  const BASE_RETRY_MS = 2000;

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

  // single fetch implementation (used for both fetchDocs and refreshDocs)
  const _fetchDocs = useCallback(async () => {
    setLoading(true);
    setError(null);
    // clear syncing when we actively fetch
    setSyncing(false);

    try {
      const possibleEndpoints = [
        "/api/user/docs",
        "/api/doc/my_docs",
        "/api/user/nfts",
        "/api/nfts/user",
      ];

      let docsArray: any[] = [];
      let successfulEndpoint = "";

      for (const endpoint of possibleEndpoints) {
        try {
          const response = await fetch(endpoint, { credentials: "include" });
          if (!response.ok) continue;
          const data = await response.json();

          if (Array.isArray(data)) {
            docsArray = data;
            successfulEndpoint = endpoint;
            break;
          } else if (data.docs && Array.isArray(data.docs)) {
            docsArray = data.docs;
            successfulEndpoint = endpoint;
            break;
          } else if (data.nfts && Array.isArray(data.nfts)) {
            docsArray = data.nfts;
            successfulEndpoint = endpoint;
            break;
          } else if (data.data && Array.isArray(data.data)) {
            docsArray = data.data;
            successfulEndpoint = endpoint;
            break;
          } else {
            for (const key of Object.keys(data)) {
              if (Array.isArray(data[key])) {
                docsArray = data[key];
                successfulEndpoint = endpoint;
                break;
              }
            }
            if (docsArray.length > 0) break;
          }
        } catch (endpointError) {
          // try next endpoint
          continue;
        }
      }

      // If backend returned nothing, do NOT inject a mock sample doc.
      // Keep docsArray empty and schedule retries in case auth completes
      // shortly after the initial request (common on cold sign-in).
      if (docsArray.length === 0) {
        docsArray = [];
        successfulEndpoint = "none";
        setSyncing(true);
      }

      const docsWithMetadata = docsArray.map((doc: any) => {
        try {
          const tokenId = doc.token_id ?? doc.tokenID ?? doc.id ?? doc.tokenId ?? "unknown";
          const tokenUri = doc.token_uri ?? doc.tokenURI ?? doc.uri ?? doc.url ?? "";

          if (tokenUri && tokenUri.startsWith("data:application/json;base64,")) {
            const base64 = tokenUri.split(",")[1];
            // atob exists in browsers
            const jsonStr = atob(base64);
            const metadata = JSON.parse(jsonStr);
            return { token_id: tokenId, token_uri: tokenUri, metadata };
          } else {
            return {
              token_id: tokenId,
              token_uri: tokenUri,
              metadata: {
                name: doc.name || `Document ${tokenId}`,
                description: doc.description || "No description available",
                attributes: doc.attributes || [],
              },
            };
          }
        } catch (e) {
          const tokenId = doc.token_id ?? doc.tokenID ?? doc.id ?? doc.tokenId ?? "unknown";
          return {
            token_id: tokenId,
            token_uri: "",
            metadata: {
              name: `Document ${tokenId}`,
              description: "Metadata parsing failed",
              attributes: [],
            },
          };
        }
      });

      setDocs(docsWithMetadata);
      console.log(`Docs fetched (endpoint: ${successfulEndpoint}) count=${docsWithMetadata.length}`);

      // If we ended up with no docs, attempt a few retries with exponential
      // backoff in case auth cookies/session become available shortly
      // after the first fetch (common on cold sign-in).
      if (docsWithMetadata.length === 0) {
        // schedule next retry if we haven't exceeded the max attempts
        if (retryRef.current.count < MAX_RETRIES) {
          const nextDelay = Math.round(BASE_RETRY_MS * Math.pow(2, retryRef.current.count));
          // clear any previous timer
          if (retryRef.current.timer) {
            window.clearTimeout(retryRef.current.timer as number);
          }
          console.debug(`Docs fetch returned empty; scheduling retry #${retryRef.current.count + 1} in ${nextDelay}ms`);
          retryRef.current.timer = window.setTimeout(() => {
            retryRef.current.count += 1;
            _fetchDocs();
          }, nextDelay) as unknown as number;
        } else {
          console.debug("Docs fetch retries exhausted");
          setSyncing(false);
        }
      } else {
        // success: reset retry counter and syncing flag
        if (retryRef.current.timer) {
          window.clearTimeout(retryRef.current.timer as number);
          retryRef.current.timer = null;
        }
        retryRef.current.count = 0;
        setSyncing(false);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
      console.error("Error fetching docs:", err);
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
