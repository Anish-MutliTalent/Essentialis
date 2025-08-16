import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "getTokenCountOfBundle" function.
 */
export type GetTokenCountOfBundleParams = {
    bundleId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_bundleId";
    }>;
};
export declare const FN_SELECTOR: "0xd0d2fe25";
/**
 * Checks if the `getTokenCountOfBundle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTokenCountOfBundle` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetTokenCountOfBundleSupported } from "thirdweb/extensions/pack";
 * const supported = isGetTokenCountOfBundleSupported(["0x..."]);
 * ```
 */
export declare function isGetTokenCountOfBundleSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "getTokenCountOfBundle" function.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenCountOfBundleParams } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenCountOfBundleParams({
 *  bundleId: ...,
 * });
 * ```
 */
export declare function encodeGetTokenCountOfBundleParams(options: GetTokenCountOfBundleParams): `0x${string}`;
/**
 * Encodes the "getTokenCountOfBundle" function into a Hex string with its parameters.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenCountOfBundle } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenCountOfBundle({
 *  bundleId: ...,
 * });
 * ```
 */
export declare function encodeGetTokenCountOfBundle(options: GetTokenCountOfBundleParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the getTokenCountOfBundle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetTokenCountOfBundleResult } from "thirdweb/extensions/pack";
 * const result = decodeGetTokenCountOfBundleResultResult("...");
 * ```
 */
export declare function decodeGetTokenCountOfBundleResult(result: Hex): bigint;
/**
 * Calls the "getTokenCountOfBundle" function on the contract.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getTokenCountOfBundle } from "thirdweb/extensions/pack";
 *
 * const result = await getTokenCountOfBundle({
 *  contract,
 *  bundleId: ...,
 * });
 *
 * ```
 */
export declare function getTokenCountOfBundle(options: BaseTransactionOptions<GetTokenCountOfBundleParams>): Promise<bigint>;
//# sourceMappingURL=getTokenCountOfBundle.d.ts.map