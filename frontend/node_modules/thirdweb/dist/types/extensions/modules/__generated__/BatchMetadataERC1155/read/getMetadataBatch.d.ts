import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "getMetadataBatch" function.
 */
export type GetMetadataBatchParams = {
    batchIndex: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_batchIndex";
    }>;
};
export declare const FN_SELECTOR: "0xe034558b";
/**
 * Checks if the `getMetadataBatch` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getMetadataBatch` method is supported.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const supported = BatchMetadataERC1155.isGetMetadataBatchSupported(["0x..."]);
 * ```
 */
export declare function isGetMetadataBatchSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "getMetadataBatch" function.
 * @param options - The options for the getMetadataBatch function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetMetadataBatchParams({
 *  batchIndex: ...,
 * });
 * ```
 */
export declare function encodeGetMetadataBatchParams(options: GetMetadataBatchParams): `0x${string}`;
/**
 * Encodes the "getMetadataBatch" function into a Hex string with its parameters.
 * @param options - The options for the getMetadataBatch function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetMetadataBatch({
 *  batchIndex: ...,
 * });
 * ```
 */
export declare function encodeGetMetadataBatch(options: GetMetadataBatchParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the getMetadataBatch function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.decodeGetMetadataBatchResultResult("...");
 * ```
 */
export declare function decodeGetMetadataBatchResult(result: Hex): {
    startTokenIdInclusive: bigint;
    endTokenIdInclusive: bigint;
    baseURI: string;
};
/**
 * Calls the "getMetadataBatch" function on the contract.
 * @param options - The options for the getMetadataBatch function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC1155.getMetadataBatch({
 *  contract,
 *  batchIndex: ...,
 * });
 *
 * ```
 */
export declare function getMetadataBatch(options: BaseTransactionOptions<GetMetadataBatchParams>): Promise<{
    startTokenIdInclusive: bigint;
    endTokenIdInclusive: bigint;
    baseURI: string;
}>;
//# sourceMappingURL=getMetadataBatch.d.ts.map