import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "getBatchIndex" function.
 */
export type GetBatchIndexParams = {
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_tokenId";
    }>;
};
export declare const FN_SELECTOR: "0x44ec3c07";
/**
 * Checks if the `getBatchIndex` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBatchIndex` method is supported.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const supported = BatchMetadataERC721.isGetBatchIndexSupported(["0x..."]);
 * ```
 */
export declare function isGetBatchIndexSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "getBatchIndex" function.
 * @param options - The options for the getBatchIndex function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeGetBatchIndexParams({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeGetBatchIndexParams(options: GetBatchIndexParams): `0x${string}`;
/**
 * Encodes the "getBatchIndex" function into a Hex string with its parameters.
 * @param options - The options for the getBatchIndex function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeGetBatchIndex({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeGetBatchIndex(options: GetBatchIndexParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the getBatchIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.decodeGetBatchIndexResultResult("...");
 * ```
 */
export declare function decodeGetBatchIndexResult(result: Hex): bigint;
/**
 * Calls the "getBatchIndex" function on the contract.
 * @param options - The options for the getBatchIndex function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC721.getBatchIndex({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export declare function getBatchIndex(options: BaseTransactionOptions<GetBatchIndexParams>): Promise<bigint>;
//# sourceMappingURL=getBatchIndex.d.ts.map