// EditDocPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { client } from '../../../../lib/thirdweb';
import DocLandABI from '../../../../abi/DocLand.json';
import { defineChain } from 'thirdweb/chains';
import { getContract } from 'thirdweb';
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from 'thirdweb/wallets';

import LoadingSpinner from '../../LoadingSpinner';
import { useDashboardContext } from '../../../../pages/DashboardPage';

import {
    generateDEK,
    generateNonce,
    aesGcmEncrypt,
    wrapDek,
    multiply,
    merge,
    sha256,
    hmacSha256,
    encode,
    hkdfSha256
} from '../../../../lib/crypto';

window.Buffer = window.Buffer || Buffer;

const polygonAmoy = defineChain(80002);
const CONTRACT_ADDRESS = '0xB0097c317C29143A0BdF576DF352829FbBa56ecb';

const EditDocPage: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const navigate = useNavigate();
    const account = useActiveAccount();
    const activeWallet = useActiveWallet();
    const { refreshProfile } = useDashboardContext();

    const [initialLoading, setInitialLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const [originalMetadata, setOriginalMetadata] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [sourceFile, setSourceFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchDocData = async () => {
            try {
                const res = await fetch(`/api/doc/${tokenId}`);
                if (!res.ok) throw new Error('Failed to fetch Doc details');
                const { token_uri } = await res.json();
                const metadata = JSON.parse(atob(token_uri.split(',')[1]));

                setOriginalMetadata(metadata);
                setFormData({ name: metadata.name || '', description: metadata.description || '' });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchDocData();
    }, [tokenId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSourceFile(e.target.files?.[0] ?? null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account || !activeWallet || !originalMetadata) return setStatusMessage('Connect wallet and wait for data to load.');

        setIsSubmitting(true);
        setStatusMessage(null);
        try {
            let finalMetadata: any;

            if (sourceFile) {
                setStatusMessage('New file detected. Starting full re-encryption process...');
                const eip = EIP1193.toProvider({ wallet: activeWallet, client, chain: polygonAmoy });
                const signer = new ethers.providers.Web3Provider(eip).getSigner();
                const owner = account.address;
                const timestamp = originalMetadata.attributes.find((a: any) => a.trait_type === 'Tokenization Date')?.value || new Date().toISOString();
                const counter = Date.now(); // New counter for new encryption

                setStatusMessage('Step 1/6: Generating new keys...');
                const dek = generateDEK();
                const nonce = await generateNonce(owner, timestamp, counter);
                const fileDataU8 = new Uint8Array(await sourceFile.arrayBuffer());
                const encryptedData = await aesGcmEncrypt(dek, fileDataU8, nonce);

                setStatusMessage('Step 2/6: Wrapping new key... Please sign.');
                const wrappedDekHex = await wrapDek(signer, dek, nonce);

                setStatusMessage('Step 3/6: Creating verifiable chunks...');
                const encryptedDataB64 = Buffer.from(encryptedData).toString('base64');
                const p1 = await multiply(owner, encryptedDataB64);
                const p2 = await multiply(p1, timestamp);
                const chunk_a = await multiply(p2, counter.toString());

                const dataHashB64 = Buffer.from(await sha256(fileDataU8)).toString('base64');
                const hmacKey = new TextEncoder().encode(owner + timestamp);
                const hmacHash = await hmacSha256(hmacKey, encryptedData);
                const hmacHashB64 = Buffer.from(hmacHash).toString('base64');
                const chunk_b = await multiply(dataHashB64, hmacHashB64);
                const chunk = merge(chunk_a, chunk_b);

                setStatusMessage('Step 4/6: Securing metadata...');
                const { metachunk } = await encode(chunk);
                
                setStatusMessage('Step 5/6: Uploading to IPFS...');
                const metaChunkFile = new File([metachunk], "metachunk.txt", { type: 'text/plain' });
                const ipfsForm = new FormData();
                ipfsForm.append('file', metaChunkFile);
                const ipfsRes = await fetch('/api/ipfs/file', { method: 'POST', body: ipfsForm });
                const metachunkCid = (await ipfsRes.json()).replace(/"/g, '');

                finalMetadata = {
                    ...originalMetadata,
                    name: formData.name,
                    description: formData.description,
                    attributes: [
                        ...originalMetadata.attributes.filter((a: any) => !['File Size', 'File Type', 'File Extension', 'Counter'].includes(a.trait_type)),
                        { "trait_type": "File Size", "value": `${(sourceFile.size / 1024).toFixed(2)} KB` },
                        { "trait_type": "File Type", "value": sourceFile.type || 'N/A' },
                        { "trait_type": "File Extension", "value": sourceFile.name.split('.').pop() || 'N/A' },
                        { "trait_type": "Counter", "value": counter.toString() }
                    ],
                    encrypted_file_cid: metachunkCid,
                    nonce: ethers.utils.hexlify(nonce),
                    wrapped_deks: { [owner.toLowerCase()]: wrappedDekHex } // Note: This replaces old wrapped DEKs
                };
            } else {
                setStatusMessage('Updating document name and description...');
                finalMetadata = {
                    ...originalMetadata,
                    name: formData.name,
                    description: formData.description,
                };
            }

            setStatusMessage('Building transaction...');
            const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(finalMetadata)).toString('base64')}`;

            setStatusMessage('Please confirm the transaction in your wallet...');
            const contract = getContract({ address: CONTRACT_ADDRESS, abi: DocLandABI as any, client, chain: polygonAmoy });
            const tx = prepareContractCall({ contract, method: 'function updateNFT(uint256,string)', params: [BigInt(tokenId!), tokenURI] });
            const sent = await sendTransaction({ transaction: tx, account });
            await waitForReceipt({ client, chain: polygonAmoy, transactionHash: sent.transactionHash });

            setStatusMessage('Document updated successfully!');
            refreshProfile();
            navigate(`/dashboard/my-docs/${tokenId}/view`);
        } catch (err: any) {
            console.error(err);
            setStatusMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (initialLoading) return <div className="flex justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-gray-800 text-white rounded">
            <h2 className="text-2xl mb-4 text-center">Edit Document #{tokenId}</h2>

            <div className="mb-4">
                <label className="block mb-1">Replace File (optional)</label>
                <input type="file" onChange={handleFileChange} disabled={isSubmitting} />
            </div>

            <div className="mb-4">
                <label className="block text-sm">Name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="input-field w-full"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                    disabled={isSubmitting}
                    className="input-field w-full"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:bg-gray-500"
            >
                {isSubmitting ? <LoadingSpinner /> : 'Update Document'}
            </button>

            {statusMessage && <p className="mt-2 text-center text-gray-200">{statusMessage}</p>}
        </form>
    );
};

export default EditDocPage;