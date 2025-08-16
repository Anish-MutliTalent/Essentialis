import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "reverseNameOf" function.
 */
export type ReverseNameOfParams = {
    addr: AbiParameterToPrimitiveType<{
        type: "address";
        name: "addr";
    }>;
};
export declare const FN_SELECTOR: "0xbebec6b4";
/**
 * Checks if the `reverseNameOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `reverseNameOf` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isReverseNameOfSupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isReverseNameOfSupported(["0x..."]);
 * ```
 */
export declare function isReverseNameOfSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "reverseNameOf" function.
 * @param options - The options for the reverseNameOf function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeReverseNameOfParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeReverseNameOfParams({
 *  addr: ...,
 * });
 * ```
 */
export declare function encodeReverseNameOfParams(options: ReverseNameOfParams): `0x${string}`;
/**
 * Encodes the "reverseNameOf" function into a Hex string with its parameters.
 * @param options - The options for the reverseNameOf function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeReverseNameOf } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeReverseNameOf({
 *  addr: ...,
 * });
 * ```
 */
export declare function encodeReverseNameOf(options: ReverseNameOfParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the reverseNameOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeReverseNameOfResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeReverseNameOfResultResult("...");
 * ```
 */
export declare function decodeReverseNameOfResult(result: Hex): string;
/**
 * Calls the "reverseNameOf" function on the contract.
 * @param options - The options for the reverseNameOf function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { reverseNameOf } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await reverseNameOf({
 *  contract,
 *  addr: ...,
 * });
 *
 * ```
 */
export declare function reverseNameOf(options: BaseTransactionOptions<ReverseNameOfParams>): Promise<string>;
//# sourceMappingURL=reverseNameOf.d.ts.map