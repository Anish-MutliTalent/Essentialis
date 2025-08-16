import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Account } from "../interfaces/wallet.js";
import type { SmartWalletConnectionOptions, SmartWalletOptions } from "./types.js";
export { isSmartWallet } from "./is-smart-wallet.js";
/**
 * @internal
 */
export declare function connectSmartAccount(connectionOptions: SmartWalletConnectionOptions, creationOptions: SmartWalletOptions): Promise<[Account, Chain]>;
/**
 * @internal
 */
export declare function disconnectSmartAccount(account: Account): Promise<void>;
export declare function getEntrypointFromFactory(factoryAddress: string, client: ThirdwebClient, chain: Chain): Promise<string | undefined>;
//# sourceMappingURL=index.d.ts.map