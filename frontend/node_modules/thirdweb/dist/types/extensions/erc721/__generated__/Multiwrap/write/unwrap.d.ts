import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "unwrap" function.
 */
export type UnwrapParams = WithOverrides<{
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_tokenId";
    }>;
    recipient: AbiParameterToPrimitiveType<{
        type: "address";
        name: "_recipient";
    }>;
}>;
export declare const FN_SELECTOR: "0x7647691d";
/**
 * Checks if the `unwrap` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `unwrap` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isUnwrapSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isUnwrapSupported(["0x..."]);
 * ```
 */
export declare function isUnwrapSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "unwrap" function.
 * @param options - The options for the unwrap function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeUnwrapParams } from "thirdweb/extensions/erc721";
 * const result = encodeUnwrapParams({
 *  tokenId: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeUnwrapParams(options: UnwrapParams): `0x${string}`;
/**
 * Encodes the "unwrap" function into a Hex string with its parameters.
 * @param options - The options for the unwrap function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeUnwrap } from "thirdweb/extensions/erc721";
 * const result = encodeUnwrap({
 *  tokenId: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeUnwrap(options: UnwrapParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "unwrap" function on the contract.
 * @param options - The options for the "unwrap" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { unwrap } from "thirdweb/extensions/erc721";
 *
 * const transaction = unwrap({
 *  contract,
 *  tokenId: ...,
 *  recipient: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function unwrap(options: BaseTransactionOptions<UnwrapParams | {
    asyncParams: () => Promise<UnwrapParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=unwrap.d.ts.map