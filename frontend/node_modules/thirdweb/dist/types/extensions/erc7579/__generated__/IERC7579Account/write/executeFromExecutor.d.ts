import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions, WithOverrides } from "../../../../../transaction/types.js";
/**
 * Represents the parameters for the "executeFromExecutor" function.
 */
export type ExecuteFromExecutorParams = WithOverrides<{
    mode: AbiParameterToPrimitiveType<{
        type: "bytes32";
        name: "mode";
    }>;
    executionCalldata: AbiParameterToPrimitiveType<{
        type: "bytes";
        name: "executionCalldata";
    }>;
}>;
export declare const FN_SELECTOR: "0xd691c964";
/**
 * Checks if the `executeFromExecutor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `executeFromExecutor` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isExecuteFromExecutorSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isExecuteFromExecutorSupported(["0x..."]);
 * ```
 */
export declare function isExecuteFromExecutorSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "executeFromExecutor" function.
 * @param options - The options for the executeFromExecutor function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeExecuteFromExecutorParams } from "thirdweb/extensions/erc7579";
 * const result = encodeExecuteFromExecutorParams({
 *  mode: ...,
 *  executionCalldata: ...,
 * });
 * ```
 */
export declare function encodeExecuteFromExecutorParams(options: ExecuteFromExecutorParams): `0x${string}`;
/**
 * Encodes the "executeFromExecutor" function into a Hex string with its parameters.
 * @param options - The options for the executeFromExecutor function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeExecuteFromExecutor } from "thirdweb/extensions/erc7579";
 * const result = encodeExecuteFromExecutor({
 *  mode: ...,
 *  executionCalldata: ...,
 * });
 * ```
 */
export declare function encodeExecuteFromExecutor(options: ExecuteFromExecutorParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Prepares a transaction to call the "executeFromExecutor" function on the contract.
 * @param options - The options for the "executeFromExecutor" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { executeFromExecutor } from "thirdweb/extensions/erc7579";
 *
 * const transaction = executeFromExecutor({
 *  contract,
 *  mode: ...,
 *  executionCalldata: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function executeFromExecutor(options: BaseTransactionOptions<ExecuteFromExecutorParams | {
    asyncParams: () => Promise<ExecuteFromExecutorParams>;
}>): import("../../../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=executeFromExecutor.d.ts.map