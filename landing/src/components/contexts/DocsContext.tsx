// src/context/DocsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useActiveAccount } from "thirdweb/react";

export interface DocItem {
  token_id: string;
  token_uri?: string;
  metadata?: {
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  isLoading?: boolean;
}

interface DocsContextType {
  docs: DocItem[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  fetchDocs: () => Promise<void>;
  refreshDocs: () => Promise<void>;
  setDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>;
  totalDocsCount: number;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const account = useActiveAccount(); // Get active wallet/account
  const [docs, setDocs] = useState<DocItem[]>(() => {
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDocsCount, setTotalDocsCount] = useState<number>(-1);

  // Ref to track current fetch execution to prevent race conditions
  const currentFetchId = useRef(0);

  // Restore persistence logic
  useEffect(() => {
    try {
      if (docs.length > 0) {
        const docsToSave = docs.filter(d => !d.isLoading);
        if (docsToSave.length > 0) {
          localStorage.setItem("mydocs", JSON.stringify(docsToSave));
        }
      }
    } catch (e) {
      console.warn("Failed to save docs cache", e);
    }
  }, [docs]);

  const processStreamedDoc = (data: any): DocItem => {
    const token_id = data.token_id ?? data.tokenID ?? "unknown";
    const token_uri = data.token_uri ?? "";
    let metadata = data.metadata;

    if (!metadata && typeof token_uri === "string" && token_uri.startsWith("data:application/json;base64,")) {
      try {
        const jsonStr = atob(token_uri.split(",")[1]);
        metadata = JSON.parse(jsonStr);
      } catch { }
    }

    return {
      token_id: String(token_id),
      token_uri,
      metadata: metadata || {
        name: `Document ${token_id}`,
        description: data.description || "No description available",
        attributes: data.attributes || [],
      },
      isLoading: false
    };
  };

  const _fetchDocs = useCallback(async () => {
    // If no account, don't fetch. Clear docs if needed?
    if (!account) {
      // Optionally clear docs or keep them? 
      // If we logged out, we should probably clear.
      setDocs([]);
      setLoading(false);
      return;
    }

    currentFetchId.current += 1;
    const myRunId = currentFetchId.current;

    setLoading(true);
    setError(null);
    setSyncing(false);
    setTotalDocsCount(-1);

    try {
      // 1. Fetch IDs (Always Source of Truth)
      const endpoint = "/api/user/docs?ids_only=true";

      const res = await fetch(endpoint, { credentials: "include" });
      if (myRunId !== currentFetchId.current) return;

      if (res.status === 401) {
        // Session expired or invalid on backend, but wallet connected on frontend.
        // We can't fetch.
        throw new Error("Unauthorized: Please sign in again.");
      }

      if (!res.ok) throw new Error(`Failed to fetch IDs: ${res.status}`);

      const data = await res.json();

      let ids: string[] = [];
      if (data.ids && Array.isArray(data.ids)) ids = data.ids.map(String);
      else if (data.nfts && Array.isArray(data.nfts)) ids = data.nfts.map((n: any) => String(n.token_id || n.id));
      else if (Array.isArray(data)) ids = data.map((n: any) => String(n.token_id || n.id));

      setTotalDocsCount(ids.length);

      if (ids.length === 0) {
        setDocs([]);
        setLoading(false);
        localStorage.removeItem("mydocs"); // Clear cache if true empty
        return;
      }

      // 2. Load Cache & Diff
      let cachedDocs: Record<string, DocItem> = {};
      try {
        const cachedJson = localStorage.getItem("mydocs");
        if (cachedJson) {
          const parsed = JSON.parse(cachedJson);
          if (Array.isArray(parsed)) {
            parsed.forEach((d: DocItem) => {
              cachedDocs[d.token_id] = d;
            });
          }
        }
      } catch (e) { console.warn("Cache read error", e); }

      // 3. Construct Hybrid State
      const hybridDocs: DocItem[] = [];
      const deltaIds: string[] = [];

      ids.forEach(id => {
        if (cachedDocs[id]) {
          // Exists in cache -> Use it
          hybridDocs.push(cachedDocs[id]);
        } else {
          // Missing -> Placeholder & mark for fetch
          hybridDocs.push({ token_id: id, isLoading: true });
          deltaIds.push(id);
        }
      });

      setDocs(hybridDocs);
      setLoading(false); // UI is now "ready" (cached content visible + placeholders)

      if (myRunId !== currentFetchId.current) return;

      // 4. Stream Details for Delta Only
      if (deltaIds.length > 0) {
        try {
          const streamRes = await fetch('/api/doc/stream_batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token_ids: deltaIds }),
            credentials: 'include'
          });

          if (!streamRes.body) throw new Error("ReadableStream not supported");
          const reader = streamRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            if (myRunId !== currentFetchId.current) {
              reader.cancel();
              return;
            }

            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const docData = JSON.parse(line);
                const processedDoc = processStreamedDoc(docData);

                setDocs(prev => prev.map(d => d.token_id === processedDoc.token_id ? processedDoc : d));
              } catch (e) { }
            }
          }

          if (buffer.trim()) {
            try {
              const docData = JSON.parse(buffer);
              const processedDoc = processStreamedDoc(docData);
              setDocs(prev => prev.map(d => d.token_id === processedDoc.token_id ? processedDoc : d));
            } catch { }
          }

        } catch (streamErr) {
          console.error("Streaming delta failed", streamErr);
        }
      }

    } catch (err: any) {
      if (myRunId !== currentFetchId.current) return;
      console.error("[DocsContext] Error fetching docs:", err);
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }, [account]); // Depend on account

  // fetch on mount or account change
  useEffect(() => {
    _fetchDocs();
  }, [_fetchDocs]);


  const value: DocsContextType = {
    docs,
    loading,
    syncing,
    error,
    fetchDocs: _fetchDocs,
    refreshDocs: _fetchDocs,
    setDocs,
    totalDocsCount
  };

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
};

// helper hook
export const useDocs = (): DocsContextType => {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used inside DocsProvider");
  return ctx;
};
