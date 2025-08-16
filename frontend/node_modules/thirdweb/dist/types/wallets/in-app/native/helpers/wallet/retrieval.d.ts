import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Account } from "../../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { SetUpWalletRpcReturnType } from "../../../core/authentication/types.js";
/**
 * For users on a known device and logged in.
 * Will throw if called on a new device // user not logged in
 */
export declare function getExistingUserAccount(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<Account>;
export declare function getWalletPrivateKeyFromShares(shares: string[]): Promise<string>;
/**
 *
 * @param deviceShare - retrieves the current share associated with the user's device.
 * @returns The requested shares
 * @throws if attempting to get deviceShare when it's not present
 */
export declare function getShares<A extends boolean, D extends boolean, R extends boolean>({ client, authShare, deviceShare, recoveryShare, storage, }: {
    client: ThirdwebClient;
    authShare: {
        toRetrieve: A;
    };
    recoveryShare: R extends true ? {
        toRetrieve: R;
        recoveryCode: string;
    } : {
        toRetrieve: R;
    };
    deviceShare: {
        toRetrieve: D;
    };
    storage: ClientScopedStorage;
}): Promise<{
    authShare: A extends true ? string : undefined;
    recoveryShare: R extends true ? string : undefined;
    deviceShare: D extends true ? string : undefined;
}>;
export declare function setUpShareForNewDevice({ recoveryCode, client, storage, }: {
    recoveryCode: string;
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<SetUpWalletRpcReturnType>;
//# sourceMappingURL=retrieval.d.ts.map