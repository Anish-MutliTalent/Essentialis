import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "revoke" function.
 */
export type RevokeParams = WithOverrides<{
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenId";
    }>;
}>;
export declare const FN_SELECTOR: "0x20c5429b";
/**
 * Checks if the `revoke` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `revoke` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isRevokeSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isRevokeSupported(["0x..."]);
 * ```
 */
export declare function isRevokeSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "revoke" function.
 * @param options - The options for the revoke function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeRevokeParams } from "thirdweb/extensions/erc721";
 * const result = encodeRevokeParams({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeRevokeParams(options: RevokeParams): `0x${string}`;
/**
 * Encodes the "revoke" function into a Hex string with its parameters.
 * @param options - The options for the revoke function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeRevoke } from "thirdweb/extensions/erc721";
 * const result = encodeRevoke({
 *  tokenId: ...,
 * });
 * ```
 */
export declare function encodeRevoke(options: RevokeParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "revoke" function on the contract.
 * @param options - The options for the "revoke" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { revoke } from "thirdweb/extensions/erc721";
 *
 * const transaction = revoke({
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
export declare function revoke(options: BaseTransactionOptions<RevokeParams | {
    asyncParams: () => Promise<RevokeParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=revoke.d.ts.map