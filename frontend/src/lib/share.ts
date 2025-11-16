import { wrapDekForRecipientWithSignature, unwrapDek, sha256, decode, split, divide } from './crypto';
import { ethers } from 'ethers';
import { client } from './thirdweb';
import { defineChain } from 'thirdweb/chains';
import NFTDocABI from '../abi/NFTDoc.json';
import { getContract } from 'thirdweb';
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { Buffer } from 'buffer';

window.Buffer = window.Buffer || Buffer;

const CHAIN = defineChain(84532);
const CONTRACT_ADDRESS = '0x42F1a118C13083b64b2b775e5Ac01EF1429c51cd';

// Helper: load metadata JSON from IPFS gateway or accept a passed object
export async function loadMetadata(metadataCidOrObj: string | object): Promise<any> {
  if (!metadataCidOrObj) throw new Error('metadataCidOrObj required');
  if (typeof metadataCidOrObj === 'object') return metadataCidOrObj;
  const s = String(metadataCidOrObj).trim();
  // Accept ipfs:// prefix, plain CID, or gateway url
  let url = s;
  if (s.startsWith('ipfs://')) {
    url = 'https://ipfs.io/ipfs/' + s.replace(/^ipfs:\/\//, '');
  } else if (/^https?:\/\//.test(s)) {
    url = s;
  } else {
    // assume CID
    url = 'https://ipfs.io/ipfs/' + s;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load metadata from IPFS: ${res.status}`);
  return await res.json();
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  if (hex.length % 2 === 1) hex = '0' + hex;
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < b.length; i++) b[i] = parseInt(hex.substr(i * 2, 2), 16);
  return b;
}

/**
 * shareWithWallet
 * - owner: ethers.Signer
 * - account: thirdweb account object (from useActiveAccount())
 * - tokenId: token id (string|number)
 * - metadataCidOrObj: IPFS CID string or already-loaded metadata object
 * - recipientAddress: 0x... address
 *
 * Behavior: unwrap owner's DEK, wrap for recipient, append entry to metadata,
 * then submit an on-chain updateNFT(tokenId, tokenURI) transaction with the
 * updated metadata embedded as a data:application/json;base64 URI.
 */
export async function shareWithWallet(
  owner: ethers.Signer,
  account: any,
  tokenId: string | number,
  metadataCidOrObj: string | object,
  recipientAddress: string
) {
  try {
    const metadata = await loadMetadata(metadataCidOrObj);
    if (!metadata) throw new Error('Metadata not found');

    // Support multiple metadata shapes for wrapped_deks
    const ownerAddress = (await owner.getAddress()).toLowerCase();

    // metadata may store nonce at top-level or per-entry
    const nonceHexTop = metadata.nonce || metadata.nonce_hex || null;

    // Determine owner's wrapped entry
    let ownerEntry: any = null;
    if (Array.isArray(metadata.wrapped_deks)) {
      ownerEntry = metadata.wrapped_deks.find((e: any) => (e.address || '').toLowerCase() === ownerAddress);
    } else if (metadata.wrapped_deks && typeof metadata.wrapped_deks === 'object') {
      const key = Object.keys(metadata.wrapped_deks).find(k => k.toLowerCase() === ownerAddress);
      if (key) {
        const val = metadata.wrapped_deks[key];
        if (typeof val === 'string') ownerEntry = { address: key, wrapped_dek: val, nonce: nonceHexTop };
        else ownerEntry = { address: key, ...val, nonce: val.nonce || nonceHexTop };
      }
    }

    if (!ownerEntry) throw new Error("Owner's wrapped DEK entry not found in metadata");

    const ownerWrappedDekHex = ownerEntry.wrapped_dek || ownerEntry.wrappedDek || ownerEntry.wrapped || null;
    if (!ownerWrappedDekHex) throw new Error("Owner's wrapped DEK hex missing");

    const nonceHex = ownerEntry.nonce || nonceHexTop;
    if (!nonceHex) throw new Error('Nonce not found in metadata entry');
    const nonce = hexToUint8Array(nonceHex.replace(/^0x/, ''));

    // unwrap using owner's signer
    const dek = await unwrapDek(owner, ownerWrappedDekHex, nonce);

    // Skipping recipient pubkey retrieval; using signature-based wrapping only (no raw private key required)

    // Prefer signature-based wrapping so recipients don't need access to a raw private key
    // This derives a KEK from the owner's signature and embeds owner_signature in metadata
    const { wrappedDekHex, ownerSignature } = await wrapDekForRecipientWithSignature(owner, recipientAddress, dek, nonce);

    // compute non-sensitive dek checksum to help recipient verify correct key derivation
    const dekShaB64 = Buffer.from(await sha256(dek)).toString('base64');

    // Attempt to fetch the encrypted metachunk (if present) and compute a checksum of the ciphertext
    let encryptedDataShaB64: string | null = null;
    try {
      if (metadata.encrypted_file_cid) {
        const cid = String(metadata.encrypted_file_cid).replace(/^ipfs:\/\//, '');
        const metachunkResp = await fetch(`https://ipfs.io/ipfs/${cid}`);
        if (metachunkResp.ok) {
          const metachunkText = await metachunkResp.text();
          try {
            // Decode the metachunk and reconstruct the encrypted payload using the same logic as the viewer
            const chunk = await decode(metachunkText);
            const subchunks = split(chunk);
            if (subchunks.length >= 2) {
              const [chunk_a] = subchunks;
              // Extract required attributes
              const timestamp = metadata.attributes?.find((a: any) => String(a.trait_type || '').toLowerCase() === 'tokenization date')?.value
                || metadata.attributes?.find((a: any) => /date/i.test(String(a.trait_type)))?.value;
              const counterStr = metadata.attributes?.find((a: any) => String(a.trait_type || '').toLowerCase() === 'counter')?.value;
              if (timestamp && counterStr) {
                // Reverse the chained multiplication in the correct order: /counter -> /timestamp -> /owner
                const p2_rec = await divide(chunk_a, counterStr);
                const p1_rec = await divide(p2_rec, timestamp);
                const encryptedPayloadStr = await divide(p1_rec, ownerAddress);

                // Normalize string to bytes (hex, base64/base64url, or binary)
                const maybeStr = String(encryptedPayloadStr || '');
                const strippedHex = maybeStr.replace(/^0x/, '');
                const isHex = /^([0-9a-fA-F]{2})+$/.test(strippedHex) && (maybeStr.startsWith('0x') || /^[0-9a-fA-F]+$/.test(maybeStr));
                const base64urlRegex = /^[A-Za-z0-9\-_]+={0,2}$/;
                const base64Regex = /^[A-Za-z0-9+/]+=*$/;
                let edBytes: Uint8Array;
                if (isHex) {
                  edBytes = new Uint8Array(Buffer.from(strippedHex, 'hex'));
                } else if (base64urlRegex.test(maybeStr) || base64Regex.test(maybeStr)) {
                  const b64 = maybeStr.replace(/-/g, '+').replace(/_/g, '/');
                  edBytes = new Uint8Array(Buffer.from(b64, 'base64'));
                } else {
                  edBytes = new Uint8Array(Buffer.from(maybeStr, 'binary'));
                }
                encryptedDataShaB64 = Buffer.from(await sha256(edBytes)).toString('base64');
                // also attach top-level checksum
                (metadata as any).encrypted_data_sha256_b64 = encryptedDataShaB64;
              }
            }
          } catch (inner) {
            console.warn('Failed to reconstruct encrypted payload for checksum:', inner);
          }
        }
      }
    } catch (e) {
      // non-fatal: continue without encrypted_data checksum
      console.warn('Could not fetch or hash metachunk for encrypted_data checksum', e);
    }

    // Append to metadata in a compatible shape (include owner_signature, dek_sha256_b64, and always encrypted_data_sha256_b64 for recipient-side verification)
    metadata.wrapped_deks = metadata.wrapped_deks || ({} as any);
    const entry: any = { wrapped_dek: wrappedDekHex, owner_signature: ownerSignature, dek_sha256_b64: dekShaB64 };
    // Always attach encrypted_data_sha256_b64, even if null (for diagnostics)
    entry.encrypted_data_sha256_b64 = encryptedDataShaB64 || null;
    if (Array.isArray(metadata.wrapped_deks)) {
      metadata.wrapped_deks.push({ address: recipientAddress, ...entry });
    } else {
      metadata.wrapped_deks[recipientAddress.toLowerCase()] = entry;
    }

    // Build tokenURI and submit on-chain update (updateNFT)
    const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;

    const contract = getContract({ address: CONTRACT_ADDRESS, abi: NFTDocABI as any, client, chain: CHAIN });
    const tx = prepareContractCall({ contract, method: 'function updateNFT(uint256,string)', params: [BigInt(tokenId as any), tokenURI] });
    const sent = await sendTransaction({ transaction: tx, account });
    await waitForReceipt({ client, chain: CHAIN, transactionHash: sent.transactionHash });
    return sent.transactionHash;
  } catch (err) {
    console.error('shareWithWallet failed:', err);
    throw err;
  }
}

export default {
  shareWithWallet,
  loadMetadata,
};
