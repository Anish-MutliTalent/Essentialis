import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "addExtension" function.
 */
export type AddExtensionParams = WithOverrides<{
    extension: AbiParameterToPrimitiveType<{
        type: "tuple";
        name: "extension";
        components: [
            {
                type: "tuple";
                name: "metadata";
                components: [
                    {
                        type: "string";
                        name: "name";
                    },
                    {
                        type: "string";
                        name: "metadataURI";
                    },
                    {
                        type: "address";
                        name: "implementation";
                    }
                ];
            },
            {
                type: "tuple[]";
                name: "functions";
                components: [
                    {
                        type: "bytes4";
                        name: "functionSelector";
                    },
                    {
                        type: "string";
                        name: "functionSignature";
                    }
                ];
            }
        ];
    }>;
}>;
export declare const FN_SELECTOR: "0xe05688fe";
/**
 * Checks if the `addExtension` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addExtension` method is supported.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { isAddExtensionSupported } from "thirdweb/extensions/dynamic-contracts";
 *
 * const supported = isAddExtensionSupported(["0x..."]);
 * ```
 */
export declare function isAddExtensionSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "addExtension" function.
 * @param options - The options for the addExtension function.
 * @returns The encoded ABI parameters.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeAddExtensionParams } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeAddExtensionParams({
 *  extension: ...,
 * });
 * ```
 */
export declare function encodeAddExtensionParams(options: AddExtensionParams): `0x${string}`;
/**
 * Encodes the "addExtension" function into a Hex string with its parameters.
 * @param options - The options for the addExtension function.
 * @returns The encoded hexadecimal string.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeAddExtension } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeAddExtension({
 *  extension: ...,
 * });
 * ```
 */
export declare function encodeAddExtension(options: AddExtensionParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "addExtension" function on the contract.
 * @param options - The options for the "addExtension" function.
 * @returns A prepared transaction object.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addExtension } from "thirdweb/extensions/dynamic-contracts";
 *
 * const transaction = addExtension({
 *  contract,
 *  extension: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function addExtension(options: BaseTransactionOptions<AddExtensionParams | {
    asyncParams: () => Promise<AddExtensionParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=addExtension.d.ts.map