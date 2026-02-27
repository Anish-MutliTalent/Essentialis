import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Heading, Text } from "../../index";
import { useDocs, DocItem } from "../../../contexts/DocsContext";
import { getFileTypeIcon, getFileSize, friendlyFileTypeLabel } from "../../../../lib/docs";
import { FileText, LayoutGrid, List, ArrowUpDown } from 'lucide-react';

const DocSkeleton: React.FC = () => {
  return (
    <Card variant="professional" className="group h-full bg-gray-900 border-gray-800">
      <CardContent className="p-4 sm:p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-gray-800 to-gray-700"></div>
          <div className="w-12 h-4 rounded bg-gray-800"></div>
        </div>

        <div className="mb-4 space-y-2">
          <div className="h-6 w-3/4 rounded bg-gray-800"></div>
          <div className="h-4 w-1/2 rounded bg-gray-800"></div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <div className="h-3 w-10 bg-gray-800 rounded"></div>
            <div className="h-3 w-16 bg-gray-800 rounded"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <div className="h-8 w-full bg-gray-800 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
}

const DocListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse flex items-center space-x-4">
      <div className="w-10 h-10 rounded bg-gray-800"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-gray-800 rounded"></div>
        <div className="h-3 w-1/4 bg-gray-800 rounded"></div>
      </div>
      <div className="hidden sm:block w-24 h-4 bg-gray-800 rounded"></div>
      <div className="hidden sm:block w-20 h-4 bg-gray-800 rounded"></div>
    </div>
  )
}

// Helper to extract sortable values
const getDocAttribute = (doc: DocItem, attr: string): string => {
  return doc.metadata?.attributes?.find((a: any) =>
    String(a.trait_type).toLowerCase() === attr.toLowerCase() ||
    String(a.trait_type).toLowerCase().includes(attr.toLowerCase())
  )?.value || '';
}

const parseSize = (sizeStr: string): number => {
  if (!sizeStr) return 0;
  const units = { 'B': 1, 'KB': 1024, 'MB': 1024 ** 2, 'GB': 1024 ** 3 };
  const match = sizeStr.match(/([\d.]+)\s*([a-zA-Z]+)/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2].toUpperCase() as keyof typeof units;
  return val * (units[unit] || 1);
}

const MyDocs: React.FC = () => {
  // --- COOP/COEP Context Switch ---
  // The PPT viewer requires SharedArrayBuffer, which needs the top-level document
  // to be loaded with COOP: same-origin + COEP: require-corp headers.
  // If we arrived here via client-side nav (from /login or /dashboard), the document
  // was loaded WITHOUT those headers. Force a hard reload so the server can send them.
  useEffect(() => {
    if (!window.crossOriginIsolated) {
      const alreadyTried = sessionStorage.getItem('mydocs_coi_reload');
      if (!alreadyTried) {
        sessionStorage.setItem('mydocs_coi_reload', '1');
        console.log("MyDocs: Hard-reloading to enable COOP/COEP for SharedArrayBuffer...");
        window.location.reload();
      } else {
        // Already tried once — don't loop. Clear the flag for next time.
        console.warn("MyDocs: COOP/COEP still not active after reload. PPT viewer may not work.");
        sessionStorage.removeItem('mydocs_coi_reload');
      }
    } else {
      // Successfully isolated — clear the flag
      sessionStorage.removeItem('mydocs_coi_reload');
    }
  }, []);

  const { docs, fetchDocs, loading, totalDocsCount } = useDocs();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('date-desc');
  // Check if *all* displayed docs have finished loading their details
  // We use this to enable/disable sorting.
  // Note: if docs array is empty but we expect docs (loading=false, total>0), we count as not ready.
  // If loading=false and totalDocsCount > 0 and docs has pulse items, not ready.
  const isSortingReady = useMemo(() => {
    if (loading) return false;
    if (docs.length === 0) return true; // Ready (empty)
    return !docs.some(d => d.isLoading);
  }, [docs, loading]);

  useEffect(() => {
    if (docs.length === 0 && totalDocsCount !== 0) {
      fetchDocs();
    }
  }, []);

  const showNoDocs = !loading && totalDocsCount === 0;

  const sortedDocs = useMemo(() => {
    // Create a shallow copy to sort
    const items = [...docs];

    // If items are still loading (placeholders), preserve their order (or id order) 
    // effectively disable deep sorting until ready, OR sort mix?
    // User said: "all of there sorting can be set only after a files have loaded"
    // So we effectively ignore sort if not ready? Or we sort what we have? 
    // Ideally we shouldn't sort placeholders as they have no data.
    // So if not ready, just return items (default insertion/ID order).
    if (!isSortingReady) return items;

    return items.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return (a.metadata?.name || '').localeCompare(b.metadata?.name || '');
        case 'name-desc':
          return (b.metadata?.name || '').localeCompare(a.metadata?.name || '');
        case 'size-asc':
          return parseSize(getDocAttribute(a, 'size')) - parseSize(getDocAttribute(b, 'size'));
        case 'size-desc':
          return parseSize(getDocAttribute(b, 'size')) - parseSize(getDocAttribute(a, 'size'));
        case 'date-asc':
          return new Date(getDocAttribute(a, 'date') || 0).getTime() - new Date(getDocAttribute(b, 'date') || 0).getTime();
        case 'date-desc':
        default:
          return new Date(getDocAttribute(b, 'date') || 0).getTime() - new Date(getDocAttribute(a, 'date') || 0).getTime();
      }
    });
  }, [docs, sortOption, isSortingReady]);


  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <div>
          <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-xl sm:text-2xl">
            My Documents
          </Heading>
          <Text color="muted" className="text-sm">
            {totalDocsCount > -1 ? `${totalDocsCount} cached documents` : 'Syncing...'}
          </Text>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative min-w-[140px]">
            {!isSortingReady ? (
              <div className="h-10 w-full bg-gray-800 rounded animate-pulse border border-gray-700"></div>
            ) : (
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="size-asc">Size (Smallest)</option>
                  <option value="size-desc">Size (Largest)</option>
                </select>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-900 border border-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-800 text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-800 text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading && docs.length === 0 ? (
        // Initial loading state
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {[1, 2, 3].map(i => viewMode === 'grid' ? <DocSkeleton key={i} /> : <DocListItemSkeleton key={i} />)}
        </div>
      ) : showNoDocs ? (
        <Card variant="professional">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <Heading level={3} className="mb-2">No Documents Found</Heading>
            <Text color="muted" className="mb-6">
              You dont have any documents yet.
            </Text>
            <Link to="/dashboard/mint-doc">
              <Button variant="primary" size="lg">Create First Document</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
          {sortedDocs.map((doc) => {
            if (doc.isLoading) {
              return viewMode === 'grid' ?
                <DocSkeleton key={doc.token_id} /> :
                <DocListItemSkeleton key={doc.token_id} />;
            }

            const metadata = doc.metadata;
            const findAttrValue = (matcher: (t: string) => boolean) =>
              metadata?.attributes?.find((attr: any) => matcher(String(attr.trait_type || '')))?.value;

            const rawFileType = findAttrValue((t) => {
              const lt = t.toLowerCase();
              return lt === 'file type' || lt === 'filetype' || (lt.includes('file') && lt.includes('type'));
            }) || 'Unknown';

            const IconComponent = getFileTypeIcon(rawFileType);
            const fileType = friendlyFileTypeLabel(rawFileType);
            const fileSize = findAttrValue((t) => /file size/i.test(t)) || 'Unknown';
            const dateStr = findAttrValue((t) => /date/i.test(t));
            const dateDisplay = dateStr ? new Date(dateStr).toLocaleDateString() : 'Unknown';

            if (viewMode === 'list') {
              // List View Render
              return (
                <div key={doc.token_id} className="group bg-gray-900/40 border border-gray-800 hover:border-yellow-500/30 rounded-lg p-4 transition-all hover:bg-gray-900/80 flex items-center gap-4">
                  <div className="p-2 bg-gray-800 rounded text-yellow-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-200 truncate">{metadata?.name || `Doc #${doc.token_id}`}</h4>
                    <p className="text-sm text-gray-500 truncate">{metadata?.description}</p>
                  </div>
                  <div className="hidden sm:block text-sm text-gray-400 w-24 text-right">{dateDisplay}</div>
                  <div className="hidden md:block text-sm text-gray-400 w-20 text-right">{getFileSize(fileSize)}</div>

                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/my-docs/${doc.token_id}/view`}>
                      <Button size="sm" variant="primary" className="h-8 px-3 text-xs">View</Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/edit`}>
                      <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">Edit</Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/history`}>
                      <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">History</Button>
                    </Link>
                  </div>
                </div>
              )
            }

            // Grid View Render (Default)
            return (
              <Card key={doc.token_id} variant="professional" hover className="group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-yellow-400">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                      <Text variant="small" color="muted" className="font-mono">#{doc.token_id}</Text>
                    </div>
                  </div>

                  <div className="mb-4 h-24 overflow-hidden">
                    <Heading level={4} className="mb-2 line-clamp-2" title={metadata?.name}>
                      {metadata?.name || `Document ${doc.token_id}`}
                    </Heading>
                    <Text variant="small" color="muted" className="line-clamp-2">
                      {metadata?.description || 'No description available'}
                    </Text>
                  </div>

                  <div className="space-y-2 mb-6 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Type</span>
                      <span className="text-gray-300">{fileType}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Size</span>
                      <span className="text-gray-300">{getFileSize(fileSize)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Date</span>
                      <span className="text-gray-300">{dateDisplay}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link to={`/dashboard/my-docs/${doc.token_id}/view`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">View</Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/edit`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">Edit</Button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.token_id}/history`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">History</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDocs;