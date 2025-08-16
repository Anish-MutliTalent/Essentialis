import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "activateProgram" function.
 */
export type ActivateProgramParams = WithOverrides<{
    program: AbiParameterToPrimitiveType<{
        type: "address";
        name: "program";
    }>;
}>;
export declare const FN_SELECTOR: "0x58c780c2";
/**
 * Checks if the `activateProgram` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `activateProgram` method is supported.
 * @extension STYLUS
 * @example
 * ```ts
 * import { isActivateProgramSupported } from "thirdweb/extensions/stylus";
 *
 * const supported = isActivateProgramSupported(["0x..."]);
 * ```
 */
export declare function isActivateProgramSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "activateProgram" function.
 * @param options - The options for the activateProgram function.
 * @returns The encoded ABI parameters.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeActivateProgramParams } from "thirdweb/extensions/stylus";
 * const result = encodeActivateProgramParams({
 *  program: ...,
 * });
 * ```
 */
export declare function encodeActivateProgramParams(options: ActivateProgramParams): `0x${string}`;
/**
 * Encodes the "activateProgram" function into a Hex string with its parameters.
 * @param options - The options for the activateProgram function.
 * @returns The encoded hexadecimal string.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeActivateProgram } from "thirdweb/extensions/stylus";
 * const result = encodeActivateProgram({
 *  program: ...,
 * });
 * ```
 */
export declare function encodeActivateProgram(options: ActivateProgramParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "activateProgram" function on the contract.
 * @param options - The options for the "activateProgram" function.
 * @returns A prepared transaction object.
 * @extension STYLUS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { activateProgram } from "thirdweb/extensions/stylus";
 *
 * const transaction = activateProgram({
 *  contract,
 *  program: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function activateProgram(options: BaseTransactionOptions<ActivateProgramParams | {
    asyncParams: () => Promise<ActivateProgramParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=activateProgram.d.ts.map