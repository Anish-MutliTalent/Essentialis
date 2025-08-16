import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "supportsModule" function.
 */
export type SupportsModuleParams = {
    moduleTypeId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "moduleTypeId";
    }>;
};
export declare const FN_SELECTOR: "0xf2dc691d";
/**
 * Checks if the `supportsModule` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `supportsModule` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isSupportsModuleSupported } from "thirdweb/extensions/erc7579";
 * const supported = isSupportsModuleSupported(["0x..."]);
 * ```
 */
export declare function isSupportsModuleSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "supportsModule" function.
 * @param options - The options for the supportsModule function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsModuleParams } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsModuleParams({
 *  moduleTypeId: ...,
 * });
 * ```
 */
export declare function encodeSupportsModuleParams(options: SupportsModuleParams): `0x${string}`;
/**
 * Encodes the "supportsModule" function into a Hex string with its parameters.
 * @param options - The options for the supportsModule function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsModule } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsModule({
 *  moduleTypeId: ...,
 * });
 * ```
 */
export declare function encodeSupportsModule(options: SupportsModuleParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the supportsModule function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeSupportsModuleResult } from "thirdweb/extensions/erc7579";
 * const result = decodeSupportsModuleResultResult("...");
 * ```
 */
export declare function decodeSupportsModuleResult(result: Hex): boolean;
/**
 * Calls the "supportsModule" function on the contract.
 * @param options - The options for the supportsModule function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { supportsModule } from "thirdweb/extensions/erc7579";
 *
 * const result = await supportsModule({
 *  contract,
 *  moduleTypeId: ...,
 * });
 *
 * ```
 */
export declare function supportsModule(options: BaseTransactionOptions<SupportsModuleParams>): Promise<boolean>;
//# sourceMappingURL=supportsModule.d.ts.map