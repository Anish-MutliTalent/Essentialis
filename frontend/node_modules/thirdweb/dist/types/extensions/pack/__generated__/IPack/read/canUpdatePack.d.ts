import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "canUpdatePack" function.
 */
export type CanUpdatePackParams = {
    key: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_key";
    }>;
};
export declare const FN_SELECTOR: "0xb0381b08";
/**
 * Checks if the `canUpdatePack` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `canUpdatePack` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isCanUpdatePackSupported } from "thirdweb/extensions/pack";
 * const supported = isCanUpdatePackSupported(["0x..."]);
 * ```
 */
export declare function isCanUpdatePackSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "canUpdatePack" function.
 * @param options - The options for the canUpdatePack function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCanUpdatePackParams } from "thirdweb/extensions/pack";
 * const result = encodeCanUpdatePackParams({
 *  key: ...,
 * });
 * ```
 */
export declare function encodeCanUpdatePackParams(options: CanUpdatePackParams): `0x${string}`;
/**
 * Encodes the "canUpdatePack" function into a Hex string with its parameters.
 * @param options - The options for the canUpdatePack function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCanUpdatePack } from "thirdweb/extensions/pack";
 * const result = encodeCanUpdatePack({
 *  key: ...,
 * });
 * ```
 */
export declare function encodeCanUpdatePack(options: CanUpdatePackParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the canUpdatePack function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeCanUpdatePackResult } from "thirdweb/extensions/pack";
 * const result = decodeCanUpdatePackResultResult("...");
 * ```
 */
export declare function decodeCanUpdatePackResult(result: Hex): boolean;
/**
 * Calls the "canUpdatePack" function on the contract.
 * @param options - The options for the canUpdatePack function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { canUpdatePack } from "thirdweb/extensions/pack";
 *
 * const result = await canUpdatePack({
 *  contract,
 *  key: ...,
 * });
 *
 * ```
 */
export declare function canUpdatePack(options: BaseTransactionOptions<CanUpdatePackParams>): Promise<boolean>;
//# sourceMappingURL=canUpdatePack.d.ts.map