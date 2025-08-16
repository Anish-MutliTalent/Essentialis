import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "createAccountWithModules" function.
 */
export type CreateAccountWithModulesParams = WithOverrides<{
    owner: AbiParameterToPrimitiveType<{
        type: "address";
        name: "owner";
    }>;
    salt: AbiParameterToPrimitiveType<{
        type: "bytes";
        name: "salt";
    }>;
    modules: AbiParameterToPrimitiveType<{
        type: "tuple[]";
        name: "modules";
        components: [
            {
                type: "uint256";
                name: "moduleTypeId";
            },
            {
                type: "address";
                name: "module";
            },
            {
                type: "bytes";
                name: "initData";
            }
        ];
    }>;
}>;
export declare const FN_SELECTOR: "0x7c37d0dc";
/**
 * Checks if the `createAccountWithModules` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAccountWithModules` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isCreateAccountWithModulesSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isCreateAccountWithModulesSupported(["0x..."]);
 * ```
 */
export declare function isCreateAccountWithModulesSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "createAccountWithModules" function.
 * @param options - The options for the createAccountWithModules function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeCreateAccountWithModulesParams } from "thirdweb/extensions/erc7579";
 * const result = encodeCreateAccountWithModulesParams({
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 * });
 * ```
 */
export declare function encodeCreateAccountWithModulesParams(options: CreateAccountWithModulesParams): `0x${string}`;
/**
 * Encodes the "createAccountWithModules" function into a Hex string with its parameters.
 * @param options - The options for the createAccountWithModules function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeCreateAccountWithModules } from "thirdweb/extensions/erc7579";
 * const result = encodeCreateAccountWithModules({
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 * });
 * ```
 */
export declare function encodeCreateAccountWithModules(options: CreateAccountWithModulesParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "createAccountWithModules" function on the contract.
 * @param options - The options for the "createAccountWithModules" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAccountWithModules } from "thirdweb/extensions/erc7579";
 *
 * const transaction = createAccountWithModules({
 *  contract,
 *  owner: ...,
 *  salt: ...,
 *  modules: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function createAccountWithModules(options: BaseTransactionOptions<CreateAccountWithModulesParams | {
    asyncParams: () => Promise<CreateAccountWithModulesParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=createAccountWithModules.d.ts.map