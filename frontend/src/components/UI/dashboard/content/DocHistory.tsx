import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';

interface HistoryEntry {
  version: number;
  update_index: number;
  token_uri: string;
  timestamp: string;
}

interface HistoryData {
  token_id: string;
  total_updates: number;
  history: HistoryEntry[];
}

const DocHistory: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const [decodedView, setDecodedView] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/doc/${tokenId}/history`);
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistoryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      fetchHistory();
    }
  }, [tokenId]);

  const decodeDataUri = (dataUri: string) => {
    try {
      const base64 = dataUri.split(',')[1];
      const jsonStr = atob(base64);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to decode data URI', e);
      return null;
    }
  };

  const handleCopy = (version: number, tokenUri: string) => {
    const isDecoded = decodedView[version];
    let textToCopy = tokenUri;

    if (isDecoded) {
      const decoded = decodeDataUri(tokenUri);
      textToCopy = decoded ? JSON.stringify(decoded, null, 2) : 'Failed to decode';
    }

    navigator.clipboard.writeText(textToCopy);
  };

  const toggleDecoded = (version: number) => {
    setDecodedView(prev => ({ ...prev, [version]: !prev[version] }));
  };

  const toggleVersion = (version: number) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  if (loading) return <div className="flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!historyData) return <div>No history found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Doc History - Token #{tokenId}</h1>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="mb-4">
          <p>Total Updates: {historyData.total_updates}</p>
        </div>
        <div className="space-y-4">
          {historyData.history.map((entry) => {
            const isDecoded = decodedView[entry.version];
            const decoded = isDecoded ? decodeDataUri(entry.token_uri) : null;

            return (
              <div
                key={entry.version}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Version {entry.version}
                      {entry.version === historyData.total_updates &&
                        <span className="ml-2 text-green-500 text-sm">(Current)</span>
                      }
                    </h3>
                    {entry.timestamp !== 'N/A' && (
                      <p className="text-sm text-gray-400">{entry.timestamp}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleVersion(entry.version)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    {expandedVersions.has(entry.version) ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {expandedVersions.has(entry.version) && (
                  <div className="mt-4 text-sm space-y-2">
                    <div
                      className={`p-2 rounded bg-gray-900 text-gray-300 font-mono whitespace-pre-wrap overflow-hidden ${
                        !isDecoded ? 'truncate' : ''
                      }`}
                    >
                      {isDecoded
                        ? JSON.stringify(decoded, null, 2)
                        : entry.token_uri}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(entry.version, entry.token_uri)}
                        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs input-field"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => toggleDecoded(entry.version)}
                        className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs input-field"
                      >
                        {isDecoded ? 'Show URI' : 'Decode'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocHistory;
