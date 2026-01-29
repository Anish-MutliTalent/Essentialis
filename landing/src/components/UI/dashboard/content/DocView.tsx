// DocView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from 'thirdweb/wallets';

import { Button, Card, CardHeader, CardContent, Heading, Text, LoadingSpinner } from '../../index';
import { client } from '../../../../lib/thirdweb';
import { friendlyFileTypeLabel } from '../../../../lib/docs';
import MediaViewer from './MediaViewer';

import {
  unwrapDek,
  unwrapSharedDek,
  unwrapSharedDekWithSignature,
  unwrapSharedDekWithProvider,
  aesGcmDecrypt,
  decode,
  split,
  divide,
  sha256,
  hmacSha256,
  _toU8
} from '../../../../lib/crypto';
import { shareWithWallet } from '../../../../lib/share';

window.Buffer = window.Buffer || Buffer;

function parseHexToBytes(hexStr: string): Uint8Array {
  let s = String(hexStr || '').trim();
  if (!s) throw new Error('Empty hex string for nonce');
  if (s.startsWith('0x')) s = s.slice(2);
  if (s.length % 2 === 1) s = '0' + s;
  if (!/^[0-9a-fA-F]+$/.test(s)) throw new Error('Nonce is not valid hex');
  return new Uint8Array(Buffer.from(s, 'hex'));
}

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
  wrapped_deks: Record<string, any>;
  encrypted_data_sha256_b64?: string;
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
  const [recipientAddress, setRecipientAddress] = useState('');
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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
      const metachunkRes = await fetch(`/api/ipfs/${metadata.encrypted_file_cid}`);
      if (!metachunkRes.ok) throw new Error("Could not fetch metadata bundle from IPFS.");
      let metachunk: Uint8Array<ArrayBufferLike> | null = new Uint8Array(await metachunkRes.arrayBuffer())

      setStatusMessage("Step 2/6: Fetching metadata...");
      const chunk = await decode(metachunk);
      const subchunks = split(chunk);
      if (subchunks.length < 2) throw new Error("Invalid metadata chunk format.");
      const [chunk_a, chunk_b] = subchunks;

      setStatusMessage("Step 3/6: Unwrapping access key...");
      const timestamp = metadata.attributes.find(a => a.trait_type === "Tokenization Date")?.value;
      const counterStr = metadata.attributes.find(a => a.trait_type === "Counter")?.value;
      if (!timestamp || !counterStr) throw new Error("Missing required attributes (timestamp/counter) for decryption.");

      const w = metadata.wrapped_deks || ({} as any);

      const ownerLower = account.address.toLowerCase();
      const ownerChecksummed = (() => { try { return ethers.utils.getAddress(account.address); } catch { return account.address; } })();

      // 1. Robustly find the user's entry (Array or Object)
      let rawEntry: any = null;
      if (Array.isArray(w)) {
        rawEntry = w.find((e: any) => {
          const addr = (e.address || '').toLowerCase();
          return addr === ownerLower;
        });
      } else {
        // Object format: keys are addresses
        rawEntry = w[ownerLower] || w[account.address] || w[ownerChecksummed] || null;
        if (!rawEntry) {
          const key = Object.keys(w).find(k => k.toLowerCase() === ownerLower);
          if (key) rawEntry = w[key];
        }
      }

      if (!rawEntry) throw new Error("Access Denied: You do not have a key for this document.");

      let wrappedDekHex: string | null = null;
      let ownerEphemeralPubKey: string | undefined;
      let ownerSignature: string | undefined;
      let providerEncrypted: any = undefined;

      if (typeof rawEntry === 'string') {
        wrappedDekHex = rawEntry;
      } else if (typeof rawEntry === 'object' && rawEntry !== null) {
        if (rawEntry.wrapped_dek) wrappedDekHex = rawEntry.wrapped_dek;
        if (rawEntry.wrappedDek) wrappedDekHex = wrappedDekHex || rawEntry.wrappedDek;
        ownerEphemeralPubKey = rawEntry.owner_ephemeral_pubkey || rawEntry.ownerEphemPubKey || rawEntry.ownerEphemeralPubKey;
        ownerSignature = rawEntry.owner_signature || rawEntry.ownerSignature || rawEntry.owner_sig;
        providerEncrypted = rawEntry.provider_encrypted || rawEntry.providerEncrypted || rawEntry.provider;
      }
      if (!wrappedDekHex) throw new Error('Wrapped DEK not found in metadata entry; unable to decrypt.');

      let nonceSource = 'metadata';
      const entryNonceHex = (typeof rawEntry === 'object' && rawEntry !== null) ? (rawEntry.nonce || (rawEntry as any).nonce_hex) : null;
      const metaNonceHex = (metadata as any).nonce || (metadata as any).nonce_hex || null;
      const nonceHexCandidate = entryNonceHex || metaNonceHex;
      if (!nonceHexCandidate) throw new Error('Nonce not found in metadata or wrapped entry; cannot decrypt.');
      const nonceBytes = parseHexToBytes(String(nonceHexCandidate));
      if (nonceBytes.length !== 12) throw new Error(`Invalid nonce length ${nonceBytes.length}; expected 12 bytes.`);

      setStatusMessage("Step 3/6: Unwrapping access key... Please sign message in wallet.");
      const isOwnerMode = !ownerSignature && !providerEncrypted && !ownerEphemeralPubKey;
      let dek: Uint8Array;

      console.debug('[DocView] unwrap inputs:', {
        hasOwnerSignature: !!ownerSignature,
        nonceLen: nonceBytes.length
      });

      if (isOwnerMode) {
        dek = await unwrapDek(signer, wrappedDekHex, nonceBytes);
      } else if (ownerSignature) {
        dek = await unwrapSharedDekWithSignature(signer, ownerSignature, wrappedDekHex, nonceBytes);
      } else if (providerEncrypted) {
        dek = await unwrapSharedDekWithProvider(signer, providerEncrypted);
      } else if (ownerEphemeralPubKey) {
        try {
          dek = await unwrapSharedDek(signer, ownerEphemeralPubKey, wrappedDekHex, nonceBytes);
        } catch (e) {
          throw new Error(`Recipient unwrap failed: ${String(e)}`);
        }
      } else {
        throw new Error('Recipient unwrap unsupported: entry missing signature/provider info.');
      }

      let dekHashStr: string | null = null;
      try { dekHashStr = Buffer.from(await sha256(dek)).toString('base64'); } catch (e) { }
      const wrappedEntryObj = (typeof rawEntry === 'object' && rawEntry !== null) ? rawEntry : null;
      const ownerDekSha = wrappedEntryObj ? (wrappedEntryObj.dek_sha256_b64 || wrappedEntryObj.dekSha256B64 || wrappedEntryObj.dek_sha) : null;
      if (ownerDekSha && dekHashStr && ownerDekSha !== dekHashStr) {
        throw new Error(`Derived DEK mismatch. Ask owner to re-share.`);
      }

      setStatusMessage("Step 4/5: Locating and decrypting payload...");

      const candidates = new Set<string>();
      candidates.add(account.address.toLowerCase());
      try { candidates.add(ethers.utils.getAddress(account.address)); } catch { }

      // 2. Robustly extract candidate owner addresses (Array or Object)
      if (Array.isArray(w)) {
        w.forEach((e: any) => {
          if (e.address) {
            candidates.add(e.address.toLowerCase());
            try { candidates.add(ethers.utils.getAddress(e.address)); } catch { }
          }
        });
      } else {
        Object.keys(w).forEach(k => {
          candidates.add(k.toLowerCase());
          try { candidates.add(ethers.utils.getAddress(k)); } catch { }
        });
      }

      console.debug('[DocView] Candidates found:', Array.from(candidates));

      let decryptedData: Uint8Array | null = null;
      let usedEncryptedData: Uint8Array | null = null;
      let usedOwnerAddress = "";

      for (const addr of candidates) {
        try {
          const candidateEnc = divide(
            divide(
              divide(chunk_a, _toU8(addr)),
              _toU8(timestamp)
            ),
            _toU8(counterStr)
          );

          if (!candidateEnc || candidateEnc.length < 16) continue;

          const candidateDec = await aesGcmDecrypt(dek, candidateEnc, nonceBytes);

          decryptedData = candidateDec;
          usedEncryptedData = candidateEnc;
          usedOwnerAddress = addr;
          console.debug(`[DocView] Decryption successful with address: ${addr}`);
          break;
        } catch (e) { }
      }

      if (!decryptedData || !usedEncryptedData) {
        console.warn("[DocView] All candidate addresses failed to decrypt. Trying current account to surface error.");
        const fallbackEnc = divide(
          divide(
            divide(chunk_a, _toU8(account.address)),
            _toU8(timestamp)
          ),
          _toU8(counterStr)
        );
        try {
          decryptedData = await aesGcmDecrypt(dek, fallbackEnc, nonceBytes);
          usedEncryptedData = fallbackEnc;
          usedOwnerAddress = account.address;
        } catch (err: any) {
          const msg = `AES-GCM decrypt failed: ${(err instanceof Error) ? err.message : String(err)}.`;
          console.error('[DocView] AES decrypt diagnostic:', { encryptedLen: fallbackEnc.length, nonceLen: nonceBytes.length, error: err });
          throw new Error(msg);
        }
      }

      const encryptedData = usedEncryptedData;
      const ownerOperandUsed = usedOwnerAddress;
      const data = decryptedData;

      setStatusMessage("Step 6/6: Verifying data integrity...");
      const a_hash = await sha256(data);
      const hmacKey = new TextEncoder().encode(ownerOperandUsed + timestamp);
      const b_hash = await hmacSha256(hmacKey, encryptedData);

      const chunk_b_divided = divide(chunk_b, b_hash);

      if (Buffer.from(a_hash).toString('base64') !== Buffer.from(chunk_b_divided).toString('base64')) {
        throw new Error("Verification Failed! The data may be corrupt or tampered with.");
      }

      setStatusMessage("Verification successful! Displaying file.");
      const rawFileType = metadata.attributes.find(a => a.trait_type === "File Type")?.value || 'application/octet-stream';
      const fileType = rawFileType;
      const blob = new Blob([data as any], { type: fileType });
      setDecryptedFileUrl(URL.createObjectURL(blob));

    } catch (err: any) {
      console.error("Decryption failed:", err);
      setError(`Decryption failed: ${err}`);
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

  const handleShare = async () => {
    if (!activeWallet || !metadata || !account) {
      setShareStatus('Connect wallet and load metadata first.');
      return;
    }
    if (!recipientAddress || !recipientAddress.startsWith('0x')) {
      setShareStatus('Enter a valid recipient address (0x...).');
      return;
    }

    setIsSharing(true);
    setShareStatus('Sharing...');
    try {
      const provider = new ethers.providers.Web3Provider(EIP1193.toProvider({ wallet: activeWallet, client, chain: activeWallet.getChain()! }));
      const signer = provider.getSigner();

      const txHash = await shareWithWallet(signer, account, tokenId!, metadata, recipientAddress);
      setShareStatus(`✅ Shared on-chain. Transaction: ${txHash}`);
    } catch (e: any) {
      console.error('Share failed', e);
      setShareStatus(`Failed to share: ${e?.message || String(e)}`);
    } finally {
      setIsSharing(false);
    }
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
  const fileType = metadata.attributes.find(a =>
    a.trait_type.toLowerCase().includes('file type')
  )?.value || '';

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
                  {metadata.attributes.map((attr, index) => {
                    const traitLower = String(attr.trait_type || '').toLowerCase();
                    const isFileTypeAttr = traitLower === 'file type' || traitLower === 'filetype' || (traitLower.includes('file') && traitLower.includes('type'));
                    const displayValue = isFileTypeAttr
                      ? friendlyFileTypeLabel(attr.value)
                      : attr.value;
                    return (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <Text variant="small" color="muted">{attr.trait_type}</Text>
                        <Text variant="small" weight="medium">{displayValue}</Text>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Viewer */}
          <Card variant="professional">
            <CardHeader>
              <Heading level={3}>Document Viewer</Heading>
            </CardHeader>
            <CardContent className="h-full w-full">
              {decryptedFileUrl ? (
                <MediaViewer fileUrl={decryptedFileUrl} fileType={fileType} containerClassName="h-[600px]" />
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

              {/* Sharing UI - visible to holders with wrapped DEK (owner/uploader) */}
              {account && metadata && metadata.wrapped_deks && metadata.wrapped_deks[account.address.toLowerCase()] && (
                <div className="mt-4 border-t pt-4 w-full">
                  <Heading level={4} className="mb-2">Share this document</Heading>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter recipient wallet address (0x...)"
                      className="flex-grow border rounded-lg px-3 py-2 bg-gray-900"
                    />
                    <Button onClick={handleShare} disabled={isSharing} variant="primary" loading={isSharing}>
                      {isSharing ? 'Sharing...' : 'Share'}
                    </Button>
                  </div>
                  {shareStatus && <Text variant="small" className="mt-2" color="muted">{shareStatus}</Text>}
                </div>
              )}
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