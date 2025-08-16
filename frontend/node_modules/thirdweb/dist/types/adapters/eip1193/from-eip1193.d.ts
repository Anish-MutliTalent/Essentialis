import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../wallets/wallet-types.js";
import type { EIP1193Provider } from "./types.js";
/**
 * Options for creating an EIP-1193 provider adapter.
 */
export type FromEip1193AdapterOptions = {
    provider: EIP1193Provider | ((params?: {
        chainId?: number;
    }) => Promise<EIP1193Provider>);
    walletId?: WalletId;
};
/**
 * Creates a Thirdweb wallet from an EIP-1193 compatible provider.
 *
 * This adapter allows you to use any EIP-1193 provider (like MetaMask, WalletConnect, etc.) as a Thirdweb wallet.
 * It handles all the necessary conversions between the EIP-1193 interface and Thirdweb's wallet interface.
 *
 * @param options - Configuration options for creating the wallet adapter
 * @param options.provider - An EIP-1193 compatible provider or a function that returns one
 * @param options.walletId - Optional custom wallet ID to identify this provider (defaults to "adapter")
 * @returns A Thirdweb wallet instance that wraps the EIP-1193 provider
 *
 * @example
 * ```ts
 * import { EIP1193 } from "thirdweb/wallets";
 *
 * // Create a Thirdweb wallet from MetaMask's provider
 * const wallet = EIP1193.fromProvider({
 *   provider: window.ethereum,
 *   walletId: "io.metamask"
 * });
 *
 * // Use like any other Thirdweb wallet
 * const account = await wallet.connect({
 *   client: createThirdwebClient({ clientId: "..." })
 * });
 *
 * // Sign messages
 * await account.signMessage({ message: "Hello World" });
 *
 * // Send transactions
 * await account.sendTransaction({
 *   to: "0x...",
 *   value: 1000000000000000000n
 * });
 * ```
 *
 * @extension EIP1193
 */
export declare function fromProvider(options: FromEip1193AdapterOptions): Wallet;
//# sourceMappingURL=from-eip1193.d.ts.map