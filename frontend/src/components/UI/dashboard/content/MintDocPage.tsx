// MintDocPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { defineChain } from 'thirdweb/chains';
import { getContract } from 'thirdweb';
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { EIP1193 } from "thirdweb/wallets";

import { client } from '../../../../lib/thirdweb';
import NFTDocABI from '../../../../abi/NFTDoc.json';

// Import our new, production-ready crypto functions
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
import { Button, Input, Card, CardHeader, CardContent, Heading, Text, LoadingSpinner } from '../../index';
import { useDashboardContext } from '../../../../pages/DashboardPage';

window.Buffer = window.Buffer || Buffer;

const polygonAmoy = defineChain(2442);
const CONTRACT_ADDRESS = '0x595A79e5Fe30E14B5383ECef79d72F6B355b71bc';

const MintDocPage: React.FC = () => {
    const navigate = useNavigate();
    const account = useActiveAccount();
    const activeWallet = useActiveWallet();
    const { profile } = useDashboardContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ownerName: profile?.name || 'Unknown',
        tokenizationDate: new Date().toISOString().split('T')[0]
    });
    const [sourceFile, setSourceFile] = useState<File | null>(null);

    useEffect(() => {
        if (profile?.name) {
            setFormData(prev => ({ ...prev, ownerName: profile.name ?? 'Unknown' }));
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSourceFile(file);
            setFormData(prev => ({ ...prev, name: file.name.split('.')[0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account || !activeWallet || !sourceFile) return setStatusMessage('Please connect wallet and select a file.');

        setIsSubmitting(true);
        setStatusMessage(null);
        try {
            setStatusMessage('Step 1/6: Generating encryption keys...');
            const eip = EIP1193.toProvider({ wallet: activeWallet, client, chain: polygonAmoy });
            const signer = new ethers.providers.Web3Provider(eip).getSigner();
            const owner = account.address;
            const timestamp = formData.tokenizationDate;
            const counter = Date.now();

            setStatusMessage('Step 2/6: Encrypting file data...');
            const dek = generateDEK();
            const nonce = await generateNonce(owner, timestamp, counter);
            const fileDataU8 = new Uint8Array(await sourceFile.arrayBuffer());
            const encryptedData = await aesGcmEncrypt(dek, fileDataU8, nonce);

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

            setStatusMessage('Step 6/6: Building transaction...');
            const metadata = {
                name: formData.name,
                description: formData.description,
                image: "https://via.placeholder.com/400x400/1f2937/ffffff?text=Document",
                attributes: [
                    { "trait_type": "Owner", "value": formData.ownerName },
                    { "trait_type": "Tokenization Date", "value": formData.tokenizationDate },
                    { "trait_type": "File Size", "value": `${(sourceFile.size / 1024).toFixed(2)} KB` },
                    { "trait_type": "File Type", "value": sourceFile.type || 'N/A' },
                    { "trait_type": "File Extension", "value": sourceFile.name.split('.').pop() || 'N/A' },
                    { "trait_type": "Counter", "value": counter.toString() }
                ],
                encrypted_file_cid: metachunkCid,
                nonce: ethers.utils.hexlify(nonce),
                wrapped_deks: { [owner.toLowerCase()]: await wrapDek(signer, dek, nonce) }
            };

            // Optionally, test with minimal metadata
            // const minimalMetadata = { name: 'Test', description: 'Minimal' };
            // const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(minimalMetadata)).toString('base64')}`;

            const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;
            // Debug: log tokenURI length
            console.log('tokenURI length:', tokenURI.length);

            setStatusMessage('Please confirm the transaction in your wallet...');
            const contract = getContract({ address: CONTRACT_ADDRESS, abi: NFTDocABI as any, client, chain: polygonAmoy });
            const tx = prepareContractCall({ contract, method: 'function mintNFT(string)', params: [tokenURI] });
            const sent = await sendTransaction({ transaction: tx, account });
            await waitForReceipt({ client, chain: polygonAmoy, transactionHash: sent.transactionHash });

            setStatusMessage('Document minted successfully!');
            setTimeout(() => {
                navigate('/dashboard/my-docs');
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setStatusMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card variant="premium">
                <CardHeader className="text-center">
                    <Heading level={2} className="gradient-gold-text">
                        Mint New Document
                    </Heading>
                    <Text color="muted" className="mt-2">
                        Create a new encrypted document NFT
                    </Text>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                Document File *
                            </label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all-smooth">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    disabled={isSubmitting}
                                    className="hidden"
                                    id="file-upload"
                                    required
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

                        {/* Document Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-700/50 p-3 rounded-md">
                            <div>
                                <Text variant="small" color="muted">Owner</Text>
                                <Text weight="semibold">{formData.ownerName}</Text>
                            </div>
                            <div>
                                <Text variant="small" color="muted">Date</Text>
                                <Text weight="semibold">{formData.tokenizationDate}</Text>
                            </div>
                            <div>
                                <Text variant="small" color="muted">File Size</Text>
                                <Text weight="semibold">
                                    {sourceFile ? `${(sourceFile.size / 1024).toFixed(2)} KB` : 'N/A'}
                                </Text>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Document Name *
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Q4 Financial Report"
                                variant="professional"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                required
                                placeholder="A brief description of the document."
                                className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg text-white placeholder-gray-400 transition-all-smooth focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 disabled:opacity-50 resize-none"
                            />
                        </div>

                        {/* Owner Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-300">
                                Owner Name
                            </label>
                            <Input
                                id="ownerName"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                readOnly
                                variant="professional"
                                className="bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* Tokenization Date Input */}
                        <div className="space-y-2">
                            <label htmlFor="tokenizationDate" className="block text-sm font-medium text-gray-300">
                                Tokenization Date
                            </label>
                            <Input
                                id="tokenizationDate"
                                name="tokenizationDate"
                                type="date"
                                value={formData.tokenizationDate}
                                onChange={handleChange}
                                readOnly
                                variant="professional"
                                className="bg-gray-700 cursor-not-allowed"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || !sourceFile}
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'Minting Document...' : 'Mint Document'}
                        </Button>

                        {/* Status Message */}
                        {statusMessage && (
                            <div className={`text-center p-3 rounded-md ${
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

export default MintDocPage;