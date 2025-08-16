import type { ThirdwebClient } from "../../../../client/client.js";
import type { Ecosystem } from "../wallet/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";
export declare function customJwt(args: {
    jwt: string;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType>;
//# sourceMappingURL=jwt.d.ts.map