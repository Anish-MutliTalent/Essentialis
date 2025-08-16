import type { ThirdwebClient } from "../../../../client/client.js";
import type { Ecosystem } from "../wallet/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";
export declare function authEndpoint(args: {
    payload: string;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType>;
//# sourceMappingURL=authEndpoint.d.ts.map