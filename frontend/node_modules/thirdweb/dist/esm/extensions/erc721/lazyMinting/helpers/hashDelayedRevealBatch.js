import { encodePacked } from "viem/utils";
import { getAddress } from "../../../../utils/address.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
/**
 * @internal
 */
export const hashDelayedRevealPassword = async (batchTokenIndex, password, contract) => {
    const chainId = BigInt(contract.chain.id);
    const contractAddress = contract.address;
    return keccak256(encodePacked(["string", "uint256", "uint256", "address"], [password, chainId, batchTokenIndex, getAddress(contractAddress)]));
};
//# sourceMappingURL=hashDelayedRevealBatch.js.map