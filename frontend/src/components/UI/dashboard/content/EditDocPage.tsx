// EditDocPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { client } from '../../../../lib/thirdweb';
import NFTDocABI from '../../../../abi/NFTDoc.json';
import { defineChain } from 'thirdweb/chains';
import { getContract } from 'thirdweb';
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from 'thirdweb/wallets';

import { LoadingSpinner, Button, Input, Card, CardHeader, CardContent, Heading, Text } from '../../index';
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

const polygonAmoy = defineChain(2442);
const CONTRACT_ADDRESS = '0x595A79e5Fe30E14B5383ECef79d72F6B355b71bc';

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
                const counter = Date.now();

                setStatusMessage('Step 1/6: Generating new keys...');
                const dek = generateDEK();
                const nonce = await generateNonce(owner, timestamp, counter);
                const fileDataU8 = new Uint8Array(await sourceFile.arrayBuffer());
                const encryptedData = await aesGcmEncrypt(dek, fileDataU8, nonce);

                setStatusMessage('Step 2/6: Wrapping keys...');
                const wrappedDek = await wrapDek(signer, dek, nonce);
                const wrappedDekHex = wrappedDek;

                setStatusMessage('Step 3/6: Creating metadata chunk...');
                const metaChunk = {
                    encrypted_data: ethers.utils.hexlify(encryptedData),
                    wrapped_deks: { [owner.toLowerCase()]: wrappedDekHex }
                };
                const metaChunkFile = new Blob([JSON.stringify(metaChunk)], { type: 'application/json' });

                setStatusMessage('Step 4/6: Uploading to IPFS...');
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
                    wrapped_deks: { [owner.toLowerCase()]: wrappedDekHex }
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
            const contract = getContract({ address: CONTRACT_ADDRESS, abi: NFTDocABI as any, client, chain: polygonAmoy });
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

    if (initialLoading) return (
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

    return (
        <div className="max-w-2xl mx-auto">
            <Card variant="premium">
                <CardHeader className="text-center">
                    <Heading level={2} className="gradient-gold-text">
                        Edit Document #{tokenId}
                    </Heading>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                Replace File (optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all-smooth">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    disabled={isSubmitting}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="space-y-2">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="text-sm text-gray-400">
                                            <span className="font-medium text-yellow-400 hover:text-yellow-300">
                                                Click to upload
                                            </span> or drag and drop
                                        </div>
                                        <Text variant="small" color="muted">
                                            {sourceFile ? `Selected: ${sourceFile.name}` : 'No file selected'}
                                        </Text>
                                    </div>
                                </label>
                            </div>
            </div>

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Document Name
                            </label>
                            <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                                variant="professional"
                                placeholder="Enter document name"
                />
            </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Description
                            </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                    disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg text-white placeholder-gray-400 transition-all-smooth focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 disabled:opacity-50 resize-none"
                                placeholder="Enter document description"
                />
            </div>

                        {/* Submit Button */}
                        <Button
                type="submit"
                disabled={isSubmitting}
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'Updating Document...' : 'Update Document'}
                        </Button>

                        {/* Status Message */}
                        {statusMessage && (
                            <div className={`text-center p-4 rounded-lg ${
                                statusMessage.startsWith('Error') 
                                    ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                                    : statusMessage.includes('successfully') 
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                        : 'bg-yellow-400/20 border border-yellow-400/30 text-yellow-400'
                            }`}>
                                <Text variant="small">{statusMessage}</Text>
                            </div>
                        )}
        </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditDocPage;