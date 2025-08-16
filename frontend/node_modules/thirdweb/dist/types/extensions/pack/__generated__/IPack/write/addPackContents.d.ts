import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "addPackContents" function.
 */
export type AddPackContentsParams = WithOverrides<{
    packId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_packId";
    }>;
    contents: AbiParameterToPrimitiveType<{
        type: "tuple[]";
        name: "_contents";
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
                name: "totalAmount";
            }
        ];
    }>;
    numOfRewardUnits: AbiParameterToPrimitiveType<{
        type: "uint256[]";
        name: "_numOfRewardUnits";
    }>;
    recipient: AbiParameterToPrimitiveType<{
        type: "address";
        name: "_recipient";
    }>;
}>;
export declare const FN_SELECTOR: "0xa96b1438";
/**
 * Checks if the `addPackContents` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addPackContents` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isAddPackContentsSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isAddPackContentsSupported(["0x..."]);
 * ```
 */
export declare function isAddPackContentsSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "addPackContents" function.
 * @param options - The options for the addPackContents function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeAddPackContentsParams } from "thirdweb/extensions/pack";
 * const result = encodeAddPackContentsParams({
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeAddPackContentsParams(options: AddPackContentsParams): `0x${string}`;
/**
 * Encodes the "addPackContents" function into a Hex string with its parameters.
 * @param options - The options for the addPackContents function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeAddPackContents } from "thirdweb/extensions/pack";
 * const result = encodeAddPackContents({
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeAddPackContents(options: AddPackContentsParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "addPackContents" function on the contract.
 * @param options - The options for the "addPackContents" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addPackContents } from "thirdweb/extensions/pack";
 *
 * const transaction = addPackContents({
 *  contract,
 *  packId: ...,
 *  contents: ...,
 *  numOfRewardUnits: ...,
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
export declare function addPackContents(options: BaseTransactionOptions<AddPackContentsParams | {
    asyncParams: () => Promise<AddPackContentsParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=addPackContents.d.ts.map