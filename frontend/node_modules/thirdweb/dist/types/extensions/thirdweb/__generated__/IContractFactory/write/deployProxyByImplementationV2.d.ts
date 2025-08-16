import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "deployProxyByImplementationV2" function.
 */
export type DeployProxyByImplementationV2Params = WithOverrides<{
    implementation: AbiParameterToPrimitiveType<{
        type: "address";
        name: "implementation";
    }>;
    data: AbiParameterToPrimitiveType<{
        type: "bytes";
        name: "data";
    }>;
    salt: AbiParameterToPrimitiveType<{
        type: "bytes32";
        name: "salt";
    }>;
    extraData: AbiParameterToPrimitiveType<{
        type: "bytes";
        name: "extraData";
    }>;
}>;
export declare const FN_SELECTOR: "0xd057c8b1";
/**
 * Checks if the `deployProxyByImplementationV2` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployProxyByImplementationV2` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isDeployProxyByImplementationV2Supported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isDeployProxyByImplementationV2Supported(["0x..."]);
 * ```
 */
export declare function isDeployProxyByImplementationV2Supported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "deployProxyByImplementationV2" function.
 * @param options - The options for the deployProxyByImplementationV2 function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementationV2Params } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationV2Params({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export declare function encodeDeployProxyByImplementationV2Params(options: DeployProxyByImplementationV2Params): `0x${string}`;
/**
 * Encodes the "deployProxyByImplementationV2" function into a Hex string with its parameters.
 * @param options - The options for the deployProxyByImplementationV2 function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementationV2 } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationV2({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export declare function encodeDeployProxyByImplementationV2(options: DeployProxyByImplementationV2Params): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "deployProxyByImplementationV2" function on the contract.
 * @param options - The options for the "deployProxyByImplementationV2" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployProxyByImplementationV2 } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementationV2({
 *  contract,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function deployProxyByImplementationV2(options: BaseTransactionOptions<DeployProxyByImplementationV2Params | {
    asyncParams: () => Promise<DeployProxyByImplementationV2Params>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=deployProxyByImplementationV2.d.ts.map