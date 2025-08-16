import type { SmartWalletOptions } from "../types.js";
export type ERC7579Config = SmartWalletOptions & {
    validatorAddress: string;
    factoryAddress: string;
};
/**
 * Config for a ERC7579 modular smart wallet.
 *
 * This configuration is in BETA, expect breaking changes.
 *
 * @param options - Optional overrides for the smart wallet.
 * @returns The smart wallet options.
 *
 * @example
 * ```typescript
 * import { sepolia } from "thirdweb/chains";
 * import { smartWallet, Config } from "thirdweb/wallets/smart";
 *
 * const modularSmartWallet = smartWallet(
 *   Config.erc7579({
 *     chain: sepolia,
 *     sponsorGas: true,
 *     factoryAddress: "0x...", // the 7579 factory address
 *     validatorAddress: "0x...", // the default validator module address
 *   }),
 * });
 * ```
 *
 * @wallet
 * @extension ERC7579
 * @beta
 */
export declare function erc7579(options: ERC7579Config): SmartWalletOptions;
//# sourceMappingURL=7579.d.ts.map