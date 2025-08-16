import { ethers } from 'ethers';
type ProxyConfig = {
    targetImplAddress: string;
    targetProxyOwnerAddress: string;
    postUpgradeCallCalldata?: string;
};
declare const setupProxyContract: (proxyContract: ethers.Contract, signer: ethers.Signer, { targetImplAddress, targetProxyOwnerAddress, postUpgradeCallCalldata, }: ProxyConfig) => Promise<void>;
export { setupProxyContract };
