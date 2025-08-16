import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "updateTokenIdERC1155" function.
 */
export type UpdateTokenIdERC1155Params = WithOverrides<{
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_tokenId";
    }>;
}>;
export declare const FN_SELECTOR: "0x034eb4dd";
/**
 * Checks if the `updateTokenIdERC1155` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `updateTokenIdERC1155` method is supported.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 *
 * const supported = SequentialTokenIdERC1155.isUpdateTokenIdERC1155Supported(["0x..."]);
 * ```
 */
export declare function isUpdateTokenIdERC1155Supported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "updateTokenIdERC1155" function.
 * @param options - The options for the updateTokenIdERC1155 function.
 * @returns The encoded ABI parameters.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 * const result = SequentialTokenIdERC1155.encodeUpdateTokenIdERC1155Params({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeUpdateTokenIdERC1155Params(options: UpdateTokenIdERC1155Params): `0x${string}`;
/**
 * Encodes the "updateTokenIdERC1155" function into a Hex string with its parameters.
 * @param options - The options for the updateTokenIdERC1155 function.
 * @returns The encoded hexadecimal string.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 * const result = SequentialTokenIdERC1155.encodeUpdateTokenIdERC1155({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeUpdateTokenIdERC1155(options: UpdateTokenIdERC1155Params): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "updateTokenIdERC1155" function on the contract.
 * @param options - The options for the "updateTokenIdERC1155" function.
 * @returns A prepared transaction object.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 *
 * const transaction = SequentialTokenIdERC1155.updateTokenIdERC1155({
 *  contract,
 *  tokenId: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function updateTokenIdERC1155(options: BaseTransactionOptions<UpdateTokenIdERC1155Params | {
    asyncParams: () => Promise<UpdateTokenIdERC1155Params>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=updateTokenIdERC1155.d.ts.map