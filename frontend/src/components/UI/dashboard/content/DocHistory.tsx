import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardHeader, CardContent, Heading, Text, LoadingSpinner } from '../../index';

interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  metadata?: any;
  version?: number;
}

const DocHistory: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/doc/${tokenId}/history`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();

        // Map API response to HistoryEntry[]
        let historyArray: HistoryEntry[] = [];
        if (data.history && Array.isArray(data.history)) {
          historyArray = data.history.map((entry: any, idx: number) => {
            let metadata = null;
            if (entry.token_uri && entry.token_uri.startsWith('data:application/json;base64,')) {
              try {
                const base64 = entry.token_uri.replace('data:application/json;base64,', '');
                const jsonStr = atob(base64);
                metadata = JSON.parse(jsonStr);
              } catch (e) {
                metadata = { error: 'Failed to decode metadata', raw: entry.token_uri };
              }
            }
            return {
              id: `${data.token_id}-${idx}`,
              timestamp: entry.timestamp,
              action: entry.action || `Version #${entry.version ?? idx}`,
              metadata,
              version: typeof entry.version === 'number' ? entry.version : undefined,
            };
          });
        }
        setHistory(historyArray);
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      fetchHistory();
    }
  }, [tokenId]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <LoadingSpinner size="lg" color="gold" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-red-500/30">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <Heading level={3} className="text-red-400 mb-2">Error</Heading>
      <Text color="muted">{error}</Text>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <Heading level={2} className="gradient-gold-text mb-2">
          Document History
        </Heading>
        <Text color="muted">
          Track all changes and updates to document #{tokenId}
        </Text>
      </div>

      <Card variant="professional">
        <CardHeader>
          <Heading level={3}>History Entries</Heading>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Text color="muted">No history entries found for this document.</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                // Find the greatest version number, ignoring undefined/null/non-numeric
                // Use the entry.version provided by the API (fallbacks handled)
                const versions = history
                  .map(h => h.version)
                  .filter(v => typeof v === 'number' && !isNaN(v)) as number[];
                const maxVersion = versions.length > 0 ? Math.max(...versions) : undefined;
                return history.map(entry => (
                  <div key={entry.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div>
                          <Text weight="semibold" className="text-yellow-400">
                            {entry.action}
                          </Text>
                          {entry.timestamp !== 'N/A' && (
                            <Text variant="small" color="muted">
                              {formatTimestamp(entry.timestamp)}
                            </Text>
                          )}
                        </div>
                      </div>
                      {entry.version === maxVersion && (
                        <span className="ml-2 text-green-400 text-sm font-medium bg-green-400/20 px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <Text variant="small" className="text-gray-300 mb-3">
                      {entry.details}
                    </Text>
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEntry(selectedEntry === entry ? null : entry)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {selectedEntry === entry ? 'Hide' : 'View'} Metadata
                      </Button>
                      {selectedEntry === entry && (
                        <div className="mt-3 p-3 rounded bg-gray-900 text-gray-300 font-mono text-xs whitespace-pre-wrap overflow-hidden border border-gray-700">
                          {typeof entry.metadata !== 'undefined' && entry.metadata !== null
                            ? JSON.stringify(entry.metadata, null, 2)
                            : 'No metadata available.'}
                        </div>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocHistory;
