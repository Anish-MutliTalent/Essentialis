// src/components/dashboard/content/MyDocs.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';

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
      // Step 1: Fetch the list of NFTs from your backend indexer. This remains the same.
      const res = await fetch('/api/doc/my_docs');
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      const ownedNftsFromApi = json.nfts;

      // ✅ CORRECTED LOGIC: Parse metadata directly from the on-chain Data URI.
      // We no longer need to fetch from IPFS for this step.
      const simplifiedDocs: Doc[] = ownedNftsFromApi.map((item: any) => {
        try {
          const tokenURI = item.tokenURI;
          if (!tokenURI || !tokenURI.startsWith('data:application/json;base64,')) {
            // If the URI is not a Data URI, handle it as an error or a legacy format.
            console.error(`Invalid Data URI for token ID ${item.tokenID}:`, tokenURI);
            return {
              tokenId: item.tokenID,
              tokenURI: tokenURI || 'N/A',
              name: 'Invalid Metadata Format',
              timestamp: 'N/A',
            };
          }

          // Decode the Base64 string to get the JSON metadata.
          const base64String = tokenURI.split(',')[1];
          const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
          const metadata = JSON.parse(jsonString);

          // Extract the required information.
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
      // This will catch errors from the initial `/api/doc/my_docs` fetch.
      throw err;
    }
  };

  useEffect(() => {
    const attemptFetch = async () => {
      try {
        await fetchDocsWithMetadata();
      } catch (err: any) {
        console.log("First attempt failed, retrying in 2 seconds...");
        // Wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          // Second attempt
          await fetchDocsWithMetadata();
        } catch (retryErr: any) {
          // Only set error if both attempts fail
          setError(retryErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    attemptFetch();
  }, []);

  if (loading) return (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">My Docs</h2>
      <Link to="/dashboard/mint-doc">
        <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
          Create New Doc
        </button>
      </Link>
    </div>
    <div className="flex items-center">
      <LoadingSpinner className="text-white" />
      <span className="ml-2 text-white">Loading...</span>
    </div>
  </div>);
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Docs</h2>
        <Link to="/dashboard/mint-doc">
          <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            Create New Doc
          </button>
        </Link>
      </div>
      {docs.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-black">Token ID</th>
              <th className="border px-4 py-2 text-black">Name</th>
              <th className="border px-4 py-2 text-black">Date</th>
              <th className="border px-4 py-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={`${doc.tokenId}`} className="text-center">
                <td className="border px-1 py-2 text-sm">{doc.tokenId}</td>
                <td className="border px-4 py-2">{doc.name}</td>
                <td className="border px-4 py-2">{doc.timestamp}</td>
                <td className="border px-1 py-2">
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/edit`}>
                        <button className="text-black mr-2">Edit</button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/view`}>
                        <button className="text-black mr-2">View</button>
                    </Link>
                    <Link to={`/dashboard/my-docs/${doc.tokenId}/history`}>
                        <button className="text-black">History</button>
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Docs found.</p>
      )}
    </div>
  );
};

export default MyDocs;