import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Account } from "../../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { AuthResultAndRecoveryCode, GetUser } from "../../../core/authentication/types.js";
import type { IWebWallet } from "../../../core/wallet/web-wallet.js";
export declare class ShardedWallet implements IWebWallet {
    private client;
    private storage;
    constructor(args: {
        client: ThirdwebClient;
        storage: ClientScopedStorage;
    });
    postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void>;
    getUserWalletStatus(): Promise<GetUser>;
    getAccount(): Promise<Account>;
}
//# sourceMappingURL=sharded-wallet.d.ts.map