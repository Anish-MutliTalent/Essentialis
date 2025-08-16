import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../core/authentication/types.js";
export declare function postAuth({ storedToken, client, encryptionKey, storage, }: {
    storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
    client: ThirdwebClient;
    encryptionKey?: string;
    storage: ClientScopedStorage;
}): Promise<{
    jwtToken: string;
    authProvider: import("../../../core/authentication/types.js").AuthProvider;
    authDetails: import("../../../core/authentication/types.js").AuthDetails;
    developerClientId: string;
} & {
    cookieString: string;
    shouldStoreCookieString: boolean;
    isNewUser: boolean;
}>;
//# sourceMappingURL=middleware.d.ts.map