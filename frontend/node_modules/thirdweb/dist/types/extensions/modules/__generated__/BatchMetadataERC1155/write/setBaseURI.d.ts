import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "setBaseURI" function.
 */
export type SetBaseURIParams = WithOverrides<{
    batchIndex: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_batchIndex";
    }>;
    baseURI: AbiParameterToPrimitiveType<{
        type: "string";
        name: "_baseURI";
    }>;
}>;
export declare const FN_SELECTOR: "0x33cfcb9f";
/**
 * Checks if the `setBaseURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setBaseURI` method is supported.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const supported = BatchMetadataERC1155.isSetBaseURISupported(["0x..."]);
 * ```
 */
export declare function isSetBaseURISupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "setBaseURI" function.
 * @param options - The options for the setBaseURI function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeSetBaseURIParams({
 *  batchIndex: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export declare function encodeSetBaseURIParams(options: SetBaseURIParams): `0x${string}`;
/**
 * Encodes the "setBaseURI" function into a Hex string with its parameters.
 * @param options - The options for the setBaseURI function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeSetBaseURI({
 *  batchIndex: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export declare function encodeSetBaseURI(options: SetBaseURIParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "setBaseURI" function on the contract.
 * @param options - The options for the "setBaseURI" function.
 * @returns A prepared transaction object.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const transaction = BatchMetadataERC1155.setBaseURI({
 *  contract,
 *  batchIndex: ...,
 *  baseURI: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function setBaseURI(options: BaseTransactionOptions<SetBaseURIParams | {
    asyncParams: () => Promise<SetBaseURIParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=setBaseURI.d.ts.map