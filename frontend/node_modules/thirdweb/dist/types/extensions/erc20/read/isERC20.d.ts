/**
 * Check if a contract is an ERC20 token.
 * @param options - The transaction options.
 * @returns A boolean indicating whether the contract is an ERC20 token.
 * @extension ERC20
 * @example
 * ```ts
 * import { isERC20 } from "thirdweb/extensions/erc20";
 * import { resolveContractAbi } from "thirdweb/contract";
 *
 * const abi = await resolveContractAbi(contract);
 * const selectors = abi
 *   .filter((f) => f.type === "function")
 *   .map((f) => toFunctionSelector(f));
 *
 * const result = await isERC20(selectors);
 * ```
 */
export declare function isERC20(availableSelectors: string[]): boolean;
//# sourceMappingURL=isERC20.d.ts.map