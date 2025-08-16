import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "removeExtension" function.
 */
export type RemoveExtensionParams = WithOverrides<{
    extensionName: AbiParameterToPrimitiveType<{
        type: "string";
        name: "extensionName";
    }>;
}>;
export declare const FN_SELECTOR: "0xee7d2adf";
/**
 * Checks if the `removeExtension` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `removeExtension` method is supported.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { isRemoveExtensionSupported } from "thirdweb/extensions/dynamic-contracts";
 *
 * const supported = isRemoveExtensionSupported(["0x..."]);
 * ```
 */
export declare function isRemoveExtensionSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "removeExtension" function.
 * @param options - The options for the removeExtension function.
 * @returns The encoded ABI parameters.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeRemoveExtensionParams } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeRemoveExtensionParams({
 *  extensionName: ...,
 * });
 * ```
 */
export declare function encodeRemoveExtensionParams(options: RemoveExtensionParams): `0x${string}`;
/**
 * Encodes the "removeExtension" function into a Hex string with its parameters.
 * @param options - The options for the removeExtension function.
 * @returns The encoded hexadecimal string.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeRemoveExtension } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeRemoveExtension({
 *  extensionName: ...,
 * });
 * ```
 */
export declare function encodeRemoveExtension(options: RemoveExtensionParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "removeExtension" function on the contract.
 * @param options - The options for the "removeExtension" function.
 * @returns A prepared transaction object.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { removeExtension } from "thirdweb/extensions/dynamic-contracts";
 *
 * const transaction = removeExtension({
 *  contract,
 *  extensionName: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function removeExtension(options: BaseTransactionOptions<RemoveExtensionParams | {
    asyncParams: () => Promise<RemoveExtensionParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=removeExtension.d.ts.map