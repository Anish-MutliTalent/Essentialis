import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../interfaces/wallet.js";
import type { CreateWalletArgs, EcosystemWalletId } from "../../../wallet-types.js";
import type { InAppConnector } from "../interfaces/connector.js";
import type { Ecosystem } from "./types.js";
/**
 * @internal
 */
export declare function getOrCreateInAppWalletConnector(client: ThirdwebClient, connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>, ecosystem?: Ecosystem): Promise<InAppConnector>;
/**
 * @internal
 */
export declare function createInAppWallet(args: {
    createOptions?: CreateWalletArgs<"inApp">[1];
    connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>;
    ecosystem?: Ecosystem;
}): Wallet<"inApp" | EcosystemWalletId>;
//# sourceMappingURL=in-app-core.d.ts.map