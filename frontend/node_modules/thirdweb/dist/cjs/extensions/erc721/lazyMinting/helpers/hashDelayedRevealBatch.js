"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashDelayedRevealPassword = void 0;
const utils_1 = require("viem/utils");
const address_js_1 = require("../../../../utils/address.js");
const keccak256_js_1 = require("../../../../utils/hashing/keccak256.js");
/**
 * @internal
 */
const hashDelayedRevealPassword = async (batchTokenIndex, password, contract) => {
    const chainId = BigInt(contract.chain.id);
    const contractAddress = contract.address;
    return (0, keccak256_js_1.keccak256)((0, utils_1.encodePacked)(["string", "uint256", "uint256", "address"], [password, chainId, batchTokenIndex, (0, address_js_1.getAddress)(contractAddress)]));
};
exports.hashDelayedRevealPassword = hashDelayedRevealPassword;
//# sourceMappingURL=hashDelayedRevealBatch.js.map