import type { Account } from "viem/accounts";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { EIP1193Provider } from "./types.js";
export type ToEip1193ProviderOptions = {
    wallet: Wallet;
    chain: Chain;
    client: ThirdwebClient;
    connectOverride?: (wallet: Wallet) => Promise<Account>;
};
/**
 * Converts a Thirdweb wallet into an EIP-1193 compatible provider.
 *
 * This adapter allows you to use a Thirdweb wallet with any library or dApp that expects an EIP-1193 provider.
 * The provider implements the standard EIP-1193 interface including request handling and event subscription.
 *
 * @param options - Configuration options for creating the provider
 * @param options.wallet - The Thirdweb wallet to adapt into a provider
 * @param options.chain - The blockchain chain to connect to
 * @param options.client - The Thirdweb client instance
 * @param options.connectOverride - Optional custom connect handler to override default connection behavior
 * @returns An EIP-1193 compatible provider that wraps the Thirdweb wallet
 *
 * @example
 * ```ts
 * import { EIP1193 } from "thirdweb/wallets";
 *
 * // Create an EIP-1193 provider from a Thirdweb wallet
 * const provider = EIP1193.toProvider({
 *   wallet,
 *   chain: ethereum,
 *   client: createThirdwebClient({ clientId: "..." })
 * });
 *
 * // Use with any EIP-1193 compatible library
 * const accounts = await provider.request({
 *   method: "eth_requestAccounts"
 * });
 *
 * // Listen for events
 * provider.on("accountsChanged", (accounts) => {
 *   console.log("Active accounts:", accounts);
 * });
 * ```
 *
 * @extension EIP1193
 */
export declare function toProvider(options: ToEip1193ProviderOptions): EIP1193Provider;
//# sourceMappingURL=to-eip1193.d.ts.map