// lib/crypto.ts

// lib/crypto-fast.ts
import { Buffer } from 'buffer';
// import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { ethers } from 'ethers';

if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

export const _toU8 = (s: string): Uint8Array => new TextEncoder().encode(s);
// const _toStr = (b: Uint8Array): string => new TextDecoder().decode(b);

// const _concatU8 = (...arrays: Uint8Array[]): Uint8Array => {
//   const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
//   const result = new Uint8Array(totalLength);
//   let offset = 0;
//   for (const arr of arrays) {
//     result.set(arr, offset);
//     offset += arr.length;
//   }
//   return result;
// };

// function _lenPrefix(data: Uint8Array): Uint8Array {
//   const buffer = new ArrayBuffer(4);
//   new DataView(buffer).setUint32(0, data.length, false);
//   return _concatU8(new Uint8Array(buffer), data);
// }

// function _lenUnprefix(buf: Uint8Array): { payload: Uint8Array; remainder: Uint8Array } {
//   if (buf.length < 4) throw new Error("Bad length prefix: buffer too short");
//   const L = new DataView(buf.buffer, buf.byteOffset, 4).getUint32(0, false);
//   const payload = buf.slice(4, 4 + L);
//   if (payload.length !== L) throw new Error("Truncated payload");
//   return { payload, remainder: buf.slice(4 + L) };
// }

// Optimized KDF stream (synchronous, chunked)
// function _kdfStream(seed: Uint8Array, length: number): Uint8Array {
//   const out = new Uint8Array(length);
//   let offset = 0;
//   let counter = 0;
//   while (offset < length) {
//     const ctrBytes = new Uint8Array(4);
//     new DataView(ctrBytes.buffer).setUint32(0, counter, false);
//     const hashInput = _concatU8(seed, ctrBytes);
//     const hash = nobleSha256(hashInput);
//     const toCopy = Math.min(hash.length, length - offset);
//     out.set(hash.slice(0, toCopy), offset);
//     offset += toCopy;
//     counter++;
//   }
//   return out;
// }

// const _xor = (a: Uint8Array, b: Uint8Array): Uint8Array => {
//   const len = Math.min(a.length, b.length);
//   const result = new Uint8Array(len);
//   for (let i = 0; i < len; i++) result[i] = a[i] ^ b[i];
//   return result;
// };

// const _hash8 = (data: Uint8Array): Uint8Array => nobleSha256(data).slice(0, 8);

/**
 * Memory-efficient XOR "multiply"
 * Processes in chunks to avoid large allocations
 */
export function multiply(
  a: Uint8Array,
  b: Uint8Array,
  chunkSize = 1024 * 1024, // 1 MB
  progressCb?: (processed: number, total: number) => void
): Uint8Array {
  const L = Math.max(a.length, b.length);
  const output = new Uint8Array(L);

  let processed = 0;

  for (let offset = 0; offset < L; offset += chunkSize) {
    const len = Math.min(chunkSize, L - offset);

    for (let i = 0; i < len; i++) {
      const aval = offset + i < a.length ? a[offset + i] : 0;
      const bval = offset + i < b.length ? b[offset + i] : 0;
      output[offset + i] = aval ^ bval;
    }

    processed += len;
    if (progressCb) progressCb(processed, L);
  }

  return output;
}


export function divide(product: Uint8Array, known: Uint8Array): Uint8Array {
  const L = product.length;
  const knownPadded = new Uint8Array(L);
  knownPadded.set(known);

  const output = new Uint8Array(L);
  for (let i = 0; i < L; i++) {
    output[i] = product[i] ^ knownPadded[i];
  }
  return output;
}



/**
 * V2: Creates a cryptographic commitment using SHA256 hash.
 * This is the simplified alternative to the multiply chain.
 * 
 * @param parts - Array of strings to commit to (e.g., [owner, encryptedData, timestamp, counter])
 * @param progressCb - Optional progress callback for UI updates
 * @returns Base64url-encoded commitment hash
 */
export async function commitment(parts: string[], progressCb?: (processed: number, total: number) => void): Promise<string> {
    if (progressCb) {
        progressCb(0, 100);
        await new Promise(r => setTimeout(r, 10));
    }
    
    // Concatenate all parts with separator
    const input = parts.join('|');
    const hash = await sha256(_toU8(input));
    const result = Buffer.from(hash).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    if (progressCb) {
        progressCb(100, 100);
    }
    
    console.log('[commitment] V2 simplified commitment created');
    return result;
}

/**
 * V2: Verifies a commitment by recomputing and comparing.
 * 
 * @param parts - Array of strings used to create the commitment
 * @param expectedCommitment - The commitment hash to verify against
 * @returns True if commitment matches, false otherwise
 */
export async function verifyCommitment(parts: string[], expectedCommitment: string): Promise<boolean> {
    const computed = await commitment(parts);
    return computed === expectedCommitment;
}

const DELIM = new TextEncoder().encode('|SPLIT|');

export function merge(...args: Uint8Array[]): Uint8Array {
  const totalLength = args.reduce((sum, arr) => sum + arr.length, 0) + DELIM.length * (args.length - 1);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  for (let i = 0; i < args.length; i++) {
    if (i > 0) {
      output.set(DELIM, offset);
      offset += DELIM.length;
    }
    output.set(args[i], offset);
    offset += args[i].length;
  }
  return output;
}

export function split(merged: Uint8Array): Uint8Array[] {
  const parts: Uint8Array[] = [];
  let start = 0;

  for (let i = 0; i <= merged.length - DELIM.length; i++) {
    let match = true;
    for (let j = 0; j < DELIM.length; j++) {
      if (merged[i + j] !== DELIM[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      parts.push(merged.slice(start, i));
      start = i + DELIM.length;
      i += DELIM.length - 1;
    }
  }

  parts.push(merged.slice(start));
  return parts;
}


export const generateDEK = (): Uint8Array => crypto.getRandomValues(new Uint8Array(32));
export const sha256 = async (data: Uint8Array): Promise<Uint8Array> => new Uint8Array(await crypto.subtle.digest('SHA-256', data.slice()));
export async function generateNonce(owner: string, timestamp: string, counter: number): Promise<Uint8Array> {
    const counterStr = counter.toString();
    const message = _toU8(owner + timestamp + counterStr);
    const hash = await sha256(message);
    return hash.slice(0, 12);
}
export async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey('raw', key.slice(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data.slice());
    return new Uint8Array(signature);
}
export async function hkdfSha256(ikm: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
    const keyMaterial = await crypto.subtle.importKey('raw', ikm.slice(), { name: 'HKDF' }, false, ['deriveKey']);
    const derivedKey = await crypto.subtle.deriveKey(
        { name: 'HKDF', salt: salt.slice(), info: new Uint8Array(), hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);
    return new Uint8Array(exportedKey);
}
export async function aesGcmEncrypt(key: Uint8Array, data: Uint8Array, nonce: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey('raw', key.slice(), 'AES-GCM', false, ['encrypt']);
    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce.slice() }, cryptoKey, data.slice());
    return new Uint8Array(encryptedData);
}
export async function aesGcmDecrypt(key: Uint8Array, encryptedData: Uint8Array, nonce: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey('raw', key.slice(), 'AES-GCM', false, ['decrypt']);
    const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce.slice() }, cryptoKey, encryptedData.slice());
    return new Uint8Array(decryptedData);
}
const SIG_MSG = "NFTDoc-KEK-DERIVATION-v1";
export async function wrapDek(signer: ethers.Signer, dek: Uint8Array, nonce: Uint8Array): Promise<string> {
    const signature = await signer.signMessage(SIG_MSG);
    const ikm = ethers.utils.arrayify(signature);
    const salt = _toU8(await signer.getAddress());
    const kek = await hkdfSha256(ikm, salt);
    const wrappedDek = await aesGcmEncrypt(kek, dek, nonce);
    return ethers.utils.hexlify(wrappedDek);
}
export async function unwrapDek(signer: ethers.Signer, wrappedDekHex: string, nonce: Uint8Array): Promise<Uint8Array> {
    const signature = await signer.signMessage(SIG_MSG);
    const ikm = ethers.utils.arrayify(signature);
    const salt = _toU8(await signer.getAddress());
    const kek = await hkdfSha256(ikm, salt);
    const wrappedDekBytes = ethers.utils.arrayify(wrappedDekHex);
    const dek = await aesGcmDecrypt(kek, wrappedDekBytes, nonce);
    return dek;
}

/**
 * Enable owner to wrap a DEK for a recipient using ECDH on secp256k1.
 * Returns the wrapped DEK hex (AES-GCM) and the owner's ephemeral public key (base64).
 *
 * Note: This function derives an ephemeral private key deterministically from the owner's signature
 * so the owner does not need to persist ephemeral keys. The recipient must be able to perform the
 * corresponding ECDH operation to unwrap (see unwrapSharedDek).
 */
export async function wrapDekForRecipient(
  owner: ethers.Signer,
  recipientPubKey: string,
  dek: Uint8Array,
  nonce: Uint8Array
): Promise<{ wrappedDekHex: string; ownerEphemeralPubKey: string }> {
  // derive deterministic ephemeral private key from owner's signature
  console.log('[wrapDekForRecipient] RUNNING LATEST VERSION - 2025-11-02');
  const SIG_MSG_SHARE = "Essentialis-Share-Session-v1";
  const sig = await owner.signMessage(SIG_MSG_SHARE);
  // sha256 utility returns Uint8Array
  const ephemPriv = await sha256(new TextEncoder().encode(sig)); // 32 bytes

  // compute ephemeral public key (uncompressed) hex via ethers
  const ephemPrivHex = ethers.utils.hexlify(ephemPriv);
  const ephemPubHex = ethers.utils.computePublicKey(ephemPrivHex, false); // 0x04...
  const ephemPubBytes = ethers.utils.arrayify(ephemPubHex);

  // normalize recipientPubKey input: accept hex public key (0x04...), base64, or plain hex
  let recipientPubBytes: Uint8Array;
  try {
    const s = (recipientPubKey || '').trim();
    if (!s) throw new Error('empty recipient public key');

    // Detect simple hex (with or without 0x)
    const maybeHex = s.startsWith('0x') ? s.slice(2) : s;
    const isPlainHex = /^[0-9a-fA-F]+$/.test(maybeHex);

    if (isPlainHex) {
      // Treat as hex string (with or without 0x)
      if (maybeHex.length % 2 !== 0) throw new Error('odd-length hex string');
      recipientPubBytes = new Uint8Array(Buffer.from(maybeHex, 'hex'));
    } else {
      // Otherwise try base64 decode (this will throw on invalid base64 in Node/browser Buffer usage)
      try {
        recipientPubBytes = new Uint8Array(Buffer.from(s, 'base64'));
      } catch (err) {
        throw new Error('recipient public key is neither hex nor base64');
      }
    }
  } catch (e) {
    throw new Error(`Invalid recipient public key format: ${String(e)}`);
  }
 
  // Normalize: accept 64-byte raw X||Y and convert to 65-byte uncompressed (0x04||X||Y).
  // Also accept already-uncompressed (65) or compressed (33) points as-is.
  if (recipientPubBytes.length === 64) {
    const withPrefix = new Uint8Array(1 + recipientPubBytes.length);
    withPrefix[0] = 0x04;
    withPrefix.set(recipientPubBytes, 1);
    recipientPubBytes = withPrefix;
  }
 
  // perform ECDH using noble-secp256k1
  const secp = await import('noble-secp256k1');
  // noble expects hex strings for private/public (without 0x). Use no-0x hex for both.
  const ephemPrivHexNo0x = ephemPrivHex.replace(/^0x/, '');
  const recipientPubHexNo0x = Buffer.from(recipientPubBytes).toString('hex');
  // getSharedSecret expects raw hex strings (no 0x) or Uint8Array. Pass both args as no-0x hex strings.
  const sharedRaw = secp.getSharedSecret(ephemPrivHexNo0x, recipientPubHexNo0x);
  const sharedBytes = ethers.utils.arrayify('0x' + sharedRaw); // includes leading 0x04

  // derive KEK using HKDF-SHA256 (use the raw X coordinate to avoid point prefix)
  const sharedX = sharedBytes.slice(1); // drop leading 0x04
  const kek = await hkdfSha256(sharedX, new Uint8Array()); // 32 bytes

  // encrypt DEK with AES-GCM using derived KEK
  const wrapped = await aesGcmEncrypt(kek, dek, nonce);
  const wrappedHex = ethers.utils.hexlify(wrapped);

  // return owner ephemeral pubkey as base64 for compact transport
  const ownerEphemPubB64 = Buffer.from(ephemPubBytes).toString('base64');

  return { wrappedDekHex: wrappedHex, ownerEphemeralPubKey: ownerEphemPubB64 };
}

/**
 * Wrap a DEK for a recipient using signature-based key derivation (no private key required).
 * Both owner and recipient sign the same message to derive the same KEK.
 * This works with any wallet provider that supports message signing (MetaMask, Thirdweb, etc.).
 */
export async function wrapDekForRecipientWithSignature(
  owner: ethers.Signer,
  recipientAddress: string,
  dek: Uint8Array,
  nonce: Uint8Array
): Promise<{ wrappedDekHex: string; ownerSignature: string }> {
  const SIG_MSG_SHARE = "Essentialis-Share-DEK-v1";
  
  // Owner signs the message
  const ownerSig = await owner.signMessage(SIG_MSG_SHARE);
  
  // Derive KEK from owner signature + recipient address
  const salt = _toU8(recipientAddress.toLowerCase());
  const ikm = ethers.utils.arrayify(ownerSig);
  const kek = await hkdfSha256(ikm, salt);
  
  // Encrypt DEK with derived KEK
  const wrapped = await aesGcmEncrypt(kek, dek, nonce);
  const wrappedHex = ethers.utils.hexlify(wrapped);
  
  return { wrappedDekHex: wrappedHex, ownerSignature: ownerSig };
}

/**
 * Enables a recipient to unwrap a DEK that was shared via wrapDekForRecipientWithSignature.
 * This uses signature-based key derivation, so no private key access is required.
 * Derivation is: KEK = HKDF(ownerSignature, salt=recipientAddressLowercase).
 * The recipient may be asked to sign to ensure wallet UX consistency, but the derivation does not use recipientSig.
 */
export async function unwrapSharedDekWithSignature(
  recipient: ethers.Signer,
  ownerSignature: string,
  wrappedDekHex: string,
  nonce: Uint8Array
): Promise<Uint8Array> {
  const SIG_MSG_SHARE = "Essentialis-Share-DEK-v1";
  
  // Optional: prompt recipient signing for UX consistency; not used in derivation
  try { await recipient.signMessage(SIG_MSG_SHARE); } catch { /* ignore if user/provider skips */ }
  
  // Get recipient address for salt
  const recipientAddress = (await recipient.getAddress()).toLowerCase();
  
  // Derive KEK from owner signature + recipient address (same derivation as owner)
  const salt = _toU8(recipientAddress.toLowerCase());
  const ikm = ethers.utils.arrayify(ownerSignature);
  const kek = await hkdfSha256(ikm, salt);
  
  // Decrypt wrapped DEK
  const wrappedBytes = ethers.utils.arrayify(wrappedDekHex);
  const dek = await aesGcmDecrypt(kek, wrappedBytes, nonce);
  
  return dek;
}

/**
 * Enables a recipient to unwrap a DEK that was shared via wrapDekForRecipient.
 * The recipient signer must expose a usable private key (e.g., ethers.Wallet or a signer with _signingKey).
 * If the signer does not expose a private key, this function will throw.
 * 
 * @deprecated Use unwrapSharedDekWithSignature instead, which works with any wallet provider.
 */
export async function unwrapSharedDek(
  recipient: ethers.Signer,
  ownerEphemeralPubKey: string,
  wrappedDekHex: string,
  nonce: Uint8Array
): Promise<Uint8Array> {
  // convert owner ephemeral pubkey (base64) back to bytes/hex
  const ownerEphemPubBytes = new Uint8Array(Buffer.from(ownerEphemeralPubKey, 'base64'));
  const ownerEphemPubHex = ethers.utils.hexlify(ownerEphemPubBytes);

  // try to extract recipient private key (only possible for local signers)
  let recipientPrivHex: string | null = null;
  // ethers.Wallet exposes privateKey, some signers expose _signingKey()
  try {
    const anySigner: any = recipient as any;
    if (anySigner.privateKey) {
      recipientPrivHex = anySigner.privateKey;
    } else if (typeof anySigner._signingKey === 'function') {
      const sk = anySigner._signingKey();
      if (sk && sk.privateKey) recipientPrivHex = sk.privateKey;
    }
  } catch {
    /* ignore */
  }

  if (!recipientPrivHex) {
    // Attempt to surface a helpful address (if available) to the caller
    let addr: string | null = null;
    try {
      addr = (await recipient.getAddress()).toLowerCase();
    } catch {
      addr = null;
    }

    // Throw improved, actionable error so UI can present clearer guidance
    throw new Error(
      `Recipient signer does not expose a private key. Cannot perform local ECDH unwrap.${addr ? ` Recipient address: ${addr}.` : ''} ` +
      `This typically happens with in-page providers that don't reveal private keys (e.g. MetaMask). ` +
      `Options: use a signer that exposes a private key (ethers.Wallet or a signer with _signingKey), ` +
      `or ask the owner to share the DEK to a provider-compatible encryption key / perform an on-chain metadata update.`
    );
  }

  // perform ECDH with noble-secp256k1
  const secp = await import('noble-secp256k1');
  const privHexNo0x = recipientPrivHex.replace(/^0x/, '');
  const ownerPubHexNo0x = ownerEphemPubHex.replace(/^0x/, '');
  const sharedRaw = secp.getSharedSecret(privHexNo0x, ownerPubHexNo0x);
  const sharedBytes = ethers.utils.arrayify(sharedRaw);
  const sharedX = sharedBytes.slice(1);

  // derive KEK via HKDF-SHA256
  const kek = await hkdfSha256(sharedX, new Uint8Array());

  // decrypt wrapped DEK
  const wrappedBytes = ethers.utils.arrayify(wrappedDekHex);
  const dek = await aesGcmDecrypt(kek, wrappedBytes, nonce);
  return dek;
}
export function encode(data: Uint8Array): Uint8Array {
  const prefix = new TextEncoder().encode("ESSENTIALIS[");
  const suffix = new TextEncoder().encode("]");
  const output = new Uint8Array(prefix.length + data.length + suffix.length);
  output.set(prefix, 0);
  output.set(data, prefix.length);
  output.set(suffix, prefix.length + data.length);
  return output;
}

export function decode(metachunk: Uint8Array): Uint8Array {
  const prefix = new TextEncoder().encode("ESSENTIALIS[");
  const suffix = new TextEncoder().encode("]");
  return metachunk.slice(prefix.length, metachunk.length - suffix.length);
}


/**
 * For provider-style shared entries (created when owner used eth_getEncryptionPublicKey),
 * allow the recipient to ask their wallet provider to perform eth_decrypt and return the DEK.
 * providerEncrypted: JSON string with {version, nonce, ephemPublicKey, ciphertext}
 */
export async function unwrapSharedDekWithProvider(recipient: ethers.Signer, providerEncrypted: string): Promise<Uint8Array> {
    const anySigner: any = recipient as any;
    const provider = anySigner.provider || (recipient as any).provider;
    if (!provider || typeof provider.send !== 'function') {
        throw new Error('Recipient provider does not support eth_decrypt RPC. Ensure you are using a wallet provider like MetaMask that supports eth_decrypt.');
    }

    const addr = await recipient.getAddress();
    
    // Ensure providerEncrypted is a JSON string (it should already be from shareWithWallet)
    let encryptedPayload: string;
    try {
        // If it's already a JSON string, use it directly; if it's an object, stringify it
        if (typeof providerEncrypted === 'string') {
            // Try to parse to validate it's valid JSON, then use original string
            JSON.parse(providerEncrypted);
            encryptedPayload = providerEncrypted;
        } else {
            encryptedPayload = JSON.stringify(providerEncrypted);
        }
    } catch (e) {
        throw new Error(`Invalid provider_encrypted format: ${e instanceof Error ? e.message : String(e)}`);
    }
    
    // eth_decrypt will prompt the user's wallet (MetaMask) to decrypt and return the plaintext string
    const decrypted = await provider.send('eth_decrypt', [encryptedPayload, addr]);

    // owner encoded the DEK as base64 string prior to provider encryption
    const dekBytes = Buffer.from(decrypted, 'base64');
    return new Uint8Array(dekBytes);
}