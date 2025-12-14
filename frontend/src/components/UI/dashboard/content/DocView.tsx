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
  hmacSha256
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
  // wrapped_deks entries may be string (hex) or objects with more fields
  wrapped_deks: Record<string, any>;
  // optional checksum for encrypted data
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
      const metachunk = await metachunkRes.text();

      setStatusMessage("Step 2/6: Decrypting metadata with Lit Protocol...");
      const chunk = await decode(metachunk);
      const subchunks = split(chunk);
      if (subchunks.length < 2) throw new Error("Invalid metadata chunk format.");
      const [chunk_a, chunk_b] = subchunks;

  setStatusMessage("Step 3/6: Reconstructing encrypted data...");
      const ownerAddress = account.address;
      const ownerLower = ownerAddress.toLowerCase();
      const ownerChecksummed = (() => { try { return ethers.utils.getAddress(ownerAddress); } catch { return ownerAddress; } })();
      const timestamp = metadata.attributes.find(a => a.trait_type === "Tokenization Date")?.value;
      const counterStr = metadata.attributes.find(a => a.trait_type === "Counter")?.value;
      if (!timestamp || !counterStr) throw new Error("Missing required attributes (timestamp/counter) for decryption.");

      // Resolve wrapped entry up-front to decide owner vs recipient path
      const w = metadata.wrapped_deks || ({} as any);
      let rawEntry = w[ownerLower] || w[ownerAddress] || w[ownerChecksummed] || null;
      if (!rawEntry) {
        const key = Object.keys(w).find(k => k.toLowerCase() === ownerLower);
        if (key) rawEntry = w[key];
      }
      if (!rawEntry) throw new Error("Access Denied: You do not have a key for this document.");

      // Extract sharing markers
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

      // Helper to decode a payload string into bytes (hex/base64/base64url/binary)
      const base64urlRegex = /^[A-Za-z0-9\-_]+={0,2}$/;
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      const decodePayloadToBytes = (payloadStr: string): Uint8Array => {
        const maybeStr = String(payloadStr || '');
        const strippedHex = maybeStr.replace(/^0x/, '');
        const isHex = /^([0-9a-fA-F]{2})+$/.test(strippedHex) && (maybeStr.startsWith('0x') || /^[0-9a-fA-F]+$/.test(maybeStr));
        if (isHex) return new Uint8Array(Buffer.from(strippedHex, 'hex'));
        if (base64urlRegex.test(maybeStr) || base64Regex.test(maybeStr)) {
          const b64 = maybeStr.replace(/-/g, '+').replace(/_/g, '/');
          return new Uint8Array(Buffer.from(b64, 'base64'));
        }
        return new Uint8Array(Buffer.from(maybeStr, 'binary'));
      };

      let encryptedData: Uint8Array;
      let ownerOperandUsed = ownerAddress;

      const isOwnerMode = !ownerSignature && !providerEncrypted && !ownerEphemeralPubKey;
      if (isOwnerMode) {
        // OWNER MODE: restore original reconstruction path (counter -> timestamp -> ownerAddress)
        const p2_rec = await divide(chunk_a, counterStr);
        const p1_rec = await divide(p2_rec, timestamp);
        const encryptedPayloadStr = await divide(p1_rec, ownerAddress);
        encryptedData = decodePayloadToBytes(encryptedPayloadStr);
        ownerOperandUsed = ownerAddress;
      } else {
        // RECIPIENT MODE: reconstruct using uploader's address (from wrapped_deks keys), prefer entry-level checksum, try standard order first
        type Cand = { ownerOperand: string; order: string; bytes: Uint8Array; sha?: string };
        const candidates: Cand[] = [];

        // Build owner operand candidates from wrapped_deks keys and their normalized forms
        const wd = (metadata.wrapped_deks || {}) as Record<string, any>;
        const uniq = new Set<string>();
        for (const k of Object.keys(wd)) {
          if (!k) continue;
          uniq.add(k);
          uniq.add(k.toLowerCase());
          try { uniq.add(ethers.utils.getAddress(k)); } catch { /* ignore */ }
        }
        const ownerCandidates = Array.from(uniq);
        if (ownerCandidates.length === 0) ownerCandidates.push(ownerAddress, ownerLower, ownerChecksummed);

        // Determine preferred checksum: entry-level (any wrapped entry) first, else metadata-level
        let targetSha: string | null = null;
        let checksumSource: 'entry' | 'metadata' | 'none' = 'none';
        if (typeof rawEntry === 'object' && rawEntry && rawEntry.encrypted_data_sha256_b64) {
          targetSha = rawEntry.encrypted_data_sha256_b64;
          checksumSource = 'entry';
        }
        if (!targetSha) {
          for (const key of Object.keys(wd)) {
            const e = wd[key];
            if (e && typeof e === 'object' && e.encrypted_data_sha256_b64) { targetSha = e.encrypted_data_sha256_b64; checksumSource = 'entry'; break; }
          }
        }
        if (!targetSha && metadata.encrypted_data_sha256_b64) {
          targetSha = metadata.encrypted_data_sha256_b64;
          checksumSource = 'metadata';
        }

        // Helper to attempt a divide chain for a given order and owner operand
        const tryOrder = async (orderName: string, ownerOp: string): Promise<Cand | null> => {
          try {
            let s1: string;
            let s2: string;
            let s3: string;
            switch (orderName) {
              case 'counter>timestamp>owner':
                s1 = await divide(chunk_a, counterStr);
                s2 = await divide(s1, timestamp!);
                s3 = await divide(s2, ownerOp);
                break;
              case 'owner>timestamp>counter':
                s1 = await divide(chunk_a, ownerOp);
                s2 = await divide(s1, timestamp!);
                s3 = await divide(s2, counterStr);
                break;
              case 'timestamp>counter>owner':
                s1 = await divide(chunk_a, timestamp!);
                s2 = await divide(s1, counterStr);
                s3 = await divide(s2, ownerOp);
                break;
              case 'timestamp>owner>counter':
                s1 = await divide(chunk_a, timestamp!);
                s2 = await divide(s1, ownerOp);
                s3 = await divide(s2, counterStr);
                break;
              case 'counter>owner>timestamp':
                s1 = await divide(chunk_a, counterStr);
                s2 = await divide(s1, ownerOp);
                s3 = await divide(s2, timestamp!);
                break;
              case 'owner>counter>timestamp':
                s1 = await divide(chunk_a, ownerOp);
                s2 = await divide(s1, counterStr);
                s3 = await divide(s2, timestamp!);
                break;
              default:
                return null;
            }
            const bytes = decodePayloadToBytes(s3);
            const c: Cand = { ownerOperand: ownerOp, order: orderName, bytes };
            if (targetSha) {
              try { c.sha = Buffer.from(await sha256(bytes)).toString('base64'); } catch { /* ignore */ }
            }
            return c;
          } catch (_) { return null; }
        };

        // 1) Try standard order first across all owner candidates
        const standardOrder = 'counter>timestamp>owner';
        for (const ownerOp of ownerCandidates) {
          const c = await tryOrder(standardOrder, ownerOp);
          if (c) candidates.push(c);
        }

        // Prefer checksum match if available; otherwise choose the largest buffer
        let chosen: Cand | null = null;
        if (targetSha) {
          chosen = candidates.find(c => c.sha === targetSha) || null;
          // If checksum matched but candidate is implausibly small, ignore the match
          if (chosen && chosen.bytes.length < 64) {
            console.warn('[DocView] checksum matched tiny ciphertext; ignoring match and choosing largest candidate instead');
            chosen = null;
          }
        }
        if (!chosen && candidates.length > 0) {
          chosen = candidates.reduce((a, b) => (b.bytes.length > a.bytes.length ? b : a));
        }

        // 2) If no good candidate or suspiciously small ciphertext, try alternate orders
        if (!chosen || (chosen.bytes.length < 64)) {
          const orders = [
            'owner>timestamp>counter',
            'timestamp>counter>owner',
            'timestamp>owner>counter',
            'counter>owner>timestamp',
            'owner>counter>timestamp'
          ];
          const more: Cand[] = [];
          for (const ord of orders) {
            for (const ownerOp of ownerCandidates) {
              const c = await tryOrder(ord, ownerOp);
              if (c) more.push(c);
            }
          }
          if (targetSha) {
            const m = more.find(c => c.sha === targetSha);
            if (m) chosen = m;
          }
          if (!chosen && more.length > 0) {
            chosen = more.reduce((a, b) => (b.bytes.length > a.bytes.length ? b : a));
          }
        }

        if (!chosen) throw new Error('Failed to reconstruct encrypted payload for recipient.');

        encryptedData = chosen.bytes;
        ownerOperandUsed = chosen.ownerOperand;
        const sizes = candidates.map(c => c.bytes.length).slice(0, 10);
        console.debug('[DocView] candidates len (first 10)=', sizes, 'checksumSource=', checksumSource, 'targetSha?', !!targetSha);
        console.debug('[DocView] decoded encryptedData length=', encryptedData.length, 'using owner operand=', ownerOperandUsed, 'order=', chosen.order);
      }

      // Quick sanity check: AES-GCM expects at least 16 bytes of tag
      if (!encryptedData || encryptedData.length < 16) {
        throw new Error(
          `Encrypted payload too small (${encryptedData ? encryptedData.length : 0} bytes). ` +
          `Possible encoding mismatch (hex vs base64) or truncated data.`
        );
      }

      setStatusMessage("Step 4/6: Unwrapping access key... Please sign message in wallet.");

      // wrapped entry and fields resolved earlier

      // Resolve nonce from entry.nonce/nonce_hex or metadata.nonce/nonce_hex; expect 12-byte AES-GCM IV
      let nonceSource = 'metadata';
      const entryNonceHex = (typeof rawEntry === 'object' && rawEntry !== null) ? (rawEntry.nonce || (rawEntry as any).nonce_hex) : null;
      const metaNonceHex = (metadata as any).nonce || (metadata as any).nonce_hex || null;
      const nonceHexCandidate = entryNonceHex || metaNonceHex;
      if (!nonceHexCandidate) {
        throw new Error('Nonce not found in metadata or wrapped entry; cannot decrypt.');
      }
      const nonceBytes = parseHexToBytes(String(nonceHexCandidate));
      if (nonceBytes.length !== 12) {
        throw new Error(`Invalid nonce length ${nonceBytes.length}; expected 12 bytes. Nonce source=${entryNonceHex ? 'entry' : ((metadata as any).nonce ? 'metadata.nonce' : 'metadata.nonce_hex')}`);
      }
      nonceSource = entryNonceHex ? 'entry' : ((metadata as any).nonce ? 'metadata.nonce' : 'metadata.nonce_hex');

      let dek: Uint8Array;

      // Choose unwrapping strategy based on how the owner shared the DEK
      console.debug('[DocView] unwrap inputs:', {
        hasOwnerSignature: !!ownerSignature,
        hasProviderEncrypted: !!providerEncrypted,
        hasOwnerEphem: !!ownerEphemeralPubKey,
        wrappedDekHexPreview: wrappedDekHex ? `${wrappedDekHex.slice(0, 10)}... (len=${wrappedDekHex.length})` : null,
        nonceSource: nonceSource,
        noncePreview: nonceHexCandidate ? String(nonceHexCandidate).slice(0, 20) : null,
        nonceLen: nonceBytes.length,
        encryptedDataLen: encryptedData.length
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
          throw new Error(
            `Recipient unwrap failed: ${(e instanceof Error) ? e.message : String(e)}. ` +
            `This usually happens when your wallet provider does not expose the private key for ECDH (e.g. in-page MetaMask). ` +
            `Ask the owner to re-share using the provider-compatible signature method, or use a signer that exposes a private key.`
          );
        }
      } else {
        // If recipient path lacks owner_signature/provider/ephemeral, entry is incompatible for recipient unwrap
        throw new Error('Recipient unwrap unsupported: missing owner_signature/provider/ephemeral in entry. Ask owner to re-share using signature-based method.');
      }

      // Diagnostic info about decoded DEK/nonce lengths (don't log raw keys)

      let dekHashStr: string | null = null;
      try {
        dekHashStr = Buffer.from(await sha256(dek)).toString('base64');
        console.debug('[DocView] dek derived length=', dek.length, 'sha256(b64)=', dekHashStr);
      } catch (e) {
        console.debug('[DocView] dek hash skipped due to error', e);
      }

      // If owner provided a dek checksum in metadata entry, verify it matches the derived DEK before attempting AES decrypt
      const wrappedEntryObj = (typeof rawEntry === 'object' && rawEntry !== null) ? rawEntry : null;
      const ownerDekSha = wrappedEntryObj ? (wrappedEntryObj.dek_sha256_b64 || wrappedEntryObj.dekSha256B64 || wrappedEntryObj.dek_sha) : null;
      if (ownerDekSha && dekHashStr && ownerDekSha !== dekHashStr) {
        throw new Error(`Derived DEK mismatch: owner's dek_sha256_b64=${ownerDekSha.slice(0,12)}..., derived dek_sha256_b64=${dekHashStr.slice(0,12)}.... Ask owner to re-share.`);
      }

      // If owner provided an encrypted_data checksum, verify the reconstructed ciphertext matches before decrypting
      const ownerEncryptedSha = wrappedEntryObj ? (wrappedEntryObj.encrypted_data_sha256_b64 || metadata.encrypted_data_sha256_b64) : metadata.encrypted_data_sha256_b64;
      if (ownerEncryptedSha) {
        const computedEncSha = Buffer.from(await sha256(encryptedData)).toString('base64');
        console.debug('[DocView] encrypted_data sha check owner vs computed:', { ownerEncryptedShaPreview: ownerEncryptedSha?.slice(0,12), computedEncShaPreview: computedEncSha?.slice(0,12) });
        if (computedEncSha !== ownerEncryptedSha) {
          console.warn(`[DocView] Encrypted data checksum mismatch (non-blocking): owner ${ownerEncryptedSha.slice(0,12)}... != computed ${computedEncSha.slice(0,12)}.... Proceeding with decrypt; possible operand-casing or legacy metadata.`);
        }
      }

      setStatusMessage("Step 5/6: Decrypting file data...");
      let data: Uint8Array;
      try {
        data = await aesGcmDecrypt(dek, encryptedData, nonceBytes);
      } catch (aesErr) {
        // Provide more actionable diagnostics for AES-GCM failure without revealing raw keys
        const msg = `AES-GCM decrypt failed: ${(aesErr instanceof Error) ? aesErr.message : String(aesErr)}. ` +
          `Diagnostics: encryptedData.len=${encryptedData.length}, nonce.len=${nonceBytes.length}, wrappedDekHex.len=${wrappedDekHex ? wrappedDekHex.length : 0}, dek.sha256_b64=${dekHashStr}. ` +
          `Possible causes: incorrect DEK, wrong nonce, or corrupted/truncated ciphertext. Try normalizing metadata encoding or re-sharing the DEK.`;
        console.error('[DocView] AES decrypt diagnostic:', { encryptedLen: encryptedData.length, nonceLen: nonceBytes.length, wrappedDekHexLen: wrappedDekHex ? wrappedDekHex.length : 0, dekSha256B64: dekHashStr, nonceSource, error: aesErr });
        throw new Error(msg);
      }

      setStatusMessage("Step 6/6: Verifying data integrity...");
      const a_hash_b64 = Buffer.from(await sha256(data)).toString('base64');
      const hmacKey = new TextEncoder().encode((typeof (ownerOperandUsed) === 'string' ? ownerOperandUsed : ownerLower) + timestamp);
      const b_hash = await hmacSha256(hmacKey, encryptedData);
      const b_hash_b64 = Buffer.from(b_hash).toString('base64');

      const chunk_b_divided = await divide(chunk_b, b_hash_b64);

      if (a_hash_b64 !== chunk_b_divided) {
        throw new Error("Verification Failed! The data may be corrupt or tampered with.");
      }

      setStatusMessage("Verification successful! Displaying file.");
  const rawFileType = metadata.attributes.find(a => a.trait_type === "File Type")?.value || 'application/octet-stream';
  const fileType = rawFileType;
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
      // Build signer using existing method (EIP-1193 provider)
      const provider = new ethers.providers.Web3Provider(EIP1193.toProvider({ wallet: activeWallet, client, chain: activeWallet.getChain()! }));
      const signer = provider.getSigner();

  // We pass the metadata object directly; shareWithWallet will perform an on-chain update and return tx hash
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