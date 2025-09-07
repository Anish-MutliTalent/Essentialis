// DocView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from 'thirdweb/wallets';

import { Button, Card, CardHeader, CardContent, Heading, Text, LoadingSpinner } from '../../index';
import { client } from '../../../../lib/thirdweb';

import {
    unwrapDek,
    aesGcmDecrypt,
    decode,
    split,
    divide,
    sha256,
    hmacSha256
} from '../../../../lib/crypto';

window.Buffer = window.Buffer || Buffer;

interface DocMetadata {
  name: string;
  description: string;
  image?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  encrypted_file_cid: string;
  nonce: string;
  wrapped_deks: Record<string, string>;
}

const DocView: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const [metadata, setMetadata] = useState<DocMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const response = await fetch(`/api/doc/${tokenId}`);
        if (!response.ok) throw new Error('Failed to fetch document details');
        const { token_uri } = await response.json();
        const decodedMetadata = JSON.parse(atob(token_uri.split(',')[1]));
        setMetadata(decodedMetadata);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      fetchDocData();
    }
  }, [tokenId]);

  const handleDecrypt = async () => {
    if (!activeWallet || !metadata || !account) {
      setError("Cannot decrypt: Wallet not connected or metadata not loaded.");
      return;
    }

    setIsDecrypting(true);
    setStatusMessage("Initiating decryption...");
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(EIP1193.toProvider({ wallet: activeWallet, client, chain: activeWallet.getChain()! }));
      const signer = provider.getSigner();

      setStatusMessage("Step 1/6: Fetching secure metadata bundle from IPFS...");
      const metachunkRes = await fetch(`https://ipfs.io/ipfs/${metadata.encrypted_file_cid}`);
      if (!metachunkRes.ok) throw new Error("Could not fetch metadata bundle from IPFS.");
      const metachunk = await metachunkRes.text();

      setStatusMessage("Step 2/6: Decrypting metadata with Lit Protocol...");
      const chunk = await decode(metachunk);
      const subchunks = split(chunk);
      if (subchunks.length < 2) throw new Error("Invalid metadata chunk format.");
      const [chunk_a, chunk_b] = subchunks;

      setStatusMessage("Step 3/6: Reconstructing encrypted data...");
      const owner = account.address;
      const timestamp = metadata.attributes.find(a => a.trait_type === "Tokenization Date")?.value;
      const counterStr = metadata.attributes.find(a => a.trait_type === "Counter")?.value;
      if (!timestamp || !counterStr) throw new Error("Missing required attributes (timestamp/counter) for decryption.");

      // Reverse the chained multiplication in the correct order
      const p2_rec = await divide(chunk_a, counterStr);
      const p1_rec = await divide(p2_rec, timestamp);
      const encryptedDataB64 = await divide(p1_rec, owner);
      const encryptedData = Buffer.from(encryptedDataB64, 'base64');

      setStatusMessage("Step 4/6: Unwrapping access key... Please sign message in wallet.");
      const wrappedDekHex = metadata.wrapped_deks[owner.toLowerCase()];
      if (!wrappedDekHex) throw new Error("Access Denied: You do not have a key for this document.");

      const nonce = ethers.utils.arrayify(metadata.nonce);
      const dek = await unwrapDek(signer, wrappedDekHex, nonce);

      setStatusMessage("Step 5/6: Decrypting file data...");
      const data = await aesGcmDecrypt(dek, encryptedData, nonce);

      setStatusMessage("Step 6/6: Verifying data integrity...");
      const a_hash_b64 = Buffer.from(await sha256(data)).toString('base64');
      const hmacKey = new TextEncoder().encode(owner + timestamp);
      const b_hash = await hmacSha256(hmacKey, encryptedData);
      const b_hash_b64 = Buffer.from(b_hash).toString('base64');

      const chunk_b_divided = await divide(chunk_b, b_hash_b64);

      if (a_hash_b64 !== chunk_b_divided) {
        throw new Error("Verification Failed! The data may be corrupt or tampered with.");
      }

      setStatusMessage("Verification successful! Displaying file.");
      const fileType = metadata.attributes.find(a => a.trait_type === "File Type")?.value || 'application/octet-stream';
      const blob = new Blob([data as any], { type: fileType });
      setDecryptedFileUrl(URL.createObjectURL(blob));

    } catch (err: any) {
      console.error("Decryption failed:", err);
      setError(`Decryption failed: ${err.message}`);
      setStatusMessage(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/my-docs/${tokenId}/edit`);
  };

  const handleViewHistory = () => {
    navigate(`/dashboard/my-docs/${tokenId}/history`);
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

  if (!metadata) return (
    <div className="text-center py-12">
      <Text color="muted">No document metadata found.</Text>
    </div>
  );

  const userHasAccess = account && metadata.wrapped_deks && metadata.wrapped_deks[account.address.toLowerCase()];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <Heading level={2} className="gradient-gold-text mb-2">
          {metadata.name}
        </Heading>
        <Text color="muted" className="max-w-2xl mx-auto">
          {metadata.description}
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Details */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={3}>Document Details</Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Text weight="semibold" className="text-yellow-400 mb-2">Description</Text>
                <Text className="bg-gray-800 p-4 rounded-lg">{metadata.description}</Text>
              </div>
              
              <div>
                <Text weight="semibold" className="text-yellow-400 mb-2">Attributes</Text>
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                  {metadata.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <Text variant="small" color="muted">{attr.trait_type}</Text>
                      <Text variant="small" weight="medium">{attr.value}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Viewer */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={3}>Document Viewer</Heading>
            </CardHeader>
            <CardContent>
              {decryptedFileUrl ? (
                <iframe src={decryptedFileUrl} className="w-full h-96 border border-gray-700 rounded" title="Document Preview" />
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <Heading level={4} className="mb-2">This document is encrypted.</Heading>
                  <Text color="muted" className="mb-4">Your private key is required to view the contents.</Text>
                  {!account && <Text color="muted" className="mb-4">Please connect your wallet to see if you have access.</Text>}
                  {account && userHasAccess && (
                    <Button
                      onClick={handleDecrypt}
                      disabled={isDecrypting}
                      variant="primary"
                      loading={isDecrypting}
                    >
                      {isDecrypting ? 'Decrypting...' : 'Decrypt & View Document'}
                    </Button>
                  )}
                  {account && !userHasAccess && (
                    <Text color="muted" className="font-semibold">
                      Your connected wallet ({account.address.slice(0, 6)}...{account.address.slice(-4)}) does not have access to this file.
                    </Text>
                  )}
                  {statusMessage && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
                      <Text variant="small" color="muted">{statusMessage}</Text>
                    </div>
                  )}
                  {error && (
                    <Text variant="small" color="muted" className="mt-4">
                      Error: {error}
                    </Text>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={3}>Actions</Heading>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                >
                  Edit Document
                </Button>
                
                <Button
                  onClick={handleViewHistory}
                  variant="ghost"
                >
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={4}>Document Info</Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Text variant="small" color="muted">Token ID</Text>
                <Text variant="small" weight="semibold" className="font-mono">
                  #{tokenId}
                </Text>
              </div>
              
              <div>
                <Text variant="small" color="muted">Encrypted File CID</Text>
                <Text variant="small" weight="semibold" className="font-mono break-all">
                  {metadata.encrypted_file_cid}
                </Text>
              </div>
              
              <div>
                <Text variant="small" color="muted">Nonce</Text>
                <Text variant="small" weight="semibold" className="font-mono break-all">
                  {metadata.nonce}
                </Text>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={4}>Security Status</Heading>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <Text variant="small">Encrypted</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <Text variant="small">IPFS Stored</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <Text variant="small">Blockchain Verified</Text>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocView;