// MintDocPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { defineChain } from 'thirdweb/chains';
// import { getContract } from 'thirdweb';
// import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
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
} from '../../../../lib/crypto';
import { Button, Input, Card, CardHeader, CardContent, Heading, Text } from '../../index';
import { getFileSize } from '../../../../lib/docs';
import { useDashboardContext } from '../../../../pages/DashboardPage';
import { useDocs } from '../../../contexts/DocsContext';

window.Buffer = window.Buffer || Buffer;

const chain = defineChain(84532);
const CONTRACT_ADDRESS = '0x42F1a118C13083b64b2b775e5Ac01EF1429c51cd';

const MintDocPage: React.FC = () => {
    const navigate = useNavigate();
    const account = useActiveAccount();
    const activeWallet = useActiveWallet();
    const { profile } = useDashboardContext();
    const { refreshDocs } = useDocs();
    const location = useLocation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    // overall progress percentage (0-100). null = indeterminate / idle
    const [progress, setProgress] = useState<number | null>(null);
    // internal trackers for fine-grained progress
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ownerName: profile?.name || 'Unknown',
        tokenizationDate: new Date().toISOString().split('T')[0]
    });
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false); // NEW: Track if auto-submit happened

    useEffect(() => {
        if (profile?.name) {
            setFormData(prev => ({ ...prev, ownerName: profile.name ?? 'Unknown' }));
        }
    }, [profile]);

    // If user came from Quick Upload, populate file and auto-fill name/description
    useEffect(() => {
        // React Router may not serialize File objects in history state; allow window fallback
        const quickFromState = (location.state as any)?.quickFile as File | undefined;
        const quickFallback = (window as any).__quickUploadFile as File | undefined;
        const quickFile = quickFromState || quickFallback;
        if (quickFile && !hasAutoSubmitted) { // CHANGED: Check hasAutoSubmitted
            setSourceFile(quickFile);
            setFormData(prev => ({
                ...prev,
                name: quickFile.name.split('.').slice(0, -1).join('.') || quickFile.name,
                description: `Auto-generated description for ${quickFile.name.split('.').slice(0, -1).join('.') || quickFile.name}`,
            }));
        }
    }, [location.state, hasAutoSubmitted]); // CHANGED: Added hasAutoSubmitted dependency

    // Auto-submit when quickFile present, wallet/account are ready and sourceFile state is populated
    useEffect(() => {
        const quickFromState = (location.state as any)?.quickFile as File | undefined;
        const quickFallback = (window as any).__quickUploadFile as File | undefined;
        const quickFile = quickFromState || quickFallback;

        if (quickFile && account && activeWallet && sourceFile && !isSubmitting && !hasAutoSubmitted) { // CHANGED: Check hasAutoSubmitted
            // small delay to allow state updates/UI to settle
            const t = setTimeout(() => {
                (async () => {
                    try {
                        setHasAutoSubmitted(true); // CHANGED: Mark as submitted
                        const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent;
                        await handleSubmit(fakeEvent);
                    } catch (err) {
                        console.error('Auto submit failed', err);
                        setHasAutoSubmitted(false); // CHANGED: Reset on error so user can retry
                    }
                })();
            }, 300);
            return () => clearTimeout(t);
        } else if (quickFile && (!account || !activeWallet) && !hasAutoSubmitted) { // CHANGED: Check hasAutoSubmitted
            setStatusMessage('File ready — waiting for wallet connection to auto-submit.');
        }
    }, [account, activeWallet, location.state, sourceFile, isSubmitting, hasAutoSubmitted]); // CHANGED: Added hasAutoSubmitted dependency

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
        // Provide precise guidance depending on what's missing
        if (!sourceFile) {
            setStatusMessage('Please select a file to upload.');
            return;
        }
        if (!account || !activeWallet) {
            setStatusMessage('Please connect your wallet to continue.');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);
        try {
            setStatusMessage('Step 1/6: Generating encryption keys...');
            // give small weight to key generation
            setProgress(2);
            const eip = EIP1193.toProvider({ wallet: activeWallet, client, chain: chain });
            const signer = new ethers.providers.Web3Provider(eip).getSigner();
            const owner = account.address;
            const timestamp = formData.tokenizationDate;
            const counter = Date.now();

            setStatusMessage('Step 2/6: Encrypting file data...');
            // small weight for encryption
            setProgress(8);
            const dek = generateDEK();
            const nonce = await generateNonce(owner, timestamp, counter);
            const fileDataU8 = new Uint8Array(await sourceFile.arrayBuffer());
            const encryptedData = await aesGcmEncrypt(dek, fileDataU8, nonce);

            setStatusMessage('Step 3/6: Creating verifiable chunks...');
            // chunking depends on payload size; start at 12% and allow multiply to update
            setProgress(12);
            const encryptedDataB64 = Buffer.from(encryptedData).toString('base64');
            // provide progress callback: multiply will call with processed/total
            const p1 = await multiply(owner, encryptedDataB64, (p, total) => {
                // map multiply progress (0..total) to range 12..45
                const pct = 12 + Math.round((p / total) * (45 - 12));
                setProgress(pct);
            });
            const p2 = await multiply(p1, timestamp, (p, total) => {
                const base = 45; // small ramp
                const pct = base + Math.round((p / total) * 5);
                setProgress(pct);
            });
            const chunk_a = await multiply(p2, counter.toString(), (p, total) => {
                const base = 50;
                const pct = base + Math.round((p / total) * 5);
                setProgress(pct);
            });

            const dataHashB64 = Buffer.from(await sha256(fileDataU8)).toString('base64');
            const hmacKey = new TextEncoder().encode(owner + timestamp);
            const hmacHash = await hmacSha256(hmacKey, encryptedData);
            const hmacHashB64 = Buffer.from(hmacHash).toString('base64');
            const chunk_b = await multiply(dataHashB64, hmacHashB64);
            const chunk = merge(chunk_a, chunk_b);

            setProgress(60);
            setStatusMessage('Step 4/6: Securing metadata...');
            const { metachunk } = await encode(chunk);
            
            // Upload: use XHR so we can get per-byte progress for large files
            setProgress(70);
            setStatusMessage('Step 5/6: Uploading to IPFS...');
            const metaChunkFile = new File([metachunk], "metachunk.txt", { type: 'text/plain' });
            const metachunkCid = await new Promise<string>(async (resolve, reject) => {
                try {
                    const url = '/api/ipfs/file';
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', url, true);
                    const fd = new FormData();
                    fd.append('file', metaChunkFile);

                    xhr.upload.onprogress = (ev) => {
                        if (ev.lengthComputable) {
                            const percent = Math.round((ev.loaded / ev.total) * 100);
                            setUploadProgress(percent);
                            // map upload percent 0..100 to overall progress 70..88
                            const overall = 70 + Math.round((percent / 100) * 18);
                            setProgress(overall);
                        }
                    };

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    const resp = JSON.parse(xhr.responseText);
                                    const cid = (resp as any).replace ? (resp as any).replace(/"/g, '') : resp;
                                    resolve(typeof cid === 'string' ? cid : String(cid));
                                } catch (e) {
                                    resolve(xhr.responseText.replace(/"/g, ''));
                                }
                            } else {
                                reject(new Error(`Upload failed with status ${xhr.status}`));
                            }
                        }
                    };

                    xhr.onerror = () => reject(new Error('Network error during upload'));
                    xhr.send(fd);
                } catch (e) {
                    reject(e);
                }
            });

            setProgress(90);
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

            const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;
            // Debug: log tokenURI length
            console.log('tokenURI length:', tokenURI.length);

            // --- Mint using Thirdweb wallet (no window.ethereum) ---
            setStatusMessage('Step 6/6: Minting on Base Sepolia...');
            setProgress(90);

            try {
                // Use the Thirdweb provider (EIP1193) that's already connected
                const provider = new ethers.providers.Web3Provider(eip);
                const currentSigner = provider.getSigner();
                
                // Check current chain
                const network = await provider.getNetwork();
                
                if (network.chainId !== 84532) {
                    setStatusMessage('Switching to Base Sepolia network...');
                    
                    try {
                        // Try to switch chain using Thirdweb's wallet
                        await activeWallet.switchChain(chain);
                        
                        // Wait a moment for chain switch to complete
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Recreate provider after chain switch
                        const newEip = EIP1193.toProvider({ wallet: activeWallet, client, chain });
                        const newProvider = new ethers.providers.Web3Provider(newEip);
                        const newSigner = newProvider.getSigner();
                        
                        // Use the new signer for the contract
                        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFTDocABI as any, newSigner);
                        
                        setStatusMessage('Please confirm the transaction...');
                        const txResponse = await nftContract.mintNFT(tokenURI);
                        
                        setStatusMessage(`Transaction sent (${txResponse.hash}). Waiting for confirmation...`);
                        await txResponse.wait();
                        
                    } catch (switchError) {
                        console.error('Chain switch error:', switchError);
                        throw new Error('Please switch to Base Sepolia network in your wallet');
                    }
                } else {
                    // Already on correct chain
                    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFTDocABI as any, currentSigner);
                    
                    setStatusMessage('Please confirm the transaction...');
                    const txResponse = await nftContract.mintNFT(tokenURI);
                    
                    setStatusMessage(`Transaction sent (${txResponse.hash}). Waiting for confirmation...`);
                    await txResponse.wait();
                }
                
                // Success - CLEAN UP QUICK UPLOAD STATE
                // CHANGED: Clear the quick upload state before navigation
                delete (window as any).__quickUploadFile;
                
                setStatusMessage('Document minted successfully — updating documents list...');
                setProgress(100);
                try { await refreshDocs(); } catch (e) { console.warn('refreshDocs failed', e); }
                
                // CHANGED: Navigate with state replacement to clear quickFile
                setTimeout(() => navigate('/dashboard/my-docs', { replace: true, state: {} }), 1200);
                
            } catch (txErr: any) {
                console.error('Transaction failed', txErr);
                throw txErr;
            }

        } catch (err: any) {
            console.error(err);
            setStatusMessage(`Error: ${err.message}`);
            // Keep progress as-is but do not let it show 100 on error
            if (progress === 100) setProgress(99);
        } finally {
            setIsSubmitting(false);
            // reset progress after short delay unless still successful state
            setTimeout(() => {
                if (!statusMessage || !statusMessage.toLowerCase().includes('success')) setProgress(null);
            }, 2500);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card variant="premium">
                <CardHeader className="text-center">
                    <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4 text-2xl sm:text-3xl lg:text-4xl">
                        New Document
                    </Heading>
                    <Text color="muted" className="mt-2">
                        Create a new encrypted document
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
                                <Text weight="semibold">{sourceFile ? getFileSize(sourceFile.size) : 'N/A'}</Text>
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

                        {/* Status + Progress */}
                        {isSubmitting && (
                            <div className="space-y-2">
                                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div className="h-2 bg-yellow-400 transition-all duration-300" style={{ width: `${progress ?? 0}%` }} />
                                </div>
                                <div className="text-center text-sm text-gray-300">
                                    {typeof progress === 'number' ? `${Math.round(progress)}%` : 'Processing...'}
                                    {uploadProgress > 0 && <span className="ml-2 text-xs text-gray-400">(upload: {uploadProgress}%)</span>}
                                </div>
                            </div>
                        )}

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
