import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { UserDetailsApiType } from "../../../core/authentication/types.js";
export declare const verifyClientId: (client: ThirdwebClient) => Promise<{
    success: boolean;
}>;
export declare function authFetchEmbeddedWalletUser(args: {
    client: ThirdwebClient;
    url: string;
    props: Parameters<typeof fetch>[1];
    storage: ClientScopedStorage;
    retries?: number;
}): Promise<Response>;
export declare function fetchUserDetails(args: {
    email?: string;
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<UserDetailsApiType>;
export declare function storeUserShares({ client, walletAddress, maybeEncryptedRecoveryShares, authShare, storage, }: {
    client: ThirdwebClient;
    walletAddress: string;
    maybeEncryptedRecoveryShares?: {
        share: string;
        isClientEncrypted: boolean;
    }[];
    authShare?: string;
    storage: ClientScopedStorage;
}): Promise<void>;
export declare function getUserShares(args: {
    client: ThirdwebClient;
    getShareUrl: URL;
    storage: ClientScopedStorage;
}): Promise<{
    authShare?: string;
    maybeEncryptedRecoveryShares?: string[];
}>;
export declare function deleteAccount(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<any>;
//# sourceMappingURL=fetchers.d.ts.map