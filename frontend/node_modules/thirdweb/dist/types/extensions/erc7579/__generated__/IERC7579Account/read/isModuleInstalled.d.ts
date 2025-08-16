import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "isModuleInstalled" function.
 */
export type IsModuleInstalledParams = {
    moduleTypeId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "moduleTypeId";
    }>;
    module: AbiParameterToPrimitiveType<{
        type: "address";
        name: "module";
    }>;
    additionalContext: AbiParameterToPrimitiveType<{
        type: "bytes";
        name: "additionalContext";
    }>;
};
export declare const FN_SELECTOR: "0x112d3a7d";
/**
 * Checks if the `isModuleInstalled` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isModuleInstalled` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isIsModuleInstalledSupported } from "thirdweb/extensions/erc7579";
 * const supported = isIsModuleInstalledSupported(["0x..."]);
 * ```
 */
export declare function isIsModuleInstalledSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "isModuleInstalled" function.
 * @param options - The options for the isModuleInstalled function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeIsModuleInstalledParams } from "thirdweb/extensions/erc7579";
 * const result = encodeIsModuleInstalledParams({
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 * ```
 */
export declare function encodeIsModuleInstalledParams(options: IsModuleInstalledParams): `0x${string}`;
/**
 * Encodes the "isModuleInstalled" function into a Hex string with its parameters.
 * @param options - The options for the isModuleInstalled function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeIsModuleInstalled } from "thirdweb/extensions/erc7579";
 * const result = encodeIsModuleInstalled({
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 * ```
 */
export declare function encodeIsModuleInstalled(options: IsModuleInstalledParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the isModuleInstalled function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeIsModuleInstalledResult } from "thirdweb/extensions/erc7579";
 * const result = decodeIsModuleInstalledResultResult("...");
 * ```
 */
export declare function decodeIsModuleInstalledResult(result: Hex): boolean;
/**
 * Calls the "isModuleInstalled" function on the contract.
 * @param options - The options for the isModuleInstalled function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isModuleInstalled } from "thirdweb/extensions/erc7579";
 *
 * const result = await isModuleInstalled({
 *  contract,
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 *
 * ```
 */
export declare function isModuleInstalled(options: BaseTransactionOptions<IsModuleInstalledParams>): Promise<boolean>;
//# sourceMappingURL=isModuleInstalled.d.ts.map