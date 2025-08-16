import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "wrap" function.
 */
export type WrapParams = WithOverrides<{
    tokensToWrap: AbiParameterToPrimitiveType<{
        type: "tuple[]";
        name: "_tokensToWrap";
        components: [
            {
                type: "address";
                name: "assetContract";
            },
            {
                type: "uint8";
                name: "tokenType";
            },
            {
                type: "uint256";
                name: "tokenId";
            },
            {
                type: "uint256";
                name: "amount";
            }
        ];
    }>;
    uriForWrappedToken: AbiParameterToPrimitiveType<{
        type: "string";
        name: "_uriForWrappedToken";
    }>;
    recipient: AbiParameterToPrimitiveType<{
        type: "address";
        name: "_recipient";
    }>;
}>;
export declare const FN_SELECTOR: "0x29e471dd";
/**
 * Checks if the `wrap` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `wrap` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isWrapSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isWrapSupported(["0x..."]);
 * ```
 */
export declare function isWrapSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "wrap" function.
 * @param options - The options for the wrap function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeWrapParams } from "thirdweb/extensions/erc721";
 * const result = encodeWrapParams({
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeWrapParams(options: WrapParams): `0x${string}`;
/**
 * Encodes the "wrap" function into a Hex string with its parameters.
 * @param options - The options for the wrap function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeWrap } from "thirdweb/extensions/erc721";
 * const result = encodeWrap({
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeWrap(options: WrapParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "wrap" function on the contract.
 * @param options - The options for the "wrap" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { wrap } from "thirdweb/extensions/erc721";
 *
 * const transaction = wrap({
 *  contract,
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
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
export declare function wrap(options: BaseTransactionOptions<WrapParams | {
    asyncParams: () => Promise<WrapParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=wrap.d.ts.map