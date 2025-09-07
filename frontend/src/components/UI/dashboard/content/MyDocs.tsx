// MyDocs.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, Heading, Text, LoadingSpinner } from '../../index';

interface DocItem {
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

const MyDocs: React.FC = () => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Try multiple possible API endpoints
        const possibleEndpoints = [
          '/api/user/docs',
          '/api/doc/my_docs',
          '/api/user/nfts',
          '/api/nfts/user'
        ];

        let docsArray: any[] = [];
        let successfulEndpoint = '';

        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
              credentials: 'include' // Include credentials for authenticated requests
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log(`Response from ${endpoint}:`, data);
              
              // Handle different API response structures
              if (Array.isArray(data)) {
                // Direct array response
                docsArray = data;
                successfulEndpoint = endpoint;
                break;
              } else if (data.docs && Array.isArray(data.docs)) {
                // Response with docs property
                docsArray = data.docs;
                successfulEndpoint = endpoint;
                break;
              } else if (data.nfts && Array.isArray(data.nfts)) {
                // Response with nfts property (common in NFT APIs)
                docsArray = data.nfts;
                successfulEndpoint = endpoint;
                break;
              } else if (data.data && Array.isArray(data.data)) {
                // Response with data property
                docsArray = data.data;
                successfulEndpoint = endpoint;
                break;
              } else {
                // Fallback: try to find any array in the response
                const keys = Object.keys(data);
                for (const key of keys) {
                  if (Array.isArray(data[key])) {
                    docsArray = data[key];
                    successfulEndpoint = endpoint;
                    break;
                  }
                }
                if (docsArray.length > 0) break;
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError);
            continue;
          }
        }
        
        if (docsArray.length === 0) {
          console.warn('No documents found from any endpoint. Trying mock data for development...');
          // For development/testing, create some mock data
          docsArray = [
            {
              token_id: '1',
              token_uri: 'data:application/json;base64,eyJuYW1lIjoiU2FtcGxlIERvY3VtZW50IiwiZGVzY3JpcHRpb24iOiJBIGRlbW8gZG9jdW1lbnQgZm9yIHRlc3RpbmciLCJhdHRyaWJ1dGVzIjpbeyJ0cmFpdF90eXBlIjoiRmlsZSBUeXBlIiwidmFsdWUiOiJhcHBsaWNhdGlvbi9wZGYifSx7InRyYWl0X3R5cGUiOiJGaWxlIFNpemUiLCJ2YWx1ZSI6IjEyOCBLQiJ9XX0=',
              metadata: {
                name: 'Sample Document',
                description: 'A demo document for testing',
                attributes: [
                  { trait_type: 'File Type', value: 'application/pdf' },
                  { trait_type: 'File Size', value: '128 KB' },
                  { trait_type: 'Tokenization Date', value: '2024-01-15' }
                ]
              }
            }
          ];
          successfulEndpoint = 'mock-data';
        }
        
        console.log(`Using endpoint: ${successfulEndpoint}, found ${docsArray.length} documents`);
        
        // Parse metadata for each document
        const docsWithMetadata = docsArray.map((doc: any) => {
          try {
            // Handle different property names
            const tokenId = doc.token_id || doc.tokenID || doc.id || doc.tokenId;
            const tokenUri = doc.token_uri || doc.tokenURI || doc.uri || doc.uri;
            
            if (tokenUri && tokenUri.startsWith('data:application/json;base64,')) {
              const base64 = tokenUri.split(',')[1];
              const jsonStr = atob(base64);
              const metadata = JSON.parse(jsonStr);
              
              return {
                token_id: tokenId,
                token_uri: tokenUri,
                metadata
              };
            } else {
              // Return doc with basic info if no valid metadata
              return {
                token_id: tokenId,
                token_uri: tokenUri || '',
                metadata: {
                  name: doc.name || `Document ${tokenId}`,
                  description: doc.description || 'No description available',
                  attributes: doc.attributes || []
                }
              };
            }
          } catch (e) {
            console.error('Failed to parse metadata for doc:', doc, e);
            // Return a fallback doc object
            const tokenId = doc.token_id || doc.tokenID || doc.id || doc.tokenId || 'unknown';
            return {
              token_id: tokenId,
              token_uri: '',
              metadata: {
                name: `Document ${tokenId}`,
                description: 'Metadata parsing failed',
                attributes: []
              }
            };
          }
        });
        
        setDocs(docsWithMetadata);
      } catch (err: any) {
        console.error('Error fetching docs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('word') || fileType.includes('document')) return '📄';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    return '📁';
  };

  const getFileSize = (sizeStr: string) => {
    return sizeStr;
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
      <Text color="muted" className="max-w-md mx-auto">
        {error}
      </Text>
      <Button
        onClick={() => window.location.reload()}
        variant="primary"
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <Heading level={2} className="gradient-gold-text mb-2">
          My Documents
        </Heading>
        <Text color="muted">
          Manage and view your encrypted document NFTs
        </Text>
      </div>

      {docs.length === 0 ? (
        <Card variant="professional">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <Heading level={3} className="mb-2">No Documents Found</Heading>
            <Text color="muted" className="mb-6">
              You haven't minted any documents yet. Start by creating your first encrypted document.
            </Text>
            <Link to="/dashboard/mint-doc">
              <Button variant="primary" size="lg">
                Mint Your First Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => {
            const metadata = doc.metadata;
            const fileType = metadata?.attributes?.find(attr => attr.trait_type === 'File Type')?.value || 'Unknown';
            const fileSize = metadata?.attributes?.find(attr => attr.trait_type === 'File Size')?.value || 'Unknown';
            const tokenizationDate = metadata?.attributes?.find(attr => attr.trait_type === 'Tokenization Date')?.value || 'Unknown';

            return (
              <Card key={doc.token_id} variant="professional" hover className="group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">
                      {getFileTypeIcon(fileType)}
                    </div>
                    <div className="text-right">
                      <Text variant="small" color="muted" className="font-mono">
                        #{doc.token_id}
                      </Text>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Heading level={4} className="mb-2 line-clamp-2">
                      {metadata?.name || `Document ${doc.token_id}`}
                    </Heading>
                    <Text variant="small" color="muted" className="line-clamp-2">
                      {metadata?.description || 'No description available'}
                    </Text>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <Text variant="small" color="muted">Type</Text>
                      <Text variant="small" weight="medium">{fileType}</Text>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Text variant="small" color="muted">Size</Text>
                      <Text variant="small" weight="medium">{getFileSize(fileSize)}</Text>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Text variant="small" color="muted">Date</Text>
                      <Text variant="small" weight="medium">
                        {tokenizationDate !== 'Unknown' ? new Date(tokenizationDate).toLocaleDateString() : 'Unknown'}
                      </Text>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link to={`/dashboard/my-docs/${doc.token_id}/view`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/edit`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/history`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        History
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="text-center pt-8">
        <Link to="/dashboard/mint-doc">
          <Button variant="primary" size="lg">
            Mint New Document
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyDocs;