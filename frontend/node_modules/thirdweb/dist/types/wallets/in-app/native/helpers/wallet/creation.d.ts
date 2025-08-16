import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
export declare function setUpNewUserWallet(args: {
    recoveryCode: string;
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<{
    recoveryCode: string;
} & {
    walletAddress: string;
} & {
    deviceShareStored: string;
    isIframeStorageEnabled: boolean;
}>;
/**
 * Store user's wallet shares. Encrypts authShare and recoveryShare as given clientSide as well.
 * @param walletAddress - the user's wallet address. Note that for each logged in user and clientId, we have a single walletAddress. This will error if we attempt to store shares for user's with an existing wallet different from the walletAddress
 * @param authShare - the *unencrypted* authShare for the user
 * @param recoveryShare - the *unencrypted* recovery share for the user
 * @throws if another walletAddress already exists
 */
export declare function storeShares<R extends string | undefined>({ client, walletAddress, authShare, deviceShare, recoveryShares, storage, }: {
    client: ThirdwebClient;
    walletAddress: string;
    authShare?: string;
    deviceShare?: string;
    recoveryShares?: R extends string ? {
        share: R;
        recoveryCode: string;
    }[] : never;
    storage: ClientScopedStorage;
}): Promise<{
    deviceShareStored: string;
} | undefined>;
//# sourceMappingURL=creation.d.ts.map