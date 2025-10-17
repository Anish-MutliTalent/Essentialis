import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Heading, Text, LoadingSpinner } from "../../index";
import { useDocs } from "../../../contexts/DocsContext";
import { getFileTypeIcon, getFileSize } from "../../../../lib/docs";

const MyDocs: React.FC = () => {
  const { docs, fetchDocs, loading, syncing } = useDocs();

  useEffect(() => {
    if (docs.length === 0) {
      fetchDocs();
    }
  }, [docs, fetchDocs]);

  if (loading || syncing) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" color="gold" />
          <div className="mt-3 text-gray-300 text-sm">Syncing documents…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
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