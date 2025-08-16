// DocView.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from 'thirdweb/wallets';

import {
    unwrapDek,
    aesGcmDecrypt,
    decode,
    split,
    divide,
    sha256,
    hmacSha256
} from '../../../../lib/crypto';
import { client } from '../../../../lib/thirdweb';
import LoadingSpinner from '../../LoadingSpinner';

window.Buffer = window.Buffer || Buffer;

interface NftAttribute {
    trait_type: string;
    value: string;
}

interface NftMetadata {
    name: string;
    description: string;
    attributes: NftAttribute[];
    encrypted_file_cid: string;
    nonce: string;
    wrapped_deks: { [address: string]: string };
    backup_metakey: string;
}

const DocView: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const account = useActiveAccount();
    const activeWallet = useActiveWallet();

    const [metadata, setMetadata] = useState<NftMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    useEffect(() => {
        const fetchDocDetails = async () => {
            if (!tokenId) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/doc/${tokenId}`);
                if (!res.ok) throw new Error('Failed to fetch document details');
                const data = await res.json();
                const tokenURI = data.token_uri;
                if (!tokenURI.startsWith('data:application/json;base64,')) {
                    throw new Error('Invalid or missing on-chain metadata URI');
                }
                const meta = JSON.parse(Buffer.from(tokenURI.split(',')[1], 'base64').toString('utf-8')) as NftMetadata;
                setMetadata(meta);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDocDetails();
    }, [tokenId]);

    const handleDecryptAndShow = async () => {
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

    if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    if (!metadata) return <div className="text-center p-8">No metadata found for this document.</div>;

    const userHasAccess = account && metadata.wrapped_deks && metadata.wrapped_deks[account.address.toLowerCase()];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">{metadata.name}</h1>
            <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">{metadata.description}</p>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Document Viewer</h2>
                {decryptedFileUrl ? (
                    <iframe src={decryptedFileUrl} className="w-full h-96 border border-gray-700 rounded" title="Document Preview" />
                ) : (
                    <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
                        <h3 className="text-lg font-semibold">This document is encrypted.</h3>
                        <p className="mb-4 text-gray-400">Your private key is required to view the contents.</p>
                        {!account && <p className="text-yellow-400">Please connect your wallet to see if you have access.</p>}
                        {account && userHasAccess && (
                            <button
                                onClick={handleDecryptAndShow}
                                disabled={isDecrypting}
                                className="py-3 px-6 bg-green-600 rounded-md font-semibold hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-wait"
                            >
                                {isDecrypting ? <LoadingSpinner /> : 'Decrypt & View Document'}
                            </button>
                        )}
                        {account && !userHasAccess && (
                            <p className="text-yellow-400 font-semibold">Your connected wallet ({account.address.slice(0, 6)}...{account.address.slice(-4)}) does not have access to this file.</p>
                        )}
                        {statusMessage && <p className="mt-4 text-sm text-gray-300">{statusMessage}</p>}
                        {error && <p className="mt-4 text-sm text-red-400">Error: {error}</p>}
                    </div>
                )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Details</h3>
                {metadata.attributes.map(attr => (
                    <div key={attr.trait_type} className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-400">{attr.trait_type}:</span>
                        <span className="text-right">{attr.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocView;