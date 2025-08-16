import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "getUriOfBundle" function.
 */
export type GetUriOfBundleParams = {
    bundleId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_bundleId";
    }>;
};
export declare const FN_SELECTOR: "0x61195e94";
/**
 * Checks if the `getUriOfBundle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getUriOfBundle` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetUriOfBundleSupported } from "thirdweb/extensions/pack";
 * const supported = isGetUriOfBundleSupported(["0x..."]);
 * ```
 */
export declare function isGetUriOfBundleSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "getUriOfBundle" function.
 * @param options - The options for the getUriOfBundle function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetUriOfBundleParams } from "thirdweb/extensions/pack";
 * const result = encodeGetUriOfBundleParams({
 *  bundleId: ...,
 * });
 * ```
 */
export declare function encodeGetUriOfBundleParams(options: GetUriOfBundleParams): `0x${string}`;
/**
 * Encodes the "getUriOfBundle" function into a Hex string with its parameters.
 * @param options - The options for the getUriOfBundle function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetUriOfBundle } from "thirdweb/extensions/pack";
 * const result = encodeGetUriOfBundle({
 *  bundleId: ...,
 * });
 * ```
 */
export declare function encodeGetUriOfBundle(options: GetUriOfBundleParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the getUriOfBundle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetUriOfBundleResult } from "thirdweb/extensions/pack";
 * const result = decodeGetUriOfBundleResultResult("...");
 * ```
 */
export declare function decodeGetUriOfBundleResult(result: Hex): string;
/**
 * Calls the "getUriOfBundle" function on the contract.
 * @param options - The options for the getUriOfBundle function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getUriOfBundle } from "thirdweb/extensions/pack";
 *
 * const result = await getUriOfBundle({
 *  contract,
 *  bundleId: ...,
 * });
 *
 * ```
 */
export declare function getUriOfBundle(options: BaseTransactionOptions<GetUriOfBundleParams>): Promise<string>;
//# sourceMappingURL=getUriOfBundle.d.ts.map