import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "namehash" function.
 */
export type NamehashParams = {
    labels: AbiParameterToPrimitiveType<{
        type: "string[]";
        name: "labels";
    }>;
};
export declare const FN_SELECTOR: "0x276fabb1";
/**
 * Checks if the `namehash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `namehash` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isNamehashSupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isNamehashSupported(["0x..."]);
 * ```
 */
export declare function isNamehashSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "namehash" function.
 * @param options - The options for the namehash function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeNamehashParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeNamehashParams({
 *  labels: ...,
 * });
 * ```
 */
export declare function encodeNamehashParams(options: NamehashParams): `0x${string}`;
/**
 * Encodes the "namehash" function into a Hex string with its parameters.
 * @param options - The options for the namehash function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeNamehash } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeNamehash({
 *  labels: ...,
 * });
 * ```
 */
export declare function encodeNamehash(options: NamehashParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the namehash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeNamehashResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeNamehashResultResult("...");
 * ```
 */
export declare function decodeNamehashResult(result: Hex): bigint;
/**
 * Calls the "namehash" function on the contract.
 * @param options - The options for the namehash function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { namehash } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await namehash({
 *  contract,
 *  labels: ...,
 * });
 *
 * ```
 */
export declare function namehash(options: BaseTransactionOptions<NamehashParams>): Promise<bigint>;
//# sourceMappingURL=namehash.d.ts.map