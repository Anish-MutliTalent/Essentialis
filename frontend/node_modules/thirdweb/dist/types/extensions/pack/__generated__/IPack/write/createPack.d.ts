import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "createPack" function.
 */
export type CreatePackParams = WithOverrides<{
    contents: AbiParameterToPrimitiveType<{
        type: "tuple[]";
        name: "contents";
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
        name: "numOfRewardUnits";
    }>;
    packUri: AbiParameterToPrimitiveType<{
        type: "string";
        name: "packUri";
    }>;
    openStartTimestamp: AbiParameterToPrimitiveType<{
        type: "uint128";
        name: "openStartTimestamp";
    }>;
    amountDistributedPerOpen: AbiParameterToPrimitiveType<{
        type: "uint128";
        name: "amountDistributedPerOpen";
    }>;
    recipient: AbiParameterToPrimitiveType<{
        type: "address";
        name: "recipient";
    }>;
}>;
export declare const FN_SELECTOR: "0x092e6075";
/**
 * Checks if the `createPack` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createPack` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isCreatePackSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isCreatePackSupported(["0x..."]);
 * ```
 */
export declare function isCreatePackSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "createPack" function.
 * @param options - The options for the createPack function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCreatePackParams } from "thirdweb/extensions/pack";
 * const result = encodeCreatePackParams({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeCreatePackParams(options: CreatePackParams): `0x${string}`;
/**
 * Encodes the "createPack" function into a Hex string with its parameters.
 * @param options - The options for the createPack function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCreatePack } from "thirdweb/extensions/pack";
 * const result = encodeCreatePack({
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
 *  recipient: ...,
 * });
 * ```
 */
export declare function encodeCreatePack(options: CreatePackParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "createPack" function on the contract.
 * @param options - The options for the "createPack" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createPack } from "thirdweb/extensions/pack";
 *
 * const transaction = createPack({
 *  contract,
 *  contents: ...,
 *  numOfRewardUnits: ...,
 *  packUri: ...,
 *  openStartTimestamp: ...,
 *  amountDistributedPerOpen: ...,
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
export declare function createPack(options: BaseTransactionOptions<CreatePackParams | {
    asyncParams: () => Promise<CreatePackParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=createPack.d.ts.map