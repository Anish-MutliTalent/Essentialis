// src/components/dashboard/content/MyDocs.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';
import { Button, Heading, Text, Card, CardContent, Grid } from '../../index';

interface Doc {
  tokenId: string;
  tokenURI: string;
  name: string;
  timestamp: string;
}

const MyDocs: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocsWithMetadata = async () => {
    try {
      const res = await fetch('/api/doc/my_docs');
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      const ownedNftsFromApi = json.nfts;

      const simplifiedDocs: Doc[] = ownedNftsFromApi.map((item: any) => {
        try {
          const tokenURI = item.tokenURI;
          if (!tokenURI || !tokenURI.startsWith('data:application/json;base64,')) {
            console.error(`Invalid Data URI for token ID ${item.tokenID}:`, tokenURI);
            return {
              tokenId: item.tokenID,
              tokenURI: tokenURI || 'N/A',
              name: 'Invalid Metadata Format',
              timestamp: 'N/A',
            };
          }

          const base64String = tokenURI.split(',')[1];
          const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
          const metadata = JSON.parse(jsonString);

          const tokenizationDateAttribute = metadata.attributes?.find(
            (attr: any) => attr.trait_type === "Tokenization Date"
          );

          return {
            tokenId: item.tokenID,
            tokenURI: tokenURI,
            name: metadata?.name || 'Unnamed Document',
            timestamp: tokenizationDateAttribute?.value || 'Unknown Date',
          };
        } catch (parseError) {
          console.error(`Failed to parse metadata for token ID ${item.tokenID}:`, parseError);
          return {
            tokenId: item.tokenID,
            tokenURI: item.tokenURI || 'N/A',
            name: 'Metadata Parsing Error',
            timestamp: 'N/A',
          };
        }
      });

      setDocs(simplifiedDocs);
      setError(null);
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    const attemptFetch = async () => {
      try {
        await fetchDocsWithMetadata();
      } catch (err: any) {
        console.log("First attempt failed, retrying in 2 seconds...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          await fetchDocsWithMetadata();
        } catch (retryErr: any) {
          setError(retryErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    attemptFetch();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={2}>My Documents</Heading>
        <Link to="/dashboard/mint-doc">
          <Button variant="primary">
            Create New Document
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <Text className="ml-3 text-gray-300">Loading your documents...</Text>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
        <Text color="default" className="text-red-400">Error: {error}</Text>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={2}>My Documents</Heading>
        <Link to="/dashboard/mint-doc">
          <Button variant="primary">
            Create New Document
          </Button>
        </Link>
      </div>

      {docs.length > 0 ? (
        <div className="space-y-4">
          {docs.map((doc) => (
            <Card key={`${doc.tokenId}`} variant="professional" className="hover:border-yellow-400/30 transition-all-smooth">
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div>
                      <Text variant="small" color="muted">Token ID</Text>
                      <Text className="font-mono text-sm bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                        {doc.tokenId}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="small" color="muted">Document Name</Text>
                      <Text className="font-medium">{doc.name}</Text>
                    </div>
                    
                    <div>
                      <Text variant="small" color="muted">Creation Date</Text>
                      <Text className="text-sm">{doc.timestamp}</Text>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/view`}>
                      <Button variant="primary" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/history`}>
                      <Button variant="ghost" size="sm">
                        History
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="professional" className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <Heading level={3} className="text-gray-300 mb-2">No Documents Found</Heading>
                <Text color="muted" className="mb-4">
                  You haven't created any documents yet. Start by creating your first document.
                </Text>
                <Link to="/dashboard/mint-doc">
                  <Button variant="primary">
                    Create Your First Document
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyDocs;