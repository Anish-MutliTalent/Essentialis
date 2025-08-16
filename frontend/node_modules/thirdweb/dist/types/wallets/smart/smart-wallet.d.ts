import type { Wallet } from "../interfaces/wallet.js";
import type { SmartWalletOptions } from "./types.js";
/**
 * Creates a ERC4337 smart wallet based on a admin account.
 *
 * Smart wallets are smart contract wallets that enable multiple benefits for users:
 *
 * - Sponsor gas fees for transactions
 * - Multiple owners
 * - Session keys
 * - Batch transactions
 * - Predictable addresses
 * - Programmable features
 *
 * [Learn more about account abstraction](https://portal.thirdweb.com/connect/account-abstraction/how-it-works)
 *
 * @param createOptions - The options for creating the wallet.
 * Refer to [SmartWalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/SmartWalletCreationOptions) for more details.
 * @returns The created smart wallet.
 * @example
 *
 * ## Connect to a smart wallet
 *
 * To connect to a smart wallet, you need to provide an admin account as the `personalAccount` option.
 *
 * Any wallet can be used as an admin account, including an in-app wallets.
 *
 * The `sponsorGas` option is used to enable sponsored gas for transactions automatically.
 *
 * ```ts
 * import { smartWallet, inAppWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 * import { sendTransaction } from "thirdweb";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 * });
 *
 * // any wallet can be used as an admin account
 * // in this example we use an in-app wallet
 * const adminWallet = inAppWallet();
 * const personalAccount = await adminWallet.connect({
 *   client,
 *   chain: sepolia,
 *   strategy: "google",
 * });
 *
 * const smartAccount = await wallet.connect({
 *   client,
 *   personalAccount, // pass the admin account
 * });
 *
 * // sending sponsored transactions with the smartAccount
 * await sendTransaction({
 *   account: smartAccount,
 *   transaction,
 * });
 * ```
 *
 * ## Using a custom account factory
 *
 * You can pass a custom account factory to the `smartWallet` function to use a your own account factory.
 *
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 *  factoryAddress: "0x...", // custom factory address
 * });
 * ```
 *
 * ## Using v0.7 Entrypoint
 *
 * Both v0.6 (default) and v0.7 ERC4337 Entrypoints are supported. To use the v0.7 Entrypoint, simply pass in a compatible account factory.
 *
 * You can use the predeployed `DEFAULT_ACCOUNT_FACTORY_V0_7` or deploy your own [AccountFactory  v0.7](https://thirdweb.com/thirdweb.eth/AccountFactory_0_7).
 *
 * ```ts
 * import { smartWallet, DEFAULT_ACCOUNT_FACTORY_V0_7 } from "thirdweb/wallets/smart";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 *  factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7, // 0.7 factory address
 * });
 * ```
 *
 * ## Configuring the smart wallet
 *
 * You can pass options to the `smartWallet` function to configure the smart wallet.
 *
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 *  factoryAddress: "0x...", // custom factory address
 *  overrides: {
 *    accountAddress: "0x...", // override account address
 *    accountSalt: "0x...", // override account salt
 *    entrypointAddress: "0x...", // override entrypoint address
 *    tokenPaymaster: TokenPaymaster.BASE_USDC, // enable erc20 paymaster
 *    bundlerUrl: "https://...", // override bundler url
 *    paymaster: (userOp) => { ... }, // override paymaster
 *    ...
 *  }
 * });
 * ```
 *
 * Refer to [SmartWalletOptions](https://portal.thirdweb.com/references/typescript/v5/SmartWalletOptions) for more details.
 *
 * @wallet
 */
export declare function smartWallet(createOptions: SmartWalletOptions): Wallet<"smart">;
//# sourceMappingURL=smart-wallet.d.ts.map