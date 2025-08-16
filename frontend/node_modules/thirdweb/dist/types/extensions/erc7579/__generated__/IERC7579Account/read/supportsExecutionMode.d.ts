import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "supportsExecutionMode" function.
 */
export type SupportsExecutionModeParams = {
    encodedMode: AbiParameterToPrimitiveType<{
        type: "bytes32";
        name: "encodedMode";
    }>;
};
export declare const FN_SELECTOR: "0xd03c7914";
/**
 * Checks if the `supportsExecutionMode` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `supportsExecutionMode` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isSupportsExecutionModeSupported } from "thirdweb/extensions/erc7579";
 * const supported = isSupportsExecutionModeSupported(["0x..."]);
 * ```
 */
export declare function isSupportsExecutionModeSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "supportsExecutionMode" function.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsExecutionModeParams } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsExecutionModeParams({
 *  encodedMode: ...,
 * });
 * ```
 */
export declare function encodeSupportsExecutionModeParams(options: SupportsExecutionModeParams): `0x${string}`;
/**
 * Encodes the "supportsExecutionMode" function into a Hex string with its parameters.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsExecutionMode } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsExecutionMode({
 *  encodedMode: ...,
 * });
 * ```
 */
export declare function encodeSupportsExecutionMode(options: SupportsExecutionModeParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the supportsExecutionMode function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeSupportsExecutionModeResult } from "thirdweb/extensions/erc7579";
 * const result = decodeSupportsExecutionModeResultResult("...");
 * ```
 */
export declare function decodeSupportsExecutionModeResult(result: Hex): boolean;
/**
 * Calls the "supportsExecutionMode" function on the contract.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { supportsExecutionMode } from "thirdweb/extensions/erc7579";
 *
 * const result = await supportsExecutionMode({
 *  contract,
 *  encodedMode: ...,
 * });
 *
 * ```
 */
export declare function supportsExecutionMode(options: BaseTransactionOptions<SupportsExecutionModeParams>): Promise<boolean>;
//# sourceMappingURL=supportsExecutionMode.d.ts.map