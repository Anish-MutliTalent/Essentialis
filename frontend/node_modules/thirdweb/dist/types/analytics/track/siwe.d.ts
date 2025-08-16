import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
type SiweEvent = {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    walletAddress?: string;
    walletType?: string;
    chainId?: number;
    error?: {
        message: string;
        code: string;
    };
};
/**
 * @internal
 */
export declare function trackLogin(event: SiweEvent): Promise<void | Response>;
export {};
//# sourceMappingURL=siwe.d.ts.map