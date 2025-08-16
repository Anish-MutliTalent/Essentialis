import type { ThirdwebClient } from "../../../../client/client.js";
import type { Ecosystem } from "../wallet/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";
/**
 * Authenticates via the wallet secret
 * @internal
 */
export declare function backendAuthenticate(args: {
    client: ThirdwebClient;
    walletSecret: string;
    ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType>;
//# sourceMappingURL=backend.d.ts.map