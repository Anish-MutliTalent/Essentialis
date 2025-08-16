import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "upgradeTo" function.
 */
export type UpgradeToParams = WithOverrides<{
    newImplementation: AbiParameterToPrimitiveType<{
        type: "address";
        name: "newImplementation";
    }>;
}>;
export declare const FN_SELECTOR: "0x3659cfe6";
/**
 * Checks if the `upgradeTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `upgradeTo` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isUpgradeToSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isUpgradeToSupported(["0x..."]);
 * ```
 */
export declare function isUpgradeToSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "upgradeTo" function.
 * @param options - The options for the upgradeTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeUpgradeToParams } from "thirdweb/extensions/erc7579";
 * const result = encodeUpgradeToParams({
 *  newImplementation: ...,
 * });
 * ```
 */
export declare function encodeUpgradeToParams(options: UpgradeToParams): `0x${string}`;
/**
 * Encodes the "upgradeTo" function into a Hex string with its parameters.
 * @param options - The options for the upgradeTo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeUpgradeTo } from "thirdweb/extensions/erc7579";
 * const result = encodeUpgradeTo({
 *  newImplementation: ...,
 * });
 * ```
 */
export declare function encodeUpgradeTo(options: UpgradeToParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "upgradeTo" function on the contract.
 * @param options - The options for the "upgradeTo" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { upgradeTo } from "thirdweb/extensions/erc7579";
 *
 * const transaction = upgradeTo({
 *  contract,
 *  newImplementation: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function upgradeTo(options: BaseTransactionOptions<UpgradeToParams | {
    asyncParams: () => Promise<UpgradeToParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=upgradeTo.d.ts.map