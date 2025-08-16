"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProxyContract = void 0;
const assert_1 = __importDefault(require("assert"));
const ethers_1 = require("ethers");
const { getAddress } = ethers_1.utils;
const setupProxyContract = async (proxyContract, signer, { targetImplAddress, targetProxyOwnerAddress, postUpgradeCallCalldata, }) => {
    const currentAdmin = await proxyContract
        .connect(ethers_1.ethers.constants.AddressZero)
        .callStatic.admin();
    const signerAddress = await signer.getAddress();
    const currentImplementation = await proxyContract
        .connect(ethers_1.ethers.constants.AddressZero)
        .callStatic.implementation();
    console.log(`implementation currently set to ${currentImplementation}`);
    if (getAddress(currentImplementation) !== getAddress(targetImplAddress)) {
        console.log('implementation not set to correct contract');
        console.log(`Setting implementation to ${targetImplAddress}`);
        (0, assert_1.default)(signerAddress === currentAdmin, 'the passed signer is not the admin, cannot update implementation');
        let tx;
        if (!postUpgradeCallCalldata) {
            console.log('postUpgradeCallCalldata is not provided. Using Proxy.upgrade()');
            tx = await proxyContract.connect(signer).upgradeTo(targetImplAddress);
        }
        else {
            console.log('postUpgradeCallCalldata is provided. Using Proxy.upgradeAndCall()');
            tx = await proxyContract
                .connect(signer)
                .upgradeToAndCall(targetImplAddress, postUpgradeCallCalldata);
        }
        const receipt = await tx.wait();
        console.log(`implementation set in ${receipt.transactionHash}`);
    }
    else {
        console.log(`implementation already set correctly to ${targetImplAddress}`);
    }
    console.log(`admin set to ${currentAdmin}`);
    if (getAddress(currentAdmin) !== getAddress(targetProxyOwnerAddress)) {
        console.log('detected admin is not set correctly');
        console.log(`Setting admin to ${targetProxyOwnerAddress}`);
        (0, assert_1.default)(signerAddress === currentAdmin, 'proxyOwnerSigner is not the admin, cannot update admin');
        const tx = await proxyContract
            .connect(signer)
            .changeAdmin(targetProxyOwnerAddress);
        const receipt = await tx.wait();
        console.log(`admin set in ${receipt.transactionHash}`);
    }
    else {
        console.log(`admin already set correctly to ${targetProxyOwnerAddress}`);
    }
    const updatedImplementation = await proxyContract
        .connect(ethers_1.ethers.constants.AddressZero)
        .callStatic.implementation();
    const updatedAdmin = await proxyContract
        .connect(ethers_1.ethers.constants.AddressZero)
        .callStatic.admin();
    (0, assert_1.default)(getAddress(updatedAdmin) === getAddress(targetProxyOwnerAddress), 'Something went wrong - admin not set correctly after transaction');
    (0, assert_1.default)(getAddress(updatedImplementation) === getAddress(targetImplAddress), 'Something went wrong - implementation not set correctly after transaction');
    console.log(`Proxy at ${proxyContract.address} is set up with implementation: ${updatedImplementation} and admin: ${updatedAdmin}`);
};
exports.setupProxyContract = setupProxyContract;
//# sourceMappingURL=setupProxyContract.js.map