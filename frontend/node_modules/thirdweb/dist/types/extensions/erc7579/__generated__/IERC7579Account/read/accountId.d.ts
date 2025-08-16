import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
export declare const FN_SELECTOR: "0x9cfd7cff";
/**
 * Checks if the `accountId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `accountId` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isAccountIdSupported } from "thirdweb/extensions/erc7579";
 * const supported = isAccountIdSupported(["0x..."]);
 * ```
 */
export declare function isAccountIdSupported(availableSelectors: string[]): boolean;
/**
 * Decodes the result of the accountId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeAccountIdResult } from "thirdweb/extensions/erc7579";
 * const result = decodeAccountIdResultResult("...");
 * ```
 */
export declare function decodeAccountIdResult(result: Hex): string;
/**
 * Calls the "accountId" function on the contract.
 * @param options - The options for the accountId function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { accountId } from "thirdweb/extensions/erc7579";
 *
 * const result = await accountId({
 *  contract,
 * });
 *
 * ```
 */
export declare function accountId(options: BaseTransactionOptions): Promise<string>;
//# sourceMappingURL=accountId.d.ts.map