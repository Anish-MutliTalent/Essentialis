import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Heading, Text, LoadingSpinner } from "../../index";
import { useDocs } from "../../../contexts/DocsContext";
import { getFileTypeIcon, getFileSize, friendlyFileTypeLabel } from "../../../../lib/docs";
import { FileText } from 'lucide-react';

const MyDocs: React.FC = () => {
  const { docs, fetchDocs, loading, syncing } = useDocs();

  useEffect(() => {
    if (docs.length === 0) {
      fetchDocs();
    }
  }, []);

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
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center px-4">
        <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2 text-xl sm:text-2xl lg:text-3xl">
          My Documents
        </Heading>
        <Text color="muted" className="text-sm sm:text-base">
          Manage and view your encrypted document NFTs
        </Text>
      </div>

      {docs.length === 0 ? (
        <Card variant="professional">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <Heading level={3} className="mb-2">No Documents Found</Heading>
            <Text color="muted" className="mb-6">
              You dont have any documents yet. Start by creating your first encrypted document.
            </Text>
            <Link to="/dashboard/mint-doc">
              <Button variant="primary" size="lg">
                Create Your First Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {docs.map((doc) => {
            const metadata = doc.metadata;
            // Flexible attribute lookup: tolerate variations in trait_type naming
            const findAttrValue = (matcher: (t: string) => boolean) =>
              metadata?.attributes?.find((attr: any) => matcher(String(attr.trait_type || '')))?.value;

            const rawFileType = findAttrValue((t) => {
              const lt = t.toLowerCase();
              return lt === 'file type' || lt === 'filetype' || (lt.includes('file') && lt.includes('type'));
            }) || findAttrValue((t) => /file/i.test(t)) || 'Unknown';

            const fileType = friendlyFileTypeLabel(rawFileType);
            const fileSize = findAttrValue((t) => /file size/i.test(t)) || 'Unknown';
            const tokenizationDate = findAttrValue((t) => /tokenization date|date/i.test(t)) || 'Unknown';

            return (
              <Card key={doc.token_id} variant="professional" hover className="group">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-yellow-400">
                        {(() => {
                        // Use rawFileType for icon detection so we keep MIME-based icon matching
                        const IconComponent = getFileTypeIcon(rawFileType);
                        return <IconComponent className="w-8 h-8" />;
                      })()}
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

                  <div className="flex flex-col sm:flex-row gap-2">
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

      {/* CTA moved to the LeftSidebar (desktop) and a floating button on mobile to avoid long scrolling */}
    </div>
  );
};

export default MyDocs;