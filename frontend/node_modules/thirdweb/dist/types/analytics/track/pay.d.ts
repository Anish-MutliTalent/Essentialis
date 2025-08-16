import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
/**
 * @internal
 */
export declare function trackPayEvent(args: {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    event: string;
    walletAddress?: string;
    walletType?: string;
    fromToken?: string;
    amountWei?: string;
    chainId?: number;
    toToken?: string;
    toChainId?: number;
    error?: string;
}): Promise<void | Response>;
//# sourceMappingURL=pay.d.ts.map