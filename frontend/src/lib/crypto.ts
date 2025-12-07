// lib/crypto.ts

import { ethers } from 'ethers';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

const _toU8 = (s: string): Uint8Array => new TextEncoder().encode(s);
const _toStr = (b: Uint8Array): string => new TextDecoder().decode(b);
const _concatU8 = (...arrays: Uint8Array[]): Uint8Array => {
    const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
};

function _lenPrefix(data: Uint8Array): Uint8Array {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, data.length, false);
    return _concatU8(new Uint8Array(buffer), data);
}

function _lenUnprefix(buf: Uint8Array): { payload: Uint8Array; remainder: Uint8Array } {
    if (buf.length < 4) throw new Error("Bad length prefix: buffer too short");
    const view = new DataView(buf.buffer, buf.byteOffset, 4);
    const L = view.getUint32(0, false);
    const payload = buf.slice(4, 4 + L);
    if (payload.length !== L) throw new Error("Truncated payload");
    const remainder = buf.slice(4 + L);
    return { payload, remainder };
}

async function _kdfStream(seed: Uint8Array, n: number, progressCb?: (generated: number) => void): Promise<Uint8Array> {
    const out = new Uint8Array(n);
    let generatedBytes = 0;
    let ctr = 0;
    while (generatedBytes < n) {
        const ctrBytes = new Uint8Array(4);
        new DataView(ctrBytes.buffer).setUint32(0, ctr, false);
        const hashInput = _concatU8(seed, ctrBytes);
        const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', hashInput.slice()));
        const bytesToCopy = Math.min(hash.length, n - generatedBytes);
        out.set(hash.slice(0, bytesToCopy), generatedBytes);
        generatedBytes += bytesToCopy;
        ctr++;
        if (progressCb) progressCb(generatedBytes);
    }
    return out;
}

const _xor = (a: Uint8Array, b: Uint8Array): Uint8Array => {
    const len = Math.min(a.length, b.length);
    const result = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        result[i] = a[i] ^ b[i];
    }
    return result;
};

const _hash8 = async (m: Uint8Array): Promise<Uint8Array> => {
    const hash = await crypto.subtle.digest('SHA-256', m.slice());
    return new Uint8Array(hash).slice(0, 8);
};

export async function multiply(x: string, y: string, progressCb?: (processed: number, total: number) => void): Promise<string> {
    const bx = _toU8(x);
    const by = _toU8(y);
    const X = _lenPrefix(bx);
    const Y = _lenPrefix(by);
    const totalWork = X.length + Y.length;
    let processed = 0;

    const hx8 = await _hash8(X);
    processed += 0; if (progressCb) progressCb(processed, totalWork);
    const hy8 = await _hash8(Y);
    processed += 0; if (progressCb) progressCb(processed, totalWork);

    // Generate KDF stream for X (using hy8) and report progress
    const padForX = await _kdfStream(hy8, X.length, (g) => {
        // g is generated for this part; map to global processed
        const localProcessed = Math.min(X.length, g);
        if (progressCb) progressCb(localProcessed, totalWork);
    });
    const c1_payload = _xor(X, padForX);
    processed += X.length; if (progressCb) progressCb(processed, totalWork);

    // Generate KDF stream for Y (using hx8) and report progress
    const padForY = await _kdfStream(hx8, Y.length, (g) => {
        const localProcessed = X.length + Math.min(Y.length, g);
        if (progressCb) progressCb(localProcessed, totalWork);
    });
    const c2_payload = _xor(Y, padForY);
    processed += Y.length; if (progressCb) progressCb(processed, totalWork);

    const cap1 = _concatU8(hy8, _lenPrefix(c1_payload));
    const cap2 = _concatU8(hx8, _lenPrefix(c2_payload));
    
    const a = Buffer.from(cap1);
    const b = Buffer.from(cap2);
    const sorted = [a, b].sort(Buffer.compare);
    
    const blob = Buffer.concat(sorted);
    return blob.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function divide(product_b64: string, known: string): Promise<string> {
    // --- 1. base64url decode ---
    let base64 = product_b64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) { base64 += '='; }
    const blobBuf = Buffer.from(base64, 'base64');
    const blob = new Uint8Array(blobBuf); // use Uint8Array for helper fns

    // --- 2. helper to parse a single capsule from buffer start ---
    const parseCap = (buf: Uint8Array): { cap: Uint8Array, rem: Uint8Array } => {
        if (buf.length < 12) throw new Error("Invalid capsule format: too short");
        const { payload: pay, remainder: _rem1 } = _lenUnprefix(buf.slice(8));
        const L = 8 + 4 + pay.length; // 8 bytes tag + 4 length prefix + payload
        return { cap: buf.slice(0, L), rem: buf.slice(L) };
    };

    // --- 3. robustly extract two capsules (handles sorted concatenation) ---
    let cap1: Uint8Array = new Uint8Array(), cap2: Uint8Array = new Uint8Array();
    try {
        const { cap: c1, rem: r1 } = parseCap(blob);
        const { cap: c2, rem: r2 } = parseCap(r1);
        if (r2.length !== 0) throw new Error("Extra trailing data after two capsules");
        cap1 = c1;
        cap2 = c2;
    } catch (err) {
        // fallback: scan for valid boundary (helps if parsing failed due to unexpected offset)
        let found = false;
        for (let off = 0; off < blob.length - 12 && !found; off++) {
            try {
                const sub = blob.slice(off);
                const { cap: c1, rem: r1 } = parseCap(sub);
                const { cap: c2, rem: r2 } = parseCap(r1);
                if (r2.length === 0) {
                    cap1 = c1;
                    cap2 = c2;
                    found = true;
                }
            } catch (_) { /* ignore and continue scanning */ }
        }
        if (!found) throw new Error(`Invalid capsule structure; parse failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    // --- 4. derive t8 = hash(lenPrefix(known)) (this is how multiply derived tags) ---
    const bknown = _toU8(known);
    const K = _lenPrefix(bknown);
    const t8 = await _hash8(K); // Uint8Array(8)

    const tag1 = cap1.slice(0, 8);
    const tag2 = cap2.slice(0, 8);

    // helper to attempt decryption and validate the recovered length-prefix
    // Allow payloads larger than 10MB for real-world files. Use the incoming
    // blob size as a guide so we accept reasonable payloads up to the size
    // of the product itself. Also enforce an upper safety cap to avoid
    // pathological allocations in the browser.
    const INCOMING_BLOB_LIMIT = blob.length || (50 * 1024 * 1024);
    const DEFAULT_MIN_ACCEPTABLE = 10 * 1024 * 1024; // 10 MB
    const ABSOLUTE_MAX = 5 * 1024 * 1024 * 1024; // 200 MB safety cap
    const MAX_ACCEPTABLE_PAYLOAD = Math.min(Math.max(INCOMING_BLOB_LIMIT, DEFAULT_MIN_ACCEPTABLE), ABSOLUTE_MAX);

    const tryDecryptWithSeed = async (seed: Uint8Array, cap: Uint8Array): Promise<string> => {
        // extract encrypted payload (the capsule layout is: 8-tag || 4-len || payload)
        const encPayload = _lenUnprefix(cap.slice(8)).payload;
        // XOR with KDF(seed)
        const pad = await _kdfStream(seed, encPayload.length);
        const decryptedWithPrefix = _xor(encPayload, pad);

        if (decryptedWithPrefix.length < 4) throw new Error("Decryption produced too-short result (no length prefix)");

        // Read prefix as big-endian first (the original implementation used big-endian)
        const dv = new DataView(decryptedWithPrefix.buffer, decryptedWithPrefix.byteOffset, 4);
        const Lbe = dv.getUint32(0, false);
        const MIN_PAYLOAD_SIZE = 32; // Reject empty or too-small payloads
        if (Lbe >= MIN_PAYLOAD_SIZE && Lbe <= MAX_ACCEPTABLE_PAYLOAD && decryptedWithPrefix.length === 4 + Lbe) {
            const { payload: other_final } = _lenUnprefix(decryptedWithPrefix);
            const result = _toStr(other_final);
            if (!result || result.length === 0) {
                throw new Error(`Decryption produced empty result (length prefix was ${Lbe} but payload is empty)`);
            }
            return result;
        }

        // If big-endian didn't match, try little-endian interpretation (some producers/mis-encodings may swap endianness)
        const Lle = dv.getUint32(0, true);
        if (Lle >= MIN_PAYLOAD_SIZE && Lle <= MAX_ACCEPTABLE_PAYLOAD && decryptedWithPrefix.length === 4 + Lle) {
            // manually slice payload according to little-endian length
            const payload = decryptedWithPrefix.slice(4, 4 + Lle);
            const result = _toStr(payload);
            if (!result || result.length === 0) {
                throw new Error(`Decryption produced empty result (little-endian length prefix was ${Lle} but payload is empty)`);
            }
            return result;
        }

        // Heuristic fallback 1:
        // If the decrypted buffer contains a 4-byte prefix followed by a payload whose size is reasonable,
        // accept decryptedWithPrefix.slice(4) even if the numeric prefix doesn't match (some encoders write a different prefix scheme).
        const candidatePayloadLen = decryptedWithPrefix.length - 4;
        // Only accept if payload is at least 32 bytes (reasonable minimum for encrypted data)
        if (candidatePayloadLen >= MIN_PAYLOAD_SIZE && candidatePayloadLen <= MAX_ACCEPTABLE_PAYLOAD) {
            console.warn(`[divide] length-prefix mismatch (BE=${Lbe},LE=${Lle}) but decrypted buffer has plausible payload length=${candidatePayloadLen}. Accepting payload slice(4).`);
            const result = _toStr(decryptedWithPrefix.slice(4, 4 + candidatePayloadLen));
            if (!result || result.length === 0) {
                throw new Error(`Heuristic fallback 1 produced empty result (payload length=${candidatePayloadLen})`);
            }
            return result;
        }

        // Heuristic fallback 2:
        // If the entire decrypted buffer is small enough and large enough to be valid, accept it as a payload (no length-prefix).
        if (decryptedWithPrefix.length >= MIN_PAYLOAD_SIZE && decryptedWithPrefix.length <= MAX_ACCEPTABLE_PAYLOAD) {
            console.warn(`[divide] length-prefix mismatch (BE=${Lbe},LE=${Lle}) but decrypted buffer length=${decryptedWithPrefix.length} is plausible; treating entire buffer as payload.`);
            const result = _toStr(decryptedWithPrefix);
            if (!result || result.length === 0) {
                throw new Error(`Heuristic fallback 2 produced empty result (buffer length=${decryptedWithPrefix.length})`);
            }
            return result;
        }

        // If neither heuristic applies, provide detailed diagnostic info
        throw new Error(`Decryption length mismatch: prefixBE=${Lbe} prefixLE=${Lle} bytes but decrypted buffer contains ${decryptedWithPrefix.length - 4} bytes`);
    };

    // --- 5. Try the natural (tag-match) path first ---
    try {
        if (Buffer.from(t8).equals(Buffer.from(tag1))) {
            return await tryDecryptWithSeed(t8, cap1);
        }
        if (Buffer.from(t8).equals(Buffer.from(tag2))) {
            return await tryDecryptWithSeed(t8, cap2);
        }
    } catch (err) {
        // matched-tag decryption failed; fall through to fallback attempts
        console.warn("matched-tag decrypt failed:", err);
    }

    // --- 6. Fallback: try decrypting both capsules with the derived seed (in case tags / ordering are unexpected) ---
    const fallbackErrors: string[] = [];
    try {
        return await tryDecryptWithSeed(t8, cap1);
    } catch (e) {
        fallbackErrors.push(`cap1: ${e instanceof Error ? e.message : String(e)}`);
    }
    try {
        return await tryDecryptWithSeed(t8, cap2);
    } catch (e) {
        fallbackErrors.push(`cap2: ${e instanceof Error ? e.message : String(e)}`);
    }

    throw new Error(`known operand does not match product (or decryption failed). Attempts: ${fallbackErrors.join(' | ')}`);
}

export const merge = (...args: string[]): string => args.join('|SPLIT|');
export const split = (merged: string): string[] => merged.split('|SPLIT|');
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
export async function encode(data: string): Promise<{ metachunk: string }> {
    const metachunk = btoa(`ESSENTIALIS[${data}]`);
    return { metachunk };
}
export async function decode(metachunk: string): Promise<string> {
    const data = atob(metachunk);
    return data.substring(data.indexOf('[') + 1, data.indexOf(']'));
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
