import { type UseQueryResult } from "@tanstack/react-query";
import type { Abi, AbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { AbiOfLength } from "../../../../contract/types.js";
import type { Extension } from "../../../../extensions/types.js";
import { type ReadContractOptions, type ReadContractResult } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions, ParseMethod } from "../../../../transaction/types.js";
import type { PreparedMethod } from "../../../../utils/abi/prepare-method.js";
import type { WithPickedOnceQueryOptions } from "../types.js";
/**
 * A hook to read state from a contract that automatically updates when the contract changes.
 *
 * You can use raw read calls or read [extensions](https://portal.thirdweb.com/react/v5/extensions) to read from a
 * contract.
 *
 * @param options - The options for reading from a contract
 * @returns a UseQueryResult object.
 * @example
 * ```jsx
 * import { getContract } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 * import { useReadContract } from "thirdweb/react";
 *
 * const contract = getContract({
 *   client,
 *   address: "0x...",
 *   chain: sepolia,
 * });
 *
 * const { data, isLoading } = useReadContract({
 *   contract,
 *   method: "function tokenURI(uint256 tokenId) returns (string)"
 *   params: [1n],
 * });
 * ```
 * @contract
 */
export declare function useReadContract<const TAbi extends Abi, const TMethod extends TAbi extends AbiOfLength<0> ? AbiFunction | string : ExtractAbiFunctionNames<TAbi>>(options: WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>): UseQueryResult<ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>>;
/**
 * A hook to read state from a contract that automatically updates when the contract changes.
 * You can use raw read calls or read [extensions](https://portal.thirdweb.com/react/v5/extensions) to read from a
 * contract.
 *
 * @param extension - An extension to call.
 * @param options - The read extension params.
 * @returns a UseQueryResult object.
 * @example
 *
 * Read a contract extension let you do complex contract queries with less code.
 *
 * ```jsx
 * import { useReadContract } from "thirdweb/react";
 * import { getOwnedNFTs } form "thirdweb/extensions/erc721";
 *
 * const { data, isLoading } = useReadContract(getOwnedNFTs, { contract, owner: address });
 * ```
 */
export declare function useReadContract<const TAbi extends Abi, const TParams extends object, TResult>(extension: Extension<TAbi, TParams, TResult>, options: WithPickedOnceQueryOptions<BaseTransactionOptions<TParams, TAbi>>): UseQueryResult<TResult>;
//# sourceMappingURL=useReadContract.d.ts.map