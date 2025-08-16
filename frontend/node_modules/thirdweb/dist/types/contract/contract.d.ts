import type { Abi } from "abitype";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { type Address } from "../utils/address.js";
/**
 * @contract
 */
export type ContractOptions<abi extends Abi = [], address extends string = string> = {
    client: ThirdwebClient;
    address: address;
    chain: Chain;
    readonly abi?: abi;
};
/**
 * @contract
 */
export type ThirdwebContract<abi extends Abi = [], address extends string = `0x${string}`> = Readonly<ContractOptions<abi, address>>;
/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param options - The options for creating the contract.
 * @returns The Thirdweb contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  chain: sepolia,
 *  address: "0x123...",
 *  // optional ABI
 *  abi: [...],
 * });
 * ```
 * @contract
 */
export declare function getContract<const abi extends Abi = []>(options: ContractOptions<abi>): ThirdwebContract<abi, Address>;
//# sourceMappingURL=contract.d.ts.map