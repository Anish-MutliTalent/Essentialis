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

async function _kdfStream(seed: Uint8Array, n: number): Promise<Uint8Array> {
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

export async function multiply(x: string, y: string): Promise<string> {
    const bx = _toU8(x);
    const by = _toU8(y);
    const X = _lenPrefix(bx);
    const Y = _lenPrefix(by);

    const hx8 = await _hash8(X);
    const hy8 = await _hash8(Y);

    const c1_payload = _xor(X, await _kdfStream(hy8, X.length));
    const c2_payload = _xor(Y, await _kdfStream(hx8, Y.length));

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
        const { payload: pay, remainder: rem1 } = _lenUnprefix(buf.slice(8));
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
    const tryDecryptWithSeed = async (seed: Uint8Array, cap: Uint8Array): Promise<string> => {
        // extract encrypted payload (the capsule layout is: 8-tag || 4-len || payload)
        const encPayload = _lenUnprefix(cap.slice(8)).payload;
        // XOR with KDF(seed)
        const pad = await _kdfStream(seed, encPayload.length);
        const decryptedWithPrefix = _xor(encPayload, pad);

        // sanity-check length prefix before calling _lenUnprefix (gives clearer error)
        if (decryptedWithPrefix.length < 4) throw new Error("Decryption produced too-short result (no length prefix)");
        const dv = new DataView(decryptedWithPrefix.buffer, decryptedWithPrefix.byteOffset, 4);
        const L = dv.getUint32(0, false);
        if (decryptedWithPrefix.length !== 4 + L) {
            throw new Error(`Decryption length mismatch: prefix=${L} bytes but decrypted buffer contains ${decryptedWithPrefix.length - 4} bytes`);
        }

        const { payload: other_final } = _lenUnprefix(decryptedWithPrefix);
        return _toStr(other_final);
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


// --- Other functions remain unchanged ---
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
export async function encode(data: string): Promise<{ metachunk: string }> {
    const metachunk = btoa(`ESSENTIALIS[${data}]`);
    return { metachunk };
}
export async function decode(metachunk: string): Promise<string> {
    const data = atob(metachunk);
    return data.substring(data.indexOf('[') + 1, data.indexOf(']'));
}
