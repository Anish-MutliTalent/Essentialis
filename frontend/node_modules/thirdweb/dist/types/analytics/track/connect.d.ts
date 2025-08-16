import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
/**
 * @internal
 */
export declare function trackConnect(args: {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    walletType: string;
    walletAddress: string;
    chainId?: number;
}): Promise<void | Response>;
//# sourceMappingURL=connect.d.ts.map