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
import DocLandABI from '../../../../abi/DocLand.json';

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
import LoadingSpinner from '../../LoadingSpinner';
import { useDashboardContext } from '../../../../pages/DashboardPage';

window.Buffer = window.Buffer || Buffer;

const polygonAmoy = defineChain(80002);
const CONTRACT_ADDRESS = '0xB0097c317C29143A0BdF576DF352829FbBa56ecb';

const MintDocPage: React.FC = () => {
    const navigate = useNavigate();
    const account = useActiveAccount();
    const activeWallet = useActiveWallet();
    const { profile } = useDashboardContext();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        file_type: '',
        file_size: '',
        file_extension: '',
        tokenizationDate: new Date().toISOString(), // Use full ISO string for precision
        ownerName: '',
    });

    const [userEdited, setUserEdited] = useState({ name: false, description: false });
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isMinting, setIsMinting] = useState(false);

    useEffect(() => {
        if (account?.address && profile?.name) {
            setFormData((f) => ({ ...f, ownerName: profile.name || account.address }));
        } else if (account?.address) {
            setFormData((f) => ({ ...f, ownerName: account.address }));
        }
    }, [account, profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
        if (name === 'name' || name === 'description') {
            setUserEdited((u) => ({ ...u, [name]: true }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setSourceFile(file);

        const fileType = file.type || 'N/A';
        const fileSize = file.size ? (file.size / 1024).toFixed(2) + ' KB' : 'N/A';
        const fileExtension = file.name.split('.').pop() || 'N/A';
        const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "");

        setFormData((f) => ({
            ...f,
            name: userEdited.name ? f.name : fileNameNoExt,
            description: userEdited.description ? f.description : `Secure document: ${fileNameNoExt}.${fileExtension}`,
            file_type: fileType,
            file_size: fileSize,
            file_extension: fileExtension,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceFile || !account || !activeWallet) {
            setStatusMessage('Please select a file and connect your wallet.');
            return;
        }

        setIsMinting(true);
        setStatusMessage('Initiating secure tokenization process...');

        try {
            const eip1193Provider = EIP1193.toProvider({ wallet: activeWallet, client, chain: polygonAmoy });
            const provider = new ethers.providers.Web3Provider(eip1193Provider);
            const signer = provider.getSigner();
            const owner = account.address;
            const timestamp = formData.tokenizationDate;
            const counter = Date.now(); // Use timestamp as a unique counter

            // 1. Generate Keys & Nonce
            setStatusMessage('Step 1/7: Generating encryption keys and nonce...');
            const dek = generateDEK();
            const nonce = await generateNonce(owner, timestamp, counter);
            const fileDataU8 = new Uint8Array(await sourceFile.arrayBuffer());

            // 2. Encrypt Data with DEK
            setStatusMessage('Step 2/7: Encrypting file data...');
            const encryptedData = await aesGcmEncrypt(dek, fileDataU8, nonce);

            // 3. Wrap DEK with KEK
            setStatusMessage('Step 3/7: Wrapping access key... Please sign message in wallet.');
            const wrappedDekHex = await wrapDek(signer, dek, nonce);

            // 4. Create Verifiable Chunks
            setStatusMessage('Step 4/7: Creating verifiable data chunks...');
            const encryptedDataB64 = Buffer.from(encryptedData).toString('base64');
            
            // Create chunk_a with chained multiplication for reversibility
            const p1 = await multiply(owner, encryptedDataB64);
            const p2 = await multiply(p1, timestamp);
            const chunk_a = await multiply(p2, counter.toString());

            const dataHashB64 = Buffer.from(await sha256(fileDataU8)).toString('base64');
            const hmacKey = new TextEncoder().encode(owner + timestamp);
            const hmacHash = await hmacSha256(hmacKey, encryptedData);
            const hmacHashB64 = Buffer.from(hmacHash).toString('base64');
            const chunk_b = await multiply(dataHashB64, hmacHashB64);
            
            const chunk = merge(chunk_a, chunk_b);

            // 5. Encrypt chunk with Lit Protocol & create backup
            setStatusMessage('Step 5/7: Securing metadata with Lit Protocol...');
            const { metachunk } = await encode(chunk);

            // 6. Upload metachunk to IPFS
            setStatusMessage('Step 6/7: Uploading secure metadata bundle to IPFS...');
            const metaChunkFile = new File([metachunk], "metachunk.txt", { type: 'text/plain' });
            const ipfsForm = new FormData();
            ipfsForm.append('file', metaChunkFile);
            const ipfsRes = await fetch('/api/ipfs/file', { method: 'POST', body: ipfsForm });
            let metachunkCid = await ipfsRes.json();
            if ((metachunkCid?.startsWith('"') && metachunkCid.endsWith('"'))) {
                metachunkCid = metachunkCid.substring(1, metachunkCid.length - 1);
            }

            // 7. Assemble On-Chain Metadata & Mint
            setStatusMessage('Step 7/7: Preparing on-chain data...');
            const metadata = {
                name: formData.name,
                description: formData.description,
                attributes: [
                    { "trait_type": "File Type", "value": formData.file_type },
                    { "trait_type": "File Size", "value": formData.file_size },
                    { "trait_type": "File Extension", "value": formData.file_extension },
                    { "trait_type": "Owner Name", "value": formData.ownerName },
                    { "trait_type": "Tokenization Date", "value": timestamp },
                    { "trait_type": "Counter", "value": counter.toString() } // Store counter for decryption
                ],
                encrypted_file_cid: metachunkCid, // This now points to the metachunk
                nonce: ethers.utils.hexlify(nonce),
                wrapped_deks: {
                    [owner.toLowerCase()]: wrappedDekHex,
                }
            };

            const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;

            setStatusMessage('Please confirm the transaction in your wallet...');
            const contract = getContract({ client, address: CONTRACT_ADDRESS, abi: DocLandABI as any, chain: polygonAmoy });
            const transaction = prepareContractCall({ contract, method: 'function mintNFT(string memory data)', params: [tokenURI] });
            const { transactionHash } = await sendTransaction({ transaction, account });

            setStatusMessage('Transaction sent! Waiting for confirmation...');
            await waitForReceipt({ client, chain: polygonAmoy, transactionHash });

            setStatusMessage('Success! Your document has been securely tokenized.');
            navigate('/dashboard/my-docs');

        } catch (err: any) {
            console.error("Minting process failed:", err);
            setStatusMessage(`Error: ${err.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="flex justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800 text-white rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Securely Tokenize a New Document</h2>
                <div>
                    <label htmlFor="sourceFile" className="block text-sm font-medium text-gray-300">
                        Upload File*
                    </label>
                    <input id="sourceFile" type="file" name="sourceFile" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600" />
                </div>
                {sourceFile && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-700/50 p-3 rounded-md">
                        <div><span className="font-semibold">File Size:</span> {formData.file_size}</div>
                        <div><span className="font-semibold">File Type:</span> {formData.file_type}</div>
                        <div><span className="font-semibold">Extension:</span> {formData.file_extension}</div>
                    </div>
                )}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name*</label>
                    <input id="name" name="name" value={formData.name} onChange={handleChange} required className="input-field mt-1" placeholder="e.g., Q4 Financial Report" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description*</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required className="input-field mt-1" placeholder="A brief description of the document." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-300">Owner Name</label>
                        <input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} readOnly className="input-field mt-1 bg-gray-700 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="tokenizationDate" className="block text-sm font-medium text-gray-300">Tokenization Date</label>
                        <input id="tokenizationDate" type="text" name="tokenizationDate" value={new Date(formData.tokenizationDate).toLocaleString()} readOnly className="input-field mt-1 bg-gray-700 cursor-not-allowed" />
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={isMinting || !account} className="w-full py-3 px-4 bg-indigo-600 rounded-md font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-wait">
                        {isMinting ? <LoadingSpinner /> : 'Secure & Mint Document'}
                    </button>
                    {!account && <p className="text-center text-yellow-400 text-sm mt-4">Please connect your wallet to mint.</p>}
                    {statusMessage && (
                        <div className="mt-4 text-center p-3 rounded-md bg-gray-700">
                            <p className="text-sm text-gray-200">{statusMessage}</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MintDocPage;