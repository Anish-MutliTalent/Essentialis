import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "cancel" function.
 */
export type CancelParams = WithOverrides<{
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenId";
    }>;
}>;
export declare const FN_SELECTOR: "0x40e58ee5";
/**
 * Checks if the `cancel` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `cancel` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isCancelSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isCancelSupported(["0x..."]);
 * ```
 */
export declare function isCancelSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "cancel" function.
 * @param options - The options for the cancel function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeCancelParams } from "thirdweb/extensions/erc721";
 * const result = encodeCancelParams({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeCancelParams(options: CancelParams): `0x${string}`;
/**
 * Encodes the "cancel" function into a Hex string with its parameters.
 * @param options - The options for the cancel function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeCancel } from "thirdweb/extensions/erc721";
 * const result = encodeCancel({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeCancel(options: CancelParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "cancel" function on the contract.
 * @param options - The options for the "cancel" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { cancel } from "thirdweb/extensions/erc721";
 *
 * const transaction = cancel({
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
export declare function cancel(options: BaseTransactionOptions<CancelParams | {
    asyncParams: () => Promise<CancelParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=cancel.d.ts.map