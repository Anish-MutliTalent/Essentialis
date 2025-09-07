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
  error: string | null;
  fetchDocs: () => Promise<void>;   // keep old name for compatibility
  refreshDocs: () => Promise<void>; // alternative name
  setDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      if (docsArray.length === 0) {
        // fallback mock (keeps your app usable in dev)
        docsArray = [
          {
            token_id: "1",
            token_uri:
              "data:application/json;base64,eyJuYW1lIjoiU2FtcGxlIERvY3VtZW50IiwiZGVzY3JpcHRpb24iOiJBIGRlbW8gZG9jdW1lbnQgZm9yIHRlc3RpbmciLCJhdHRyaWJ1dGVzIjpbeyJ0cmFpdF90eXBlIjoiRmlsZSBUeXBlIiwidmFsdWUiOiJhcHBsaWNhdGlvbi9wZGYifSx7InRyYWl0X3R5cGUiOiJGaWxlIFNpemUiLCJ2YWx1ZSI6IjEyOCBLQiJ9XX0=",
            metadata: {
              name: "Sample Document",
              description: "A demo document for testing",
              attributes: [
                { trait_type: "File Type", value: "application/pdf" },
                { trait_type: "File Size", value: "128 KB" },
                { trait_type: "Tokenization Date", value: "2024-01-15" },
              ],
            },
          },
        ];
        successfulEndpoint = "mock-data";
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

  const value: DocsContextType = {
    docs,
    loading,
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
