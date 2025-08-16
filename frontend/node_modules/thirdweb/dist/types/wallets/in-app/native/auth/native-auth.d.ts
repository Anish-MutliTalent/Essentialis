import type { ThirdwebClient } from "../../../../client/client.js";
import type { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType, OAuthRedirectObject } from "../../core/authentication/types.js";
import type { Ecosystem } from "../../core/wallet/types.js";
export declare function socialAuth(args: {
    auth: OAuthRedirectObject;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType>;
export declare function deleteActiveAccount(options: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<boolean>;
//# sourceMappingURL=native-auth.d.ts.map