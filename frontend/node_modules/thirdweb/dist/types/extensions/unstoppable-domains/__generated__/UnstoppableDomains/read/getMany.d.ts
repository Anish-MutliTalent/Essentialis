import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "getMany" function.
 */
export type GetManyParams = {
    keys: AbiParameterToPrimitiveType<{
        type: "string[]";
        name: "keys";
    }>;
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenId";
    }>;
};
export declare const FN_SELECTOR: "0x1bd8cc1a";
/**
 * Checks if the `getMany` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getMany` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isGetManySupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isGetManySupported(["0x..."]);
 * ```
 */
export declare function isGetManySupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "getMany" function.
 * @param options - The options for the getMany function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeGetManyParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeGetManyParams({
 *  keys: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeGetManyParams(options: GetManyParams): `0x${string}`;
/**
 * Encodes the "getMany" function into a Hex string with its parameters.
 * @param options - The options for the getMany function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeGetMany } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeGetMany({
 *  keys: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeGetMany(options: GetManyParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the getMany function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeGetManyResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeGetManyResultResult("...");
 * ```
 */
export declare function decodeGetManyResult(result: Hex): readonly string[];
/**
 * Calls the "getMany" function on the contract.
 * @param options - The options for the getMany function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { getMany } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await getMany({
 *  contract,
 *  keys: ...,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export declare function getMany(options: BaseTransactionOptions<GetManyParams>): Promise<readonly string[]>;
//# sourceMappingURL=getMany.d.ts.map